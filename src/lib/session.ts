import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "us_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type Session = { userId: number; email: string };

function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) throw new Error("AUTH_SECRET is missing or too short");
  return new TextEncoder().encode(secret);
}

export async function signSession(session: Session) {
  return new SignJWT({ email: session.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(session.userId))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key());
}

export async function verifySession(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return { userId: Number(payload.sub), email: String(payload.email) };
  } catch {
    return null;
  }
}
