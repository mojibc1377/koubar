import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!req.auth?.user) {
      const login = new URL("/login", req.url);
      login.searchParams.set("redirect", pathname);
      return NextResponse.redirect(login);
    }
    if (req.auth.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/account", req.url));
    }
  }

  if (
    pathname.startsWith("/account") &&
    !req.auth?.user &&
    pathname !== "/account"
  ) {
    const login = new URL("/login", req.url);
    login.searchParams.set("redirect", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/account", "/account/:path*"],
};
