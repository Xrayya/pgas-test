import { createFileRoute } from "@tanstack/react-router";
import db from "#/db/db";
import { requireAdmin } from "#/auth/role";

export const Route = createFileRoute("/api/spendings/$spendingId")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        await requireAdmin(request);

        const spendingId = Number(params.spendingId);
        if (!Number.isFinite(spendingId)) {
          return Response.json({ ok: false, error: "Invalid spendingId" }, { status: 400 });
        }

        const body = (await request.json().catch(() => null)) as null | {
          employee_id?: number;
          spending_date?: string;
          value?: number | string;
        };

        const employee_id = Number(body?.employee_id);
        const spending_date = body?.spending_date;
        const value = Number(body?.value);

        if (!Number.isFinite(employee_id)) {
          return Response.json({ ok: false, error: "employee_id is required" }, { status: 400 });
        }
        if (!spending_date) {
          return Response.json({ ok: false, error: "spending_date is required" }, { status: 400 });
        }
        if (!Number.isFinite(value)) {
          return Response.json({ ok: false, error: "value is required" }, { status: 400 });
        }

        const { rows } = await db.query(
          `UPDATE spendings
           SET employee_id = $1,
               spending_date = $2,
               value = $3
           WHERE spending_id = $4
           RETURNING spending_id, employee_id, spending_date, value`,
          [employee_id, spending_date, value, spendingId],
        );

        if (!rows[0]) {
          return Response.json({ ok: false, error: "Not found" }, { status: 404 });
        }

        return Response.json({ ok: true, data: rows[0] });
      },

      DELETE: async ({ request, params }) => {
        await requireAdmin(request);

        const spendingId = Number(params.spendingId);
        if (!Number.isFinite(spendingId)) {
          return Response.json({ ok: false, error: "Invalid spendingId" }, { status: 400 });
        }

        const res = await db.query(`DELETE FROM spendings WHERE spending_id = $1`, [spendingId]);

        if (res.rowCount === 0) {
          return Response.json({ ok: false, error: "Not found" }, { status: 404 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});
