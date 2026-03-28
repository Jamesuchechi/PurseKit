import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET || "pulsekit-secret-key-change-me-in-production";
const key = new TextEncoder().encode(secretKey);

export const SESSION_COOKIE_NAME = "pulsekit-session";

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

export async function login(formData: FormData) {
  // Verify credentials...
  const user = { email: formData.get("email"), name: "John Doe" };

  // Create the session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  (await cookies()).set(SESSION_COOKIE_NAME, session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  (await cookies()).set(SESSION_COOKIE_NAME, "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  const res = NextResponse.next();
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: await encrypt({ ...parsed, expires }),
    httpOnly: true,
    expires: expires,
  });
  return res;
}
