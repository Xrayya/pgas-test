import { createFileRoute } from "@tanstack/react-router";
import db from "#/db/db";
import { requireUser } from "#/auth/role";

type SortBy = "value" | "spending_date" | "employee_name" | "department_name";
type SortDir = "asc" | "desc";

function parseSortBy(input: string | null): SortBy {
  switch (input) {
    case "spending_date":
    case "employee_name":
    case "department_name":
    case "value":
      return input;
    default:
      return "value";
  }
}

function parseSortDir(input: string | null): SortDir {
  return input === "desc" ? "desc" : "asc";
}

export const Route = createFileRoute("/api/reports/spendings")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await requireUser(request);

        const url = new URL(request.url);
        const sortBy = parseSortBy(url.searchParams.get("sortBy"));
        const sortDir = parseSortDir(url.searchParams.get("sortDir"));

        // Whitelisted ORDER BY to avoid SQL injection
        const orderBySql =
          sortBy === "value"
            ? `s.value ${sortDir}`
            : sortBy === "spending_date"
              ? `s.spending_date ${sortDir}`
              : sortBy === "employee_name"
                ? `e.employee_name ${sortDir}`
                : `d.department_name ${sortDir}`;

        const { rows } = await db.query(
          `
          SELECT
            s.spending_id,
            s.employee_id,
            e.employee_name,
            d.department_name,
            s.spending_date,
            s.value
          FROM spendings s
          JOIN employees e ON e.employee_id = s.employee_id
          LEFT JOIN departments d ON d.department_id = e.department_id
          ORDER BY ${orderBySql}, s.spending_id DESC
          `,
        );

        return Response.json({
          ok: true,
          meta: { sortBy, sortDir },
          data: rows,
        });
      },
    },
  },
});
