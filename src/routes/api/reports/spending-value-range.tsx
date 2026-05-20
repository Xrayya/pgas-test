import { createFileRoute } from "@tanstack/react-router";
import db from "#/db/db";
import { requireUser } from "#/auth/role";

function parseNum(input: string | null) {
  if (!input) return null;
  const t = input.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function parseMonth(input: string | null) {
  const v = input?.trim();
  if (!v) return null;
  // YYYY-MM
  if (!/^\d{4}-\d{2}$/.test(v)) return null;
  return v;
}

function clampMonthToRange(month: string, min: string, max: string) {
  if (month < min) return min;
  if (month > max) return max;
  return month;
}

function addMonths(month: string, delta: number) {
  // month is YYYY-MM
  const [ys, ms] = month.split("-");
  const y = Number(ys);
  const m = Number(ms); // 1-12
  const base = y * 12 + (m - 1);
  const next = base + delta;
  const ny = Math.floor(next / 12);
  const nm = (next % 12) + 1;
  return `${String(ny).padStart(4, "0")}-${String(nm).padStart(2, "0")}`;
}

export const Route = createFileRoute("/api/reports/spending-value-range")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await requireUser(request);

        const url = new URL(request.url);

        // allowed range in requirement
        const minAllowed = "2020-01";
        const maxAllowed = "2025-12";

        let fromMonth =
          parseMonth(url.searchParams.get("fromMonth")) ?? minAllowed;
        let toMonth = parseMonth(url.searchParams.get("toMonth")) ?? maxAllowed;

        fromMonth = clampMonthToRange(fromMonth, minAllowed, maxAllowed);
        toMonth = clampMonthToRange(toMonth, minAllowed, maxAllowed);

        // ensure fromMonth <= toMonth
        if (fromMonth > toMonth) {
          const tmp = fromMonth;
          fromMonth = toMonth;
          toMonth = tmp;
        }

        const fromDate = `${fromMonth}-01`;
        const toMonthExclusive = addMonths(toMonth, 1);
        const toDateExclusive = `${toMonthExclusive}-01`;

        const min = parseNum(url.searchParams.get("min"));
        const max = parseNum(url.searchParams.get("max"));

        const { rows } = await db.query(
          `
          SELECT
            spending_date,
            value
          FROM spendings
          WHERE spending_date >= $1
            AND spending_date < $2
            AND ($3::numeric IS NULL OR value >= $3)
            AND ($4::numeric IS NULL OR value <= $4)
          ORDER BY spending_date ASC
          `,
          [fromDate, toDateExclusive, min, max],
        );

        return Response.json({
          ok: true,
          meta: {
            allowed: { fromMonth: minAllowed, toMonth: maxAllowed },
            fromMonth,
            toMonth,
            min,
            max,
          },
          data: rows,
        });
      },
    },
  },
});
