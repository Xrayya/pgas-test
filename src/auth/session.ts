import db from "#/db/db";
import { randomUUID } from "crypto";

const SESSION_COOKIE = "session_id";
const SESSION_DAYS = 7;

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getSessionExpiresAt() {
  return new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
}

export async function createSession(userId: number) {
  const sessionId = randomUUID();
  const expiresAt = getSessionExpiresAt();


  await db.query(
    `INSERT INTO sessions (session_id, user_id, expires_at)
     VALUES ($1, $2, $3)`,
    [sessionId, userId, expiresAt],
  );

  return { sessionId, expiresAt };
}

export async function deleteSession(sessionId: string) {
  await db.query(`DELETE FROM sessions WHERE session_id = $1`, [sessionId]);
}

export async function getUserBySessionId(sessionId: string) {
  const { rows } = await db.query(
    `
    SELECT
      u.user_id,
      u.email,
      u.role
    FROM sessions s
    JOIN users u ON u.user_id = s.user_id
    WHERE s.session_id = $1
      AND s.expires_at > NOW()
    `,
    [sessionId],
  );

  return rows[0] as
    | undefined
    | { user_id: number; email: string; role: "admin" | "user" };
}
