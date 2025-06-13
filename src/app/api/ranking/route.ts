import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { GetRankingUsers } from "@/backend/core/usecases/GetRankingUsers";
import { SupabaseUserRepository } from "@/backend/core/infra/repositories/SupabaseUserReposotory";

export async function GET() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name, options) => {
          cookieStore.set({ name, value: "", ...options, maxAge: -1 });
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const repo = new SupabaseUserRepository(supabase);
  const useCase = new GetRankingUsers(repo);
  const result = await useCase.execute(session.user.id);

  return NextResponse.json(result);
}
