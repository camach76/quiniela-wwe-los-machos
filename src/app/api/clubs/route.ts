import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { SupabaseClubRepository } from '@/backend/core/infra/repositories/SupabaseClubRepository';
import { GetAllClubs } from '@/backend/core/usecases/GetAllClubs';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Crear cliente de Supabase con la clave anónima
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    // Inicializar el repositorio y el caso de uso
    const repo = new SupabaseClubRepository(supabase as any);
    const useCase = new GetAllClubs(repo);

    const result = await useCase.execute();

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error en /api/clubs:', error);
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
