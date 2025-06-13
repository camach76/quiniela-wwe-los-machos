import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { authGuard } from "./backend/shared/middleware/authGuard";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createMiddlewareClient({ req: request, res: response });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Aquí validamos la sesión usando tu authGuard
  return authGuard(request, session) || response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
