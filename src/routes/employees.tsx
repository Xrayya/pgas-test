import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type MeResponse =
  | { ok: true; user: null }
  | {
    ok: true;
    user: { user_id: number; email: string; role: "admin" | "user" };
  };

type Department = { department_id: number; department_name: string };

type Employee = {
  employee_id: number;
  employee_name: string;
  department_id: number | null;
  department_name: string | null;
};

export const Route = createFileRoute("/employees")({
  component: EmployeesPage,
});

async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/auth/me");
  return res.json();
}

async function fetchDepartments(): Promise<
  { ok: true; data: Department[] } | { ok: false; error: string }
> {
  const res = await fetch("/api/departments");
  return res.json();
}

async function fetchEmployees(
  search: string,
): Promise<{ ok: true; data: Employee[] } | { ok: false; error: string }> {
  const url = new URL("/api/employees", window.location.origin);
  if (search.trim()) url.searchParams.set("search", search.trim());
  const res = await fetch(url.toString());
  return res.json();
}

function EmployeesPage() {
  const [searchInput, setSearchInput] = React.useState("");
  const [search, setSearch] = React.useState("");

  const qc = useQueryClient();

  const meQuery = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const me = meQuery.data?.user ?? null;
  const isAdmin = me?.role === "admin";

  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });

  const employeesQuery = useQuery({
    queryKey: ["employees", { search }],
    queryFn: () => fetchEmployees(search),
  });

  const [newEmployeeName, setNewEmployeeName] = React.useState("");
  const [newDepartmentId, setNewDepartmentId] = React.useState<number | "">("");

  const createMutation = useMutation({
    mutationFn: async (vars: {
      employee_name: string;
      department_id: number;
    }) => {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vars),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Create failed");
      return data;
    },
    onSuccess: async () => {
      setNewEmployeeName("");
      setNewDepartmentId("");
      await qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (vars: {
      employee_id: number;
      employee_name: string;
      department_id: number;
    }) => {
      const res = await fetch(`/api/employees/${vars.employee_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_name: vars.employee_name,
          department_id: vars.department_id,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Update failed");
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (employee_id: number) => {
      const res = await fetch(`/api/employees/${employee_id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Delete failed");
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  if (meQuery.isLoading)
    return <main className="page-wrap px-4 pb-8 pt-14">Loading...</main>;

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

  const departments =
    departmentsQuery.data && "data" in departmentsQuery.data
      ? departmentsQuery.data.data
      : [];

  const employees =
    employeesQuery.data && "data" in employeesQuery.data
      ? employeesQuery.data.data
      : [];

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rounded-2xl p-6">
        <h1 className="m-0 text-xl font-semibold">Employees</h1>
        <p className="mt-2 text-sm text-(--sea-ink-soft)">
          Logged in as <strong>{me.email}</strong> ({me.role})
        </p>

        <form
          className="mt-4 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (newDepartmentId === "") return;
            createMutation.mutate({
              employee_name: newEmployeeName,
              department_id: Number(newDepartmentId),
            });
          }}
        >
          <input
            className="min-w-64 rounded-lg border border-(--line) bg-white/50 px-3 py-2 text-sm"
            placeholder="New employee name"
            value={newEmployeeName}
            onChange={(e) => setNewEmployeeName(e.currentTarget.value)}
            required
          />

          <select
            className="rounded-lg border border-(--line) bg-white/50 px-3 py-2 text-sm"
            value={newDepartmentId}
            onChange={(e) =>
              setNewDepartmentId(
                e.currentTarget.value === ""
                  ? ""
                  : Number(e.currentTarget.value),
              )
            }
            required
          >
            <option value="" disabled>
              Select department...
            </option>
            {departments.map((d) => (
              <option key={d.department_id} value={d.department_id}>
                {d.department_name}
              </option>
            ))}
          </select>

          <button
            className="rounded-lg border border-(--line) bg-[rgba(79,184,178,0.14)] px-4 py-2 text-sm font-semibold"
            type="submit"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create"}
          </button>
        </form>

        <form
          className="mt-4 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(searchInput);
          }}
        >
          <input
            className="min-w-64 rounded-lg border border-(--line) bg-white/50 px-3 py-2 text-sm"
            placeholder="Search employee name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.currentTarget.value)}
          />
          <button
            className="rounded-lg border border-(--line) px-4 py-2 text-sm font-semibold"
            type="submit"
          >
            Search
          </button>
          <button
            className="rounded-lg border border-(--line) px-4 py-2 text-sm"
            type="button"
            onClick={() => {
              setSearchInput("");
              setSearch("");
            }}
          >
            Reset
          </button>
        </form>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-180 border-collapse text-sm">
            <thead>
              <tr className="text-left">
                <th className="border-b border-(--line) py-2 pr-2">ID</th>
                <th className="border-b border-(--line) py-2 pr-2">
                  Employee Name
                </th>
                <th className="border-b border-(--line) py-2 pr-2">
                  Department
                </th>
                <th className="border-b border-(--line) py-2 pr-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <EmployeeRow
                  key={e.employee_id}
                  employee={e}
                  departments={departments}
                  isAdmin={isAdmin}
                  pending={updateMutation.isPending || deleteMutation.isPending}
                  onUpdate={(vars) => {
                    if (!isAdmin) {
                      alert(
                        "Akses ditolak: Hanya Admin yang dapat melakukan aksi ini.",
                      );
                      return;
                    }
                    updateMutation.mutate(vars);
                  }}
                  onDelete={() => {
                    if (!isAdmin) {
                      alert(
                        "Akses ditolak: Hanya Admin yang dapat melakukan aksi ini.",
                      );
                      return;
                    }
                    deleteMutation.mutate(e.employee_id);
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

function EmployeeRow({
  employee,
  departments,
  isAdmin,
  pending,
  onUpdate,
  onDelete,
}: {
  employee: Employee;
  departments: Department[];
  isAdmin: boolean;
  pending: boolean;
  onUpdate: (vars: {
    employee_id: number;
    employee_name: string;
    department_id: number;
  }) => void;
  onDelete: () => void;
}) {
  const [name, setName] = React.useState(employee.employee_name);
  const [departmentId, setDepartmentId] = React.useState<number>(
    employee.department_id ?? departments[0]?.department_id ?? 0,
  );

  return (
    <tr>
      <td className="border-b border-(--line) py-2 pr-2">
        {employee.employee_id}
      </td>
      <td className="border-b border-(--line) py-2 pr-2">
        <input
          className="w-full rounded-lg border border-(--line) bg-white/50 px-2 py-1"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          disabled={!isAdmin || pending}
        />
      </td>
      <td className="border-b border-(--line) py-2 pr-2">
        <select
          className="w-full rounded-lg border border-(--line) bg-white/50 px-2 py-1"
          value={departmentId}
          onChange={(e) => setDepartmentId(Number(e.currentTarget.value))}
          disabled={!isAdmin || pending}
        >
          {departments.map((d) => (
            <option key={d.department_id} value={d.department_id}>
              {d.department_name}
            </option>
          ))}
        </select>
      </td>
      <td className="border-b border-(--line) py-2 pr-2">
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-(--line) px-3 py-1"
            type="button"
            onClick={() =>
              onUpdate({
                employee_id: employee.employee_id,
                employee_name: name,
                department_id: departmentId,
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
