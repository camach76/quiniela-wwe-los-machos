import { NextRequest, NextResponse } from "next/server";
import type { Session } from "@supabase/supabase-js";

const isPublicRoute = (path: string) => {
  const publicRoutes = ["/", "/login", "/register"];
  return publicRoutes.some((route) => path.startsWith(route));
};

export function authGuard(request: NextRequest, session: Session | null) {
  const path = request.nextUrl.pathname;

  if (isPublicRoute(path)) {
    return null;
  }

  if (!session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return null;
}
