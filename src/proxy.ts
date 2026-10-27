import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "JSESSIONID";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSessionCookie = request.cookies.has(SESSION_COOKIE);

  // 1. Protect customer account & checkout routes
  if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
    if (!hasSessionCookie) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Protect Admin routes (Owner / Admin access level only)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/admin/unauthorized")
  ) {
    if (!hasSessionCookie) {
      const adminLoginUrl = new URL("/admin/login", request.url);
      adminLoginUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(adminLoginUrl);
    }

    if (process.env.NEXT_PUBLIC_USE_MOCK_API === "false") {
      const apiBase = (process.env.API_URL ?? "http://localhost:8080").replace(/\/+$/, "");
      try {
        const res = await fetch(`${apiBase}/api/v1/auth/me`, {
          headers: { cookie: request.headers.get("cookie") ?? "" },
          cache: "no-store",
        });

        if (res.status === 401) {
          const adminLoginUrl = new URL("/admin/login", request.url);
          adminLoginUrl.searchParams.set("next", `${pathname}${search}`);
          return NextResponse.redirect(adminLoginUrl);
        }

        if (res.ok) {
          const user = (await res.json()) as { role?: string };
          if (user.role !== "ADMIN" && user.role !== "OWNER") {
            return NextResponse.redirect(new URL("/admin/unauthorized", request.url));
          }
        }
      } catch {
        // Allow client-side AdminShell guard to handle when backend is unreachable
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/admin/:path*"],
};