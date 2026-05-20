import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type MeResponse =
  | { ok: true; user: null }
  | {
    ok: true;
    user: { user_id: number; email: string; role: "admin" | "user" };
  };

type DepartmentsResponse =
  | { ok: true; data: { department_id: number; department_name: string }[] }
  | { ok: false; error: string };

export const Route = createFileRoute("/departments")({
  component: DepartmentsPage,
});

async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/auth/me");
  return res.json();
}

async function fetchDepartments(): Promise<DepartmentsResponse> {
  const res = await fetch("/api/departments");
  return res.json();
}

function DepartmentsPage() {
  const qc = useQueryClient();

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });

  const me = meQuery.data?.user ?? null;
  const isAdmin = me?.role === "admin";

  const [newName, setNewName] = React.useState("");

  const createMutation = useMutation({
    mutationFn: async (department_name: string) => {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department_name }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Create failed");
      return data;
    },
    onSuccess: async () => {
      setNewName("");
      await qc.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (vars: {
      department_id: number;
      department_name: string;
    }) => {
      const res = await fetch(`/api/departments/${vars.department_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ department_name: vars.department_name }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Update failed");
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (department_id: number) => {
      const res = await fetch(`/api/departments/${department_id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error ?? "Delete failed");
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  if (meQuery.isLoading)
    return <main className="page-wrap px-4 pb-8 pt-14">Loading...</main>;

  // Not logged in → redirect UX (simple)
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

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rounded-2xl p-6">
        <h1 className="m-0 text-xl font-semibold">Departments</h1>
        <p className="mt-2 text-sm text-(--sea-ink-soft)">
          Logged in as <strong>{me.email}</strong> ({me.role})
        </p>

        <form
          className="mt-4 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(newName);
          }}
        >
          <input
            className="min-w-64 rounded-lg border border-(--line) bg-white/50 px-3 py-2 text-sm"
            placeholder="New department name"
            value={newName}
            onChange={(e) => setNewName(e.currentTarget.value)}
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

        {departmentsQuery.isLoading ? (
          <p className="mt-4 text-sm">Loading departments...</p>
        ) : departmentsQuery.data &&
          "ok" in departmentsQuery.data &&
          (departmentsQuery.data as any).ok === false ? (
          <p className="mt-4 text-sm text-red-600">
            Failed: {(departmentsQuery.data as any).error}
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-130 border-collapse text-sm">
              <thead>
                <tr className="text-left">
                  <th className="border-b border-(--line) py-2 pr-2">ID</th>
                  <th className="border-b border-(--line) py-2 pr-2">Name</th>
                  <th className="border-b border-(--line) py-2 pr-2">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d) => (
                  <DepartmentRow
                    key={d.department_id}
                    department={d}
                    isAdmin={isAdmin}
                    onUpdate={(name) => {
                      if (!isAdmin) {
                        alert(
                          "Akses ditolak: Hanya Admin yang dapat melakukan aksi ini.",
                        );
                        return;
                      }
                      updateMutation.mutate({
                        department_id: d.department_id,
                        department_name: name,
                      });
                    }}
                    onDelete={() => {
                      if (!isAdmin) {
                        alert(
                          "Akses ditolak: Hanya Admin yang dapat melakukan aksi ini.",
                        );
                        return;
                      }
                      deleteMutation.mutate(d.department_id);
                    }}
                    pending={
                      updateMutation.isPending || deleteMutation.isPending
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function DepartmentRow({
  department,
  isAdmin,
  onUpdate,
  onDelete,
  pending,
}: {
  department: { department_id: number; department_name: string };
  isAdmin: boolean;
  onUpdate: (newName: string) => void;
  onDelete: () => void;
  pending: boolean;
}) {
  const [name, setName] = React.useState(department.department_name);

  return (
    <tr>
      <td className="border-b border-(--line) py-2 pr-2">
        {department.department_id}
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
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-(--line) px-3 py-1"
            onClick={() => onUpdate(name)}
            disabled={pending}
            type="button"
          >
            Update
          </button>
          <button
            className="rounded-lg border border-(--line) px-3 py-1 text-red-700"
            onClick={onDelete}
            disabled={pending}
            type="button"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
