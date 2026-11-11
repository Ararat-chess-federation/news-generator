import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, verifySessionToken } from "./src/helpers/auth";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAuthenticated = await verifySessionToken(request.cookies.get(AUTH_COOKIE)?.value);

  if (pathname === "/login") {
    return isAuthenticated ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  if (pathname !== "/") {
    loginUrl.searchParams.set("from", `${pathname}${search}`);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
