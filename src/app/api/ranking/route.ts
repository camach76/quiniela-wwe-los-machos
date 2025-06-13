import { cookies } from "next/headers";
import { SupabaseUserRepository } from "@/backend/core/infra/repositories/SupabaseUserReposotory";
import { GetRankingUsers } from "@/backend/core/usecases/GetRankingUsers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServerComponentClient({ cookies });

  const repo = new SupabaseUserRepository(supabase);
  const useCase = new GetRankingUsers(repo);

  const result = await useCase.execute();

  return NextResponse.json(result);
}
