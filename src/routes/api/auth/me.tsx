import { createFileRoute } from "@tanstack/react-router";
import { getSessionCookieName, getUserBySessionId } from "#/auth/session";

function readCookie(req: Request, name: string) {
  const cookie = req.headers.get("cookie") ?? "";
  const parts = cookie.split(";").map((p) => p.trim());
  for (const p of parts) {
    const [k, ...rest] = p.split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const sessionId = readCookie(request, getSessionCookieName());
        if (!sessionId) return Response.json({ ok: true, user: null });

        const user = await getUserBySessionId(sessionId);
        if (!user) return Response.json({ ok: true, user: null });

        return Response.json({
          ok: true,
          user: {
            user_id: user.user_id,
            email: user.email,
            role: user.role,
          },
        });
      },
    },
  },
});
