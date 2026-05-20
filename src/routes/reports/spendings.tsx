import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

type MeResponse =
  | { ok: true; user: null }
  | {
    ok: true;
    user: { user_id: number; email: string; role: "admin" | "user" };
  };

type SortBy = "value" | "spending_date" | "employee_name" | "department_name";
type SortDir = "asc" | "desc";

type ReportRow = {
  spending_id: number;
  employee_id: number;
  employee_name: string;
  department_name: string | null;
  spending_date: string; // ISO date
  value: string | number; // pg may return numeric as string
};

type ReportResponse =
  | { ok: true; meta: { sortBy: SortBy; sortDir: SortDir }; data: ReportRow[] }
  | { ok: false; error: string };

export const Route = createFileRoute("/reports/spendings")({
  component: SpendingsReportPage,
});

async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/auth/me");
  return res.json();
}

async function fetchReport(
  sortBy: SortBy,
  sortDir: SortDir,
): Promise<ReportResponse> {
  const url = new URL("/api/reports/spendings", window.location.origin);
  url.searchParams.set("sortBy", sortBy);
  url.searchParams.set("sortDir", sortDir);

  const res = await fetch(url.toString());
  return res.json();
}

function SpendingsReportPage() {
  const meQuery = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const me = meQuery.data?.user ?? null;

  const [sortBy, setSortBy] = React.useState<SortBy>("value");
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");

  const reportQuery = useQuery({
    queryKey: ["reports", "spendings", { sortBy, sortDir }],
    queryFn: () => fetchReport(sortBy, sortDir),
    enabled: !!me, // only fetch after we know user is logged in
  });

  if (meQuery.isLoading) {
    return <main className="page-wrap px-4 pb-8 pt-14">Loading...</main>;
  }

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

  const rows =
    reportQuery.data && "data" in reportQuery.data ? reportQuery.data.data : [];

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rounded-2xl p-6">
        <h1 className="m-0 text-xl font-semibold">Spendings Report (Joined)</h1>
        <p className="mt-2 text-sm text-(--sea-ink-soft)">
          Default sorting is <strong>Value (asc)</strong>.
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <div className="mb-1 text-(--sea-ink-soft)">Sort by</div>
            <select
              className="rounded-lg border border-(--line) bg-white/50 px-3 py-2 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.currentTarget.value as SortBy)}
            >
              <option value="value">Value</option>
              <option value="spending_date">Date</option>
              <option value="employee_name">Employee Name</option>
              <option value="department_name">Department Name</option>
            </select>
          </label>

          <label className="text-sm">
            <div className="mb-1 text-(--sea-ink-soft)">Direction</div>
            <select
              className="rounded-lg border border-(--line) bg-white/50 px-3 py-2 text-sm"
              value={sortDir}
              onChange={(e) => setSortDir(e.currentTarget.value as SortDir)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>

          <div className="ml-auto text-sm text-(--sea-ink-soft)">
            Logged in as <strong>{me.email}</strong> ({me.role})
          </div>
        </div>

        {reportQuery.isLoading ? (
          <p className="mt-4 text-sm">Loading report...</p>
        ) : reportQuery.data &&
          "ok" in reportQuery.data &&
          (reportQuery.data as any).ok === false ? (
          <p className="mt-4 text-sm text-red-600">
            Failed: {(reportQuery.data as any).error}
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-225 border-collapse text-sm">
              <thead>
                <tr className="text-left">
                  <th className="border-b border-(--line) py-2 pr-2">ID</th>
                  <th className="border-b border-(--line) py-2 pr-2">
                    Employee
                  </th>
                  <th className="border-b border-(--line) py-2 pr-2">
                    Department
                  </th>
                  <th className="border-b border-(--line) py-2 pr-2">Date</th>
                  <th className="border-b border-(--line) py-2 pr-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.spending_id}>
                    <td className="border-b border-(--line) py-2 pr-2">
                      {r.spending_id}
                    </td>
                    <td className="border-b border-(--line) py-2 pr-2">
                      {r.employee_name}
                    </td>
                    <td className="border-b border-(--line) py-2 pr-2">
                      {r.department_name ?? "-"}
                    </td>
                    <td className="border-b border-(--line) py-2 pr-2">
                      {String(r.spending_date).slice(0, 10)}
                    </td>
                    <td className="border-b border-(--line) py-2 pr-2">
                      {String(r.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
