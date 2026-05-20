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

export type AuthedUser = {
  user_id: number;
  email: string;
  role: "admin" | "user";
};

export async function requireUser(request: Request): Promise<AuthedUser> {
  const sessionId = readCookie(request, getSessionCookieName());
  if (!sessionId) throw new Response("Unauthorized", { status: 401 });

  const user = await getUserBySessionId(sessionId);
  if (!user) throw new Response("Unauthorized", { status: 401 });

  return user;
}

export async function requireAdmin(request: Request): Promise<AuthedUser> {
  const user = await requireUser(request);
  if (user.role !== "admin") throw new Response("Forbidden", { status: 403 });
  return user;
}
