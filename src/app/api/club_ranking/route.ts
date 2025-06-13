import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { SupabaseClubRankingRepository } from "@/backend/core/infra/repositories/SupabaseClubRankingRepository";
import { GetClubRanking } from "@/backend/core/usecases/GetClubRanking";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "anonymous";

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const repo = new SupabaseClubRankingRepository(supabase as any);
    const useCase = new GetClubRanking(repo);

    const result = await useCase.execute(userId);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en /api/club_ranking:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
        ...(process.env.NODE_ENV === "development" && {
          stack: error instanceof Error ? error.stack : undefined,
        }),
      },
      { status: 500 },
    );
  }
}
