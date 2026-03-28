import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, validatePassword } from "./users";

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET environment variable is not set");
}
const key = new TextEncoder().encode(secretKey);

export const SESSION_COOKIE_NAME = "pulsekit-session";

// ─── Session shape stored in the JWT ────────────────────────

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

// ─── JWT helpers ─────────────────────────────────────────────

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

// ─── Auth actions ────────────────────────────────────────────

export async function login(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const valid = await validatePassword(password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ user: sessionUser, expires });

  (await cookies()).set(SESSION_COOKIE_NAME, session, {
    expires,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export async function logout() {
  (await cookies()).set(SESSION_COOKIE_NAME, "", { expires: new Date(0) });
}

export async function getSession(): Promise<SessionUser | null> {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  try {
    const payload = await decrypt(session);
    return payload.user as SessionUser;
  } catch {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const res = NextResponse.next();
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: await encrypt({ ...parsed, expires }),
    httpOnly: true,
    expires,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return res;
}
