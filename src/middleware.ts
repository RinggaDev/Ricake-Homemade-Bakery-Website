import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

const COOKIE_NAME = "ricake_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "ricake_default_secret_key_change_in_production_12345678"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek apakah rute memerlukan proteksi
  const isAdminRoute = pathname.startsWith("/admin");
  const isPortalRoute = pathname.startsWith("/portal");

  if (!isAdminRoute && !isPortalRoute) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(COOKIE_NAME);

  if (!cookie || !cookie.value) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(cookie.value, JWT_SECRET);
    const role = (payload as any).role;

    // Rute admin hanya boleh dibuka oleh role "admin"
    if (isAdminRoute && role !== "admin") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "forbidden");
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
