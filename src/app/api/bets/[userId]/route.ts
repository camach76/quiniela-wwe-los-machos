import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { SupabaseBetRepository } from "@/backend/core/infra/repositories/SupabaseBetRepository";

// Configuración para forzar renderizado dinámico
export const dynamic = "force-dynamic";

export const dynamicParams = true; // Habilita la generación de rutas dinámicas en el servidor

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // Obtener el userId de los parámetros de la ruta
    const userId = params.userId;
    if (!userId) {
      return NextResponse.json(
        { error: "Se requiere el ID de usuario" },
        { status: 400 }
      );
    }

    // Usar la clave de servicio para operaciones del lado del servidor
    const supabase = createClient(
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
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY no está configurada');
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    const repo = new SupabaseBetRepository(supabase);
    const bets = await repo.getByUser(userId);

    return NextResponse.json(bets);
  } catch (error) {
    console.error("Error en /api/bets/[userId]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}
