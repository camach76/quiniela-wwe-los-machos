import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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

    // Primero obtenemos los próximos partidos
    const { data: matches, error } = await supabase
      .from('matches')
      .select('*')
      .gte('fecha', new Date().toISOString())
      .order('fecha', { ascending: true })
      .limit(4);

    if (error) {
      throw error;
    }

    const formattedMatches = await Promise.all(matches.map(async (match) => {
      const { data: clubA } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', match.club_a_id)
        .single();
      
      const { data: clubB } = await supabase
        .from('clubs')
        .select('*')
        .eq('id', match.club_b_id)
        .single();

      return {
        id: match.id,
        clubAId: match.club_a_id,
        clubBId: match.club_b_id,
        fecha: match.fecha,
        estadio: match.estadio,
        resultadoA: match.resultado_a,
        resultadoB: match.resultado_b,
        createdAt: match.created_at,
        club_a: clubA || { id: match.club_a_id, nombre: 'Equipo Desconocido' },
        club_b: clubB || { id: match.club_b_id, nombre: 'Equipo Desconocido' },
      };
    }));

    return NextResponse.json(formattedMatches);
  } catch (error) {
    console.error("Error en /api/match/upcoming:", error);
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
