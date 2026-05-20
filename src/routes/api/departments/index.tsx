import { createFileRoute } from "@tanstack/react-router";
import db from "#/db/db";
import { requireUser } from "#/auth/role";

export const Route = createFileRoute("/api/departments/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await requireUser(request);

        const url = new URL(request.url);
        const raw = url.searchParams.get("search");
        const search = raw?.trim() ? `%${raw.trim()}%` : null;

        const { rows } = await db.query(
          `SELECT department_id, department_name
           FROM departments
           WHERE ($1::text IS NULL OR department_name ILIKE $1)
           ORDER BY department_id DESC`,
          [search],
        );

        return Response.json({ ok: true, data: rows });
      },

      POST: async ({ request }) => {
        await requireUser(request);

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
          `INSERT INTO departments (department_name)
           VALUES ($1)
           RETURNING department_id, department_name`,
          [name],
        );

        return Response.json({ ok: true, data: rows[0] }, { status: 201 });
      },
    },
  },
});
