import { createFileRoute } from "@tanstack/react-router";
import { deleteSession, getSessionCookieName } from "#/auth/session";

function readCookie(req: Request, name: string) {
  const cookie = req.headers.get("cookie") ?? "";
  const parts = cookie.split(";").map((p) => p.trim());
  for (const p of parts) {
    const [k, ...rest] = p.split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const sessionId = readCookie(request, getSessionCookieName());
        if (sessionId) {
          await deleteSession(sessionId);
        }

        const headers = new Headers();
        headers.append(
          "Set-Cookie",
          `${getSessionCookieName()}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
        );

        return Response.json({ ok: true }, { status: 200, headers });
      },
    },
  },
});
