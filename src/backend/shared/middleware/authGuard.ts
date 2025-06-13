import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@supabase/supabase-js";

const authCache = new Map<string, { user: User; timestamp: number }>();

const isPublicRoute = (path: string) => {
  const publicRoutes = ["/", "/login", "/register"];
  return publicRoutes.some((route) => path.startsWith(route));
};

export async function authGuard(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname;

  if (isPublicRoute(path)) {
    return response;
  }

  const refreshToken = request.cookies.get("sb-refresh-token")?.value;

  if (!refreshToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = `redirect=${encodeURIComponent(request.url)}`;
    return NextResponse.redirect(loginUrl);
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({
            name,
            value,
            ...options,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
            maxAge: -1,
            path: "/",
          });
        },
      },
    },
  );

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = `redirect=${encodeURIComponent(request.url)}`;
      return NextResponse.redirect(loginUrl);
    }

    const cacheKey = `auth-${user.id}`;
    authCache.set(cacheKey, { user, timestamp: Date.now() });

    return response;
  } catch (error) {
    console.error("Error en authGuard:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}
