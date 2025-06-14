import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { SupabaseBetRepository } from "@/backend/core/infra/repositories/SupabaseBetRepository";
import { MakeBet } from "@/backend/core/usecases/MakeBet";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic";

// Función para obtener el cliente de Supabase con permisos de administrador
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');
    const userId = searchParams.get('userId');

    if (!matchId || !userId) {
      return NextResponse.json(
        { error: 'Se requieren los parámetros matchId y userId' },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    
    // Buscar si ya existe un pronóstico para este partido y usuario
    const { data: existingBet, error } = await supabaseAdmin
      .from('bets')
      .select('*')
      .eq('match_id', matchId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error al buscar pronóstico existente:', error);
      throw error;
    }

    return NextResponse.json(existingBet || null);
  } catch (error) {
    console.error('Error en GET /api/bets:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al verificar el pronóstico' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log('Iniciando solicitud POST a /api/bets');
    const body = await req.json();
    console.log('Cuerpo de la solicitud recibido:', JSON.stringify(body, null, 2));
    
    // Usar los nombres de campos que vienen del frontend
    const { match_id, user_id, prediccion_a, prediccion_b, puntos } = body;
    
    // Validar campos requeridos
    if (!match_id || prediccion_a === undefined || prediccion_b === undefined) {
      console.error('Faltan campos requeridos:', { 
        match_id, 
        prediccion_a, 
        prediccion_b,
        user_id,
        puntos
      });
      return NextResponse.json(
        { error: 'Se requieren los campos match_id, prediccion_a, prediccion_b, user_id' },
        { status: 400 }
      );
    }
    
    // Verificar autenticación
    const supabaseAuth = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabaseAuth.auth.getSession();
    
    if (!session || session.user.id !== user_id) {
      console.error('No autorizado o ID de usuario no coincide');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    console.log('Usuario autenticado:', user_id);

    // Validar clave de servicio
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const errorMsg = 'SUPABASE_SERVICE_ROLE_KEY no está configurada';
      console.error(errorMsg);
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    try {
      const supabaseAdmin = getSupabaseAdmin();
      const repo = new SupabaseBetRepository(supabaseAdmin);
      const useCase = new MakeBet(repo);

      console.log('Ejecutando caso de uso MakeBet con:', { 
        userId: user_id, 
        matchId: match_id, 
        prediccionA: prediccion_a, 
        prediccionB: prediccion_b 
      });

      const result = await useCase.execute({
        userId: user_id,
        matchId: match_id,
        prediccionA: prediccion_a,
        prediccionB: prediccion_b,
      });

      console.log('Pronóstico guardado exitosamente:', result);
      return NextResponse.json(result);
    } catch (error) {
      console.error('Error al ejecutar el caso de uso MakeBet:', error);
      throw error; // Se manejará en el catch externo
    }
  } catch (error) {
    console.error("Error en /api/bets:", error);
    
    // Registrar el error completo para depuración
    if (error instanceof Error) {
      console.error('Stack trace:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Error al procesar la solicitud',
        details: error instanceof Error ? error.message : 'Error desconocido',
        // Solo incluir stack en desarrollo
        ...(process.env.NODE_ENV === 'development' && {
          stack: error instanceof Error ? error.stack : undefined,
        })
      },
      { status: 500 },
    );
  }
}
