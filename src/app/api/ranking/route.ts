import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { SupabaseUserRepository } from "@/backend/core/infra/repositories/SupabaseUserReposotory";
import { GetRankingUsers } from "@/backend/core/usecases/GetRankingUsers";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currentUserId = searchParams.get('userId') || 'anonymous';
  
  try {
    // Crear cliente de Supabase con la clave anónima
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    // Crear cliente de solo lectura para las consultas
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    // Obtener el token de autorización del header
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    // Inicializar el repositorio y el caso de uso
    const repo = new SupabaseUserRepository(supabase as any);
    const useCase = new GetRankingUsers(repo);

    // Obtener el ranking con el ID del usuario actual
    const result = await useCase.execute(currentUserId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error en /api/ranking:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
        ...(process.env.NODE_ENV === 'development' && {
          stack: error instanceof Error ? error.stack : undefined
        })
      },
      { status: 500 }
    );
  }
}
