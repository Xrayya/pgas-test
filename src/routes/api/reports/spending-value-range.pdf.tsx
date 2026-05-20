import { createFileRoute } from "@tanstack/react-router";
import db from "#/db/db";
import { requireUser } from "#/auth/role";
import PDFDocument from "pdfkit";

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

function formatDateCell(v: any) {
  // Prefer yyyy-mm-dd
  if (v instanceof Date && !Number.isNaN(v.getTime())) {
    return v.toISOString().slice(0, 10);
  }
  const d = new Date(v);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return String(v).slice(0, 10);
}

export const Route = createFileRoute("/api/reports/spending-value-range/pdf")({
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

        // Build PDF into a Buffer
        const doc = new PDFDocument({ margin: 36, size: "A4" });

        const chunks: Buffer[] = [];
        doc.on("data", (c) => chunks.push(c));
        const done = new Promise<Buffer>((resolve, reject) => {
          doc.on("end", () => resolve(Buffer.concat(chunks)));
          doc.on("error", reject);
        });

        // Title
        doc.fontSize(16).text("Spending Report (Value Range)");
        doc.moveDown(0.25);
        doc
          .fontSize(10)
          .fillColor("#444")
          .text(`Period: ${fromMonth} to ${toMonth}`);
        doc.text(`Value range: ${min ?? "-∞"} to ${max ?? "+∞"}`);
        doc.text(`Rows: ${rows.length}`);
        doc.moveDown(1);
        doc.fillColor("#000");

        // Simple table layout
        const startX = doc.x;
        const dateX = startX;
        const valueX = startX + 170;

        // Header
        doc.fontSize(11).font("Helvetica-Bold");
        doc.text("Date", dateX, doc.y);
        doc.text("Value", valueX, doc.y);
        doc.moveDown(0.4);
        doc.font("Helvetica").fontSize(10);

        const pageBottom = doc.page.height - doc.page.margins.bottom;

        for (const r of rows as Array<{ spending_date: any; value: any }>) {
          const y = doc.y;

          // page break
          if (y > pageBottom - 20) {
            doc.addPage();
            doc.fontSize(11).font("Helvetica-Bold");
            doc.text("Date", dateX, doc.y);
            doc.text("Value", valueX, doc.y);
            doc.moveDown(0.4);
            doc.font("Helvetica").fontSize(10);
          }

          const dateStr = formatDateCell(r.spending_date);
          const valueStr = String(r.value);

          doc.text(dateStr, dateX, doc.y, { width: 160 });
          doc.text(valueStr, valueX, doc.y, { width: 200 });
          doc.moveDown(0.25);
        }

        doc.end();

        const pdfBuffer = await done;
        const filename = `spending-value-range_${fromMonth}_to_${toMonth}.pdf`;

        return new Response(new Uint8Array(pdfBuffer), {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${filename}"`,
          },
        });
      },
    },
  },
});
