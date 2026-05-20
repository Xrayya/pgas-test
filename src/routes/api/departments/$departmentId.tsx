import { createFileRoute } from "@tanstack/react-router";
import db from "#/db/db";
import { requireAdmin } from "#/auth/role";

export const Route = createFileRoute("/api/departments/$departmentId")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        await requireAdmin(request);

        const departmentId = Number(params.departmentId);
        if (!Number.isFinite(departmentId)) {
          return Response.json(
            { ok: false, error: "Invalid departmentId" },
            { status: 400 },
          );
        }

        const body = (await request.json().catch(() => null)) as null | {
          department_name?: string;
        };

        const name = body?.department_name?.trim();
        if (!name) {
          return Response.json(
            { ok: false, error: "department_name is required" },
            { status: 400 },
          );
        }

        const { rows } = await db.query(
          `UPDATE departments
           SET department_name = $1
           WHERE department_id = $2
           RETURNING department_id, department_name`,
          [name, departmentId],
        );

        if (!rows[0]) {
          return Response.json(
            { ok: false, error: "Not found" },
            { status: 404 },
          );
        }

        return Response.json({ ok: true, data: rows[0] });
      },

      DELETE: async ({ request, params }) => {
        await requireAdmin(request);

        const departmentId = Number(params.departmentId);
        if (!Number.isFinite(departmentId)) {
          return Response.json(
            { ok: false, error: "Invalid departmentId" },
            { status: 400 },
          );
        }

        const res = await db.query(
          `DELETE FROM departments
           WHERE department_id = $1`,
          [departmentId],
        );

        if (res.rowCount === 0) {
          return Response.json(
            { ok: false, error: "Not found" },
            { status: 404 },
          );
        }

        return Response.json({ ok: true });
      },
    },
  },
});
