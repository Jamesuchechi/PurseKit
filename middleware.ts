import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, SESSION_COOKIE_NAME } from "@/lib/auth";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard", "/devlens", "/specforge", "/chartgpt"];
const publicRoutes = ["/auth/signin", "/auth/signup", "/"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => path === route);

  // 3. Decrypt the session from the cookie
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = cookie ? await decrypt(cookie).catch(() => null) : null;

  // 4. Redirect to /auth/signin if the user is not authenticated
  if (isProtectedRoute && !session) {
    const url = new URL("/auth/signin", req.nextUrl);
    url.searchParams.set("next", path); // Store the original path for redirection after login
    return NextResponse.redirect(url);
  }

  // 5. Redirect to /devlens if the user is authenticated and tries to access /auth pages
  if (
    isPublicRoute &&
    session &&
    !req.nextUrl.pathname.startsWith("/devlens") &&
    (req.nextUrl.pathname.startsWith("/auth/signin") || req.nextUrl.pathname.startsWith("/auth/signup"))
  ) {
    return NextResponse.redirect(new URL("/devlens", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
