import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { SupabaseBetRepository } from "@/backend/core/infra/repositories/SupabaseBetRepository";

// Configuración para forzar renderizado dinámico
export const dynamic = "force-dynamic";

export const dynamicParams = true; // Habilita la generación de rutas dinámicas en el servidor

type RouteParams = {
  params: {
    userId: string;
  };
};

// Función auxiliar para validar el token de autenticación
async function validateAuthToken(request: NextRequest) {
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

  // Obtener el token del header de autorización
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('No se proporcionó token de autenticación');
    throw new Error('No autenticado');
  }
  
  const token = authHeader.split(' ')[1];
  
  // Verificar el token
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    console.error('Error al verificar el token:', error?.message || 'Usuario no encontrado');
    throw new Error('No autenticado');
  }
  
  return { userId: user.id };
}

export async function GET(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  console.log('GET /api/users/[userId]/bets - Iniciando solicitud');
  const { userId } = context.params;
  
  try {
    // Validar el token de autenticación
    const auth = await validateAuthToken(request);
    console.log('Usuario autenticado:', auth.userId);
    
    // Verificar que el usuario esté accediendo a sus propios datos
    if (auth.userId !== userId) {
      console.error('Intento de acceso no autorizado a datos de otro usuario');
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }
    console.log('ID de usuario recibido:', userId);
    
    if (!userId) {
      console.error('Error: No se proporcionó userId');
      return NextResponse.json(
        { error: "Se requiere el ID de usuario" },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Error: Variables de entorno de Supabase no configuradas');
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    console.log('Configurando cliente Supabase...');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    );

    console.log('Creando instancia de SupabaseBetRepository...');
    const repo = new SupabaseBetRepository(supabase);
    
    console.log('Obteniendo apuestas para el usuario:', userId);
    const bets = await repo.getByUser(userId);
    
    console.log('Apuestas encontradas:', bets.length);
    return NextResponse.json(bets || []);
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error en GET /api/users/[userId]/bets:', {
      message: errorMessage,
      stack: errorStack,
      userId: userId,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: 'Error al obtener las apuestas',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined 
      },
      { status: 500 }
    );
  }
}
