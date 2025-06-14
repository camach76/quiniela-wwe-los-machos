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

    // Obtener los partidos recientes con resultados
    const { data: matches, error } = await supabase
      .from('matches')
      .select(`
        *,
        club_a:clubs_matches_club_a_idToclubs(*),
        club_b:clubs_matches_club_b_idToclubs(*)
      `)
      .not('resultado_a', 'is', null)
      .not('resultado_b', 'is', null)
      .lt('fecha', new Date().toISOString())
      .order('fecha', { ascending: false })
      .limit(4);

    if (error) {
      throw error;
    }

    // Formatear los datos para la respuesta
    const formattedMatches = matches.map(match => {
      const fecha = new Date(match.fecha);
      const fechaFormateada = fecha.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });

      return {
        id: match.id,
        club_a: match.club_a || { id: match.club_a_id, nombre: 'Equipo Local' },
        club_b: match.club_b || { id: match.club_b_id, nombre: 'Equipo Visitante' },
        resultado_a: match.resultado_a,
        resultado_b: match.resultado_b,
        fecha: fechaFormateada,
        estadio: match.estadio,
        competicion: 'Mundial de clubes'
      };
    });

    return NextResponse.json(formattedMatches);
  } catch (error) {
    console.error("Error en /api/match/recent:", error);
    return NextResponse.json(
      {
        error: "Error al cargar los partidos recientes",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
