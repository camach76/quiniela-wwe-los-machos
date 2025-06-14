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
      // Obtener detalles del club local con los campos necesarios
      const { data: clubA } = await supabase
        .from('clubs')
        .select('id, nombre, logo_url, pais')
        .eq('id', match.club_a_id)
        .single();
      
      // Obtener detalles del club visitante con los campos necesarios
      const { data: clubB } = await supabase
        .from('clubs')
        .select('id, nombre, logo_url, pais')
        .eq('id', match.club_b_id)
        .single();

      // Crear objeto de club local con valores por defecto
      const equipoLocal = clubA 
        ? { 
            id: clubA.id, 
            nombre: clubA.nombre, 
            logo: clubA.logo_url,
            pais: clubA.pais
          } 
        : { 
            id: match.club_a_id, 
            nombre: 'Equipo Desconocido',
            logo: '/placeholder.svg',
            pais: 'País desconocido'
          };

      // Crear objeto de club visitante con valores por defecto
      const equipoVisitante = clubB 
        ? { 
            id: clubB.id, 
            nombre: clubB.nombre, 
            logo: clubB.logo_url,
            pais: clubB.pais
          } 
        : { 
            id: match.club_b_id, 
            nombre: 'Equipo Desconocido',
            logo: '/placeholder.svg',
            pais: 'País desconocido'
          };

      return {
        id: match.id,
        clubAId: match.club_a_id,
        clubBId: match.club_b_id,
        fecha: match.fecha,
        estadio: match.estadio,
        resultadoA: match.resultado_a,
        resultadoB: match.resultado_b,
        createdAt: match.created_at,
        club_a: equipoLocal,
        club_b: equipoVisitante
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
