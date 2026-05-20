import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type MeResponse =
  | { ok: true; user: null }
  | { ok: true; user: { user_id: number; email: string; role: "admin" | "user" } };

type Employee = {
  employee_id: number;
  employee_name: string;
  department_id: number | null;
  department_name: string | null;
};

type Spending = {
  spending_id: number;
  employee_id: number;
  employee_name: string;
  department_name: string | null;
  spending_date: string; // ISO date string from PG
  value: string | number; // pg may return as string
};

export const Route = createFileRoute("/spendings")({
  component: SpendingsPage,
});

async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/auth/me");
  return res.json();
}

async function fetchEmployees(): Promise<{ ok: true; data: Employee[] } | { ok: false; error: string }> {
  const res = await fetch("/api/employees");
  return res.json();
}

async function fetchSpendings(): Promise<{ ok: true; data: Spending[] } | { ok: false; error: string }> {
  const res = await fetch("/api/spendings");
  return res.json();
}

function SpendingsPage() {
  const qc = useQueryClient();

  const meQuery = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const me = meQuery.data?.user ?? null;
  const isAdmin = me?.role === "admin";

  const employeesQuery = useQuery({ queryKey: ["employees"], queryFn: fetchEmployees });
  const spendingsQuery = useQuery({ queryKey: ["spendings"], queryFn: fetchSpendings });

  const employees =
    employeesQuery.data && "data" in employeesQuery.data ? employeesQuery.data.data : [];

  const spendings =
    spendingsQuery.data && "data" in spendingsQuery.data ? spendingsQuery.data.data : [];

  const [newEmployeeId, setNewEmployeeId] = React.useState<number | "">("");
  const [newDate, setNewDate] = React.useState("");
  const [newValue, setNewValue] = React.useState<string>("");

  const createMutation = useMutation({
    mutationFn: async (vars: { employee_id: number; spending_date: string; value: number }) => {
      const res = await fetch("/api/spendings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vars),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Create failed");
      return data;
    },
    onSuccess: async () => {
      setNewEmployeeId("");
      setNewDate("");
      setNewValue("");
      await qc.invalidateQueries({ queryKey: ["spendings"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (vars: { spending_id: number; employee_id: number; spending_date: string; value: number }) => {
      const res = await fetch(`/api/spendings/${vars.spending_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: vars.employee_id,
          spending_date: vars.spending_date,
          value: vars.value,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Update failed");
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["spendings"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (spending_id: number) => {
      const res = await fetch(`/api/spendings/${spending_id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Delete failed");
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["spendings"] });
    },
  });

  if (meQuery.isLoading) return <main className="page-wrap px-4 pb-8 pt-14">Loading...</main>;

  if (!me) {
    return (
      <main className="page-wrap px-4 pb-8 pt-14">
        <div className="island-shell rounded-2xl p-6">
          <p className="m-0">You must login first.</p>
          <p className="mt-3">
            <Link to="/login" className="nav-link">
              Go to Login
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rounded-2xl p-6">
        <h1 className="m-0 text-xl font-semibold">Spendings</h1>
        <p className="mt-2 text-sm text-(--sea-ink-soft)">
          Logged in as <strong>{me.email}</strong> ({me.role})
        </p>

        <form
          className="mt-4 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (newEmployeeId === "") return;
            createMutation.mutate({
              employee_id: Number(newEmployeeId),
              spending_date: newDate,
              value: Number(newValue),
            });
          }}
        >
          <select
            className="rounded-lg border border-(--line) bg-white/50 px-3 py-2 text-sm"
            value={newEmployeeId}
            onChange={(e) => setNewEmployeeId(e.currentTarget.value === "" ? "" : Number(e.currentTarget.value))}
            required
          >
            <option value="" disabled>
              Select employee...
            </option>
            {employees.map((e) => (
              <option key={e.employee_id} value={e.employee_id}>
                {e.employee_name}
              </option>
            ))}
          </select>

          <input
            className="rounded-lg border border-(--line) bg-white/50 px-3 py-2 text-sm"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.currentTarget.value)}
            required
          />

          <input
            className="w-40 rounded-lg border border-(--line) bg-white/50 px-3 py-2 text-sm"
            type="number"
            step="0.01"
            placeholder="Value"
            value={newValue}
            onChange={(e) => setNewValue(e.currentTarget.value)}
            required
          />

          <button
            className="rounded-lg border border-(--line) bg-[rgba(79,184,178,0.14)] px-4 py-2 text-sm font-semibold"
            type="submit"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create"}
          </button>
        </form>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-225 border-collapse text-sm">
            <thead>
              <tr className="text-left">
                <th className="border-b border-(--line) py-2 pr-2">ID</th>
                <th className="border-b border-(--line) py-2 pr-2">Employee</th>
                <th className="border-b border-(--line) py-2 pr-2">Department</th>
                <th className="border-b border-(--line) py-2 pr-2">Date</th>
                <th className="border-b border-(--line) py-2 pr-2">Value</th>
                <th className="border-b border-(--line) py-2 pr-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {spendings.map((s) => (
                <SpendingRow
                  key={s.spending_id}
                  spending={s}
                  employees={employees}
                  isAdmin={isAdmin}
                  pending={updateMutation.isPending || deleteMutation.isPending}
                  onUpdate={(vars) => {
                    if (!isAdmin) {
                      alert("Akses ditolak: Hanya Admin yang dapat melakukan aksi ini.");
                      return;
                    }
                    updateMutation.mutate(vars);
                  }}
                  onDelete={() => {
                    if (!isAdmin) {
                      alert("Akses ditolak: Hanya Admin yang dapat melakukan aksi ini.");
                      return;
                    }
                    deleteMutation.mutate(s.spending_id);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function SpendingRow({
  spending,
  employees,
  isAdmin,
  pending,
  onUpdate,
  onDelete,
}: {
  spending: Spending;
  employees: Employee[];
  isAdmin: boolean;
  pending: boolean;
  onUpdate: (vars: { spending_id: number; employee_id: number; spending_date: string; value: number }) => void;
  onDelete: () => void;
}) {
  const [employeeId, setEmployeeId] = React.useState<number>(spending.employee_id);
  const [date, setDate] = React.useState<string>(spending.spending_date?.slice(0, 10) ?? "");
  const [value, setValue] = React.useState<string>(String(spending.value ?? ""));

  return (
    <tr>
      <td className="border-b border-(--line) py-2 pr-2">{spending.spending_id}</td>
      <td className="border-b border-(--line) py-2 pr-2">
        <select
          className="w-full rounded-lg border eorder-[var(--line)] bg-white/50 px-2 py-1"
          value={employeeId}
          onChange={(e) => setEmployeeId(Number(e.currentTarget.value))}
          disabled={!isAdmin || pending}
        >
          {employees.map((e) => (
            <option key={e.employee_id} value={e.employee_id}>
              {e.employee_name}
            </option>
          ))}
        </select>
      </td>
      <td className="border-b border-(--line) py-2 pr-2">
        {spending.department_name ?? "-"}
      </td>
      <td className="border-b border-(--line) py-2 pr-2">
        <input
          className="rounded-lg border border-(--line) bg-white/50 px-2 py-1"
          type="date"
          value={date}
          onChange={(e) => setDate(e.currentTarget.value)}
          disabled={!isAdmin || pending}
        />
      </td>
      <td className="border-b border-(--line) py-2 pr-2">
        <input
          className="w-32 rounded-lg border border-(--line) bg-white/50 px-2 py-1"
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          disabled={!isAdmin || pending}
        />
      </td>
      <td className="border-b border-(--line) py-2 pr-2">
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-(--line) px-3 py-1"
            type="button"
            onClick={() =>
              onUpdate({
                spending_id: spending.spending_id,
                employee_id: employeeId,
                spending_date: date,
                value: Number(value),
              })
            }
            disabled={pending}
          >
            Update
          </button>
          <button
            className="rounded-lg border border-(--line) px-3 py-1 text-red-700"
            type="button"
            onClick={onDelete}
            disabled={pending}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
