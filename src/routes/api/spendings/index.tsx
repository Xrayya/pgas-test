import { createFileRoute } from "@tanstack/react-router";
import db from "#/db/db";
import { requireUser } from "#/auth/role";

export const Route = createFileRoute("/api/spendings/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await requireUser(request);

        const { rows } = await db.query(
          `SELECT
             s.spending_id,
             s.employee_id,
             e.employee_name,
             d.department_name,
             s.spending_date,
             s.value
           FROM spendings s
           JOIN employees e ON e.employee_id = s.employee_id
           LEFT JOIN departments d ON d.department_id = e.department_id
           ORDER BY s.spending_id DESC`,
        );

        return Response.json({ ok: true, data: rows });
      },

      POST: async ({ request }) => {
        await requireUser(request);

        const body = (await request.json().catch(() => null)) as null | {
          employee_id?: number;
          spending_date?: string; // yyyy-mm-dd
          value?: number | string;
        };

        const employee_id = Number(body?.employee_id);
        const spending_date = body?.spending_date;
        const value = Number(body?.value);

        if (!Number.isFinite(employee_id)) {
          return Response.json(
            { ok: false, error: "employee_id is required" },
            { status: 400 },
          );
        }
        if (!spending_date) {
          return Response.json(
            { ok: false, error: "spending_date is required" },
            { status: 400 },
          );
        }
        if (!Number.isFinite(value)) {
          return Response.json(
            { ok: false, error: "value is required" },
            { status: 400 },
          );
        }

        const { rows } = await db.query(
          `INSERT INTO spendings (employee_id, spending_date, value)
           VALUES ($1, $2, $3)
           RETURNING spending_id, employee_id, spending_date, value`,
          [employee_id, spending_date, value],
        );

        return Response.json({ ok: true, data: rows[0] }, { status: 201 });
      },
    },
  },
});
