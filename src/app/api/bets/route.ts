import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { SupabaseBetRepository } from "@/backend/core/infra/repositories/SupabaseBetRepository";
import { MakeBet } from "@/backend/core/usecases/MakeBet";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, matchId, prediccionA, prediccionB } = body;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      },
    );

    const repo = new SupabaseBetRepository(supabase);
    const useCase = new MakeBet(repo);

    const result = await useCase.execute({
      userId,
      matchId,
      prediccionA,
      prediccionB,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en /api/bets:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}
