import { createFileRoute } from "@tanstack/react-router";
import db from "#/db/db";
import { requireUser } from "#/auth/role";

export const Route = createFileRoute("/api/employees/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await requireUser(request);

        const { rows } = await db.query(
          `SELECT
             e.employee_id,
             e.employee_name,
             e.department_id,
             d.department_name
           FROM employees e
           LEFT JOIN departments d ON d.department_id = e.department_id
           ORDER BY e.employee_id DESC`,
        );

        return Response.json({ ok: true, data: rows });
      },

      POST: async ({ request }) => {
        await requireUser(request);

        const body = (await request.json().catch(() => null)) as null | {
          employee_name?: string;
          department_id?: number;
        };

        const employee_name = body?.employee_name?.trim();
        const department_id = Number(body?.department_id);

        if (!employee_name) {
          return Response.json(
            { ok: false, error: "employee_name is required" },
            { status: 400 },
          );
        }
        if (!Number.isFinite(department_id)) {
          return Response.json(
            { ok: false, error: "department_id is required" },
            { status: 400 },
          );
        }

        const { rows } = await db.query(
          `INSERT INTO employees (employee_name, department_id)
           VALUES ($1, $2)
           RETURNING employee_id, employee_name, department_id`,
          [employee_name, department_id],
        );

        return Response.json({ ok: true, data: rows[0] }, { status: 201 });
      },
    },
  },
});
