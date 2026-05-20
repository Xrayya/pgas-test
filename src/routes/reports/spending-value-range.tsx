import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025] as const;

const MONTHS = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
] as const;

function toMonthStr(year: number, month2: string) {
  return `${year}-${month2}`;
}

type MeResponse =
  | { ok: true; user: null }
  | {
    ok: true;
    user: { user_id: number; email: string; role: "admin" | "user" };
  };

type ReportRow = {
  spending_date: string; // date/ISO string
  value: string | number; // pg numeric may come back as string
};

type ReportResponse =
  | {
    ok: true;
    meta: {
      allowed: { fromMonth: string; toMonth: string };
      fromMonth: string;
      toMonth: string;
      min: number | null;
      max: number | null;
    };
    data: ReportRow[];
  }
  | { ok: false; error: string };

export const Route = createFileRoute("/reports/spending-value-range")({
  component: SpendingValueRangeReportPage,
});

async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/auth/me");
  return res.json();
}

async function fetchReport(vars: {
  fromMonth: string;
  toMonth: string;
  min: string;
  max: string;
}): Promise<ReportResponse> {
  const url = new URL(
    "/api/reports/spending-value-range",
    window.location.origin,
  );

  if (vars.fromMonth.trim())
    url.searchParams.set("fromMonth", vars.fromMonth.trim());
  if (vars.toMonth.trim()) url.searchParams.set("toMonth", vars.toMonth.trim());
  if (vars.min.trim()) url.searchParams.set("min", vars.min.trim());
  if (vars.max.trim()) url.searchParams.set("max", vars.max.trim());

  const res = await fetch(url.toString());
  return res.json();
}

function SpendingValueRangeReportPage() {
  const meQuery = useQuery({ queryKey: ["me"], queryFn: fetchMe });
  const me = meQuery.data?.user ?? null;

  // Input controls (what user types/selects)
  const [fromYear, setFromYear] = React.useState<number>(2020);
  const [fromMonth, setFromMonth] = React.useState<string>("01");

  const [toYear, setToYear] = React.useState<number>(2025);
  const [toMonth, setToMonth] = React.useState<string>("12");

  const [minInput, setMinInput] = React.useState("");
  const [maxInput, setMaxInput] = React.useState("");

  // Applied filters (what the query uses)
  const [filters, setFilters] = React.useState(() => ({
    fromMonth: "2020-01",
    toMonth: "2025-12",
    min: "",
    max: "",
  }));

  const reportQuery = useQuery({
    queryKey: ["reports", "spending-value-range", filters],
    queryFn: () => fetchReport(filters),
    enabled: !!me,
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
  const meta =
    reportQuery.data && "meta" in reportQuery.data
      ? reportQuery.data.meta
      : null;

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rounded-2xl p-6">
        <h1 className="m-0 text-xl font-semibold">
          Spending Report (Value Range)
        </h1>
        <p className="mt-2 text-sm text-(--sea-ink-soft)">
          Filter spendings by <strong>month range (2020–2025)</strong> and{" "}
          <strong>value range</strong>.
        </p>

        <div className="mt-2 text-sm text-(--sea-ink-soft)">
          Logged in as <strong>{me.email}</strong> ({me.role})
        </div>

        <form
          className="mt-4 flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setFilters({
              fromMonth: toMonthStr(fromYear, fromMonth),
              toMonth: toMonthStr(toYear, toMonth),
              min: minInput,
              max: maxInput,
            });
          }}
        >
          <label className="text-sm">
            <div className="mb-1 text-(--sea-ink-soft)">From</div>
            <div className="flex gap-2">
              <select
                className="rounded-lg border border-(--line) bg-white/50 px-3 py-2 text-sm"
                value={fromYear}
                onChange={(e) => setFromYear(Number(e.currentTarget.value))}
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <select
                className="rounded-lg border border-(--line) bg-white/50 px-3 py-2 text-sm"
                value={fromMonth}
                onChange={(e) => setFromMonth(e.currentTarget.value)}
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <label className="text-sm">
            <div className="mb-1 text-(--sea-ink-soft)">To</div>
            <div className="flex gap-2">
              <select
                className="rounded-lg border border-(--line) bg-white/50 px-3 py-2 text-sm"
                value={toYear}
                onChange={(e) => setToYear(Number(e.currentTarget.value))}
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>

              <select
                className="rounded-lg border border-(--line) bg-white/50 px-3 py-2 text-sm"
                value={toMonth}
                onChange={(e) => setToMonth(e.currentTarget.value)}
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <label className="text-sm">
            <div className="mb-1 text-(--sea-ink-soft)">Min value</div>
            <input
              className="w-44 rounded-lg border border-(--line) bg-white/50 px-3 py-2 text-sm"
              type="number"
              step="0.01"
              placeholder="e.g. 1000"
              value={minInput}
              onChange={(e) => setMinInput(e.currentTarget.value)}
            />
          </label>

          <label className="text-sm">
            <div className="mb-1 text-(--sea-ink-soft)">Max value</div>
            <input
              className="w-44 rounded-lg border border-(--line) bg-white/50 px-3 py-2 text-sm"
              type="number"
              step="0.01"
              placeholder="e.g. 5000"
              value={maxInput}
              onChange={(e) => setMaxInput(e.currentTarget.value)}
            />
          </label>

          <button
            className="rounded-lg border border-(--line) px-4 py-2 text-sm font-semibold"
            type="submit"
          >
            Apply
          </button>

          <button
            className="rounded-lg border border-(--line) px-4 py-2 text-sm"
            type="button"
            onClick={() => {
              setFromYear(2020);
              setFromMonth("01");
              setToYear(2025);
              setToMonth("12");
              setMinInput("");
              setMaxInput("");

              setFilters({
                fromMonth: "2020-01",
                toMonth: "2025-12",
                min: "",
                max: "",
              });
            }}
          >
            Reset
          </button>
        </form>

        {reportQuery.isLoading ? (
          <p className="mt-4 text-sm">Loading report...</p>
        ) : reportQuery.data &&
          "ok" in reportQuery.data &&
          (reportQuery.data as any).ok === false ? (
          <p className="mt-4 text-sm text-red-600">
            Failed: {(reportQuery.data as any).error}
          </p>
        ) : (
          <>
            <p className="mt-4 text-sm text-(--sea-ink-soft)">
              {meta ? (
                <>
                  Allowed: <strong>{meta.allowed.fromMonth}</strong> →{" "}
                  <strong>{meta.allowed.toMonth}</strong> | Active:{" "}
                  <strong>
                    {meta.fromMonth} → {meta.toMonth}
                  </strong>{" "}
                  | Value:{" "}
                  <strong>
                    {meta.min ?? "-∞"} → {meta.max ?? "+∞"}
                  </strong>{" "}
                  | Rows: <strong>{rows.length}</strong>
                </>
              ) : null}
            </p>

            <div className="mt-3 flex gap-3">
              <button
                className="rounded-lg border border-(--line) px-4 py-2 text-sm"
                type="button"
                onClick={() => {
                  const url = new URL(
                    "/api/reports/spending-value-range/xlsx",
                    window.location.origin,
                  );
                  url.searchParams.set("fromMonth", filters.fromMonth);
                  url.searchParams.set("toMonth", filters.toMonth);
                  if (filters.min.trim())
                    url.searchParams.set("min", filters.min.trim());
                  if (filters.max.trim())
                    url.searchParams.set("max", filters.max.trim());

                  window.location.href = url.toString();
                }}
              >
                Download Excel
              </button>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-130 border-collapse text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="border-b border-(--line) py-2 pr-2">Date</th>
                    <th className="border-b border-(--line) py-2 pr-2">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={`${r.spending_date}-${idx}`}>
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
          </>
        )}
      </section>
    </main>
  );
}
