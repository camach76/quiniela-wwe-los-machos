import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { SupabaseMatchRepository } from "@/backend/core/infra/repositories/SupabaseMatchRepository";
import { GetMatches } from "@/backend/core/usecases/GetMatches";

export const dynamic = "force-dynamic";

export async function GET() {
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

    const repo = new SupabaseMatchRepository(supabase as any);
    const useCase = new GetMatches(repo);
    const result = await useCase.execute();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en /api/matches:", error);
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
