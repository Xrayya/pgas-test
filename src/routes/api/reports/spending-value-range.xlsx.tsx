import { createFileRoute } from "@tanstack/react-router";
import db from "#/db/db";
import { requireUser } from "#/auth/role";
import ExcelJS from "exceljs";

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
  if (!/^\d{4}-\d{2}$/.test(v)) return null;
  return v;
}

function clampMonthToRange(month: string, min: string, max: string) {
  if (month < min) return min;
  if (month > max) return max;
  return month;
}

function addMonths(month: string, delta: number) {
  const [ys, ms] = month.split("-");
  const y = Number(ys);
  const m = Number(ms); // 1-12
  const base = y * 12 + (m - 1);
  const next = base + delta;
  const ny = Math.floor(next / 12);
  const nm = (next % 12) + 1;
  return `${String(ny).padStart(4, "0")}-${String(nm).padStart(2, "0")}`;
}

export const Route = createFileRoute("/api/reports/spending-value-range/xlsx")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await requireUser(request);

        const url = new URL(request.url);

        const minAllowed = "2020-01";
        const maxAllowed = "2025-12";

        let fromMonth =
          parseMonth(url.searchParams.get("fromMonth")) ?? minAllowed;
        let toMonth = parseMonth(url.searchParams.get("toMonth")) ?? maxAllowed;

        fromMonth = clampMonthToRange(fromMonth, minAllowed, maxAllowed);
        toMonth = clampMonthToRange(toMonth, minAllowed, maxAllowed);

        if (fromMonth > toMonth) {
          const tmp = fromMonth;
          fromMonth = toMonth;
          toMonth = tmp;
        }

        const fromDate = `${fromMonth}-01`;
        const toDateExclusive = `${addMonths(toMonth, 1)}-01`;

        const min = parseNum(url.searchParams.get("min"));
        const max = parseNum(url.searchParams.get("max"));

        const { rows } = await db.query(
          `
          SELECT spending_date, value
          FROM spendings
          WHERE spending_date >= $1
            AND spending_date < $2
            AND ($3::numeric IS NULL OR value >= $3)
            AND ($4::numeric IS NULL OR value <= $4)
          ORDER BY spending_date ASC
          `,
          [fromDate, toDateExclusive, min, max],
        );

        const wb = new ExcelJS.Workbook();
        wb.created = new Date();

        const ws = wb.addWorksheet("Spending Report");

        ws.columns = [
          { header: "Date", key: "spending_date", width: 16 },
          { header: "Value", key: "value", width: 20 },
        ];

        ws.getColumn("spending_date").numFmt = "yyyy-mm-dd";
        ws.getColumn("value").numFmt = "#,##0.00";

        for (const r of rows as Array<{ spending_date: any; value: any }>) {
          // Convert whatever PG returns into a JS Date safely
          const d = new Date(r.spending_date);

          const valueNum = Number(r.value);

          ws.addRow({
            // Write an actual Date to Excel so it keeps the year and formats correctly
            spending_date: Number.isNaN(d.getTime())
              ? String(r.spending_date)
              : d,
            value: Number.isFinite(valueNum) ? valueNum : String(r.value),
          });
        }

        ws.getRow(1).font = { bold: true };

        // nice formatting
        ws.getColumn("value").numFmt = "#,##0.00";

        const buf = await wb.xlsx.writeBuffer();

        const filename = `spending-value-range_${fromMonth}_to_${toMonth}.xlsx`;

        return new Response(buf, {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}"`,
          },
        });
      },
    },
  },
});
