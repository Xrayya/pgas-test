import { createFileRoute } from "@tanstack/react-router";
import db from "#/db/db";
import { verifyPassword } from "#/auth/password";
import { createSession, getSessionCookieName } from "#/auth/session";

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as null | {
          email?: string;
          password?: string;
        };

        const email = body?.email?.trim().toLowerCase();
        const password = body?.password ?? "";

        if (!email || !password) {
          return Response.json(
            { ok: false, error: "Email and password are required." },
            { status: 400 },
          );
        }

        const userRes = await db.query(
          `SELECT *
           FROM users
           WHERE email = $1
           LIMIT 1`,
          [email],
        );

        const user = userRes.rows[0] as
          | undefined
          | {
            user_id: number;
            email: string;
            password_hash: string;
            role: "admin" | "user";
          };

        if (!user) {
          return Response.json(
            { ok: false, error: "Invalid credentials." },
            { status: 401 },
          );
        }

        const ok = await verifyPassword(password, user.password_hash);
        if (!ok) {
          return Response.json(
            { ok: false, error: "Invalid credentials." },
            { status: 401 },
          );
        }

        const { sessionId, expiresAt } = await createSession(user.user_id);

        const headers = new Headers();
        // httpOnly cookie so JS can’t read it
        headers.append(
          "Set-Cookie",
          `${getSessionCookieName()}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}`,
        );

        return Response.json(
          { ok: true, user: { email: user.email, role: user.role } },
          { status: 200, headers },
        );
      },
    },
  },
});
