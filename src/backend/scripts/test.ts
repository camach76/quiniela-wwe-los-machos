import { createClient } from "@supabase/supabase-js";
import { GetRankingUsers } from "@/backend/core/usecases/GetRankingUsers";
import { SupabaseUserRepository } from "../core/infra/repositories/SupabaseUserReposotory";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

async function main() {
  const repo = new SupabaseUserRepository(supabase);
  const useCase = new GetRankingUsers(repo);

  try {
    const result = await useCase.execute(); // sin userId
    console.log("Usuarios obtenidos:\n", result);
  } catch (error) {
    console.error("Error ejecutando el caso de uso:", error);
  }
}

main();
