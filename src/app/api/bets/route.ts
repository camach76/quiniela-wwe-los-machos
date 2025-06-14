import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { SupabaseBetRepository } from "@/backend/core/infra/repositories/SupabaseBetRepository";
import { MakeBet } from "@/backend/core/usecases/MakeBet";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { matchId, prediccionA, prediccionB } = body;
    
    // Verificar autenticación
    const supabaseAuth = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabaseAuth.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;

    // Usar la clave de servicio para operaciones del lado del servidor
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY no está configurada');
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(
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

    const repo = new SupabaseBetRepository(supabaseAdmin);
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
