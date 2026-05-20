import { createFileRoute } from "@tanstack/react-router";
import db from "#/db/db";
import { requireAdmin } from "#/auth/role";

export const Route = createFileRoute("/api/employees/$employeeId")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        await requireAdmin(request);

        const employeeId = Number(params.employeeId);
        if (!Number.isFinite(employeeId)) {
          return Response.json(
            { ok: false, error: "Invalid employeeId" },
            { status: 400 },
          );
        }

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
          `UPDATE employees
           SET employee_name = $1,
               department_id = $2
           WHERE employee_id = $3
           RETURNING employee_id, employee_name, department_id`,
          [employee_name, department_id, employeeId],
        );

        if (!rows[0]) {
          return Response.json({ ok: false, error: "Not found" }, { status: 404 });
        }

        return Response.json({ ok: true, data: rows[0] });
      },

      DELETE: async ({ request, params }) => {
        await requireAdmin(request);

        const employeeId = Number(params.employeeId);
        if (!Number.isFinite(employeeId)) {
          return Response.json(
            { ok: false, error: "Invalid employeeId" },
            { status: 400 },
          );
        }

        const res = await db.query(`DELETE FROM employees WHERE employee_id = $1`, [
          employeeId,
        ]);

        if (res.rowCount === 0) {
          return Response.json({ ok: false, error: "Not found" }, { status: 404 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});
