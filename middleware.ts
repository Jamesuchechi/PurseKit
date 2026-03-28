import { NextResponse } from "next/server";

export default async function middleware() {
  // Authentication is disabled - direct access to all routes
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
