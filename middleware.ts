import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/transactions", "/categories", "/budget", "/reports", "/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("better-auth.session_token")?.value;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isLogin = pathname.startsWith("/login");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLogin && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)"],
};
