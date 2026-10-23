import { NextResponse, type NextRequest } from "next/server";

/**
 * Quick check before signed-in pages load: no session cookie means not logged in,
 * so go straight to /login and come back afterwards.
 * This is only a shortcut for a smooth experience. The backend still checks
 * every request, and the account page handles an expired session itself.
 */
export function proxy(request: NextRequest) {
  if (!request.cookies.has("JSESSIONID")) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
