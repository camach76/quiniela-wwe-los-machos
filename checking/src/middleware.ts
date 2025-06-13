import { authGuard } from "@/backend/shared/middleware/authGuard";

export const middleware = authGuard;

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)", "/"],
};
