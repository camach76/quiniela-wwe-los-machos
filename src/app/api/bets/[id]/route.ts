import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SupabaseBetRepository } from "@/backend/core/infra/repositories/SupabaseBetRepository";
import { UpdateBet } from "@/backend/core/usecases/UpdateBet";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

async function getAuthenticatedUser(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("No se proporcionó token de autenticación");
    throw new Error("No autenticado");
  }

  const token = authHeader.split(" ")[1];
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    console.error(
      "Error al verificar el token:",
      error?.message || "Usuario no encontrado",
    );
    throw new Error("No autenticado");
  }

  return { userId: user.id };
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const userId = context.params.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Se requiere el ID de usuario" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("SUPABASE_SERVICE_ROLE_KEY no está configurada");
      return NextResponse.json(
        { error: "Error de configuración del servidor" },
        { status: 500 },
      );
    }

    const repo = new SupabaseBetRepository(supabase);
    const bets = await repo.getByUser(userId);

    return NextResponse.json(bets);
  } catch (error) {
    console.error("Error en GET /api/bets/[id]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const { userId } = await getAuthenticatedUser(request);
    const betId = context.params.id;

    const { prediccionA, prediccionB } = await request.json();

    if (!betId) {
      return NextResponse.json(
        { error: "Se requiere el ID del pronóstico" },
        { status: 400 },
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const repo = new SupabaseBetRepository(supabaseAdmin);
    const existingBet = await repo.getById(betId);

    if (!existingBet || existingBet.userId !== userId) {
      return NextResponse.json(
        { error: "No autorizado o el pronóstico no existe" },
        { status: 403 },
      );
    }

    const match = await supabaseAdmin
      .from("matches")
      .select("fecha")
      .eq("id", existingBet.matchId)
      .single();

    if (match.error) {
      console.error("Error al verificar la fecha del partido:", match.error);
      return NextResponse.json(
        { error: "Error al verificar el estado del partido" },
        { status: 500 },
      );
    }

    const partidoYaComenzo = new Date() >= new Date(match.data.fecha);
    if (partidoYaComenzo) {
      return NextResponse.json(
        {
          error:
            "No se pueden actualizar pronósticos una vez que el partido ha comenzado",
        },
        { status: 400 },
      );
    }

    const updateData = {
      betId: betId,
      prediccionA:
        prediccionA !== undefined ? prediccionA : existingBet.prediccionA,
      prediccionB:
        prediccionB !== undefined ? prediccionB : existingBet.prediccionB,
    };

    if (updateData.prediccionA === null && updateData.prediccionB === null) {
      return NextResponse.json(
        { error: "Debe haber al menos un pronóstico" },
        { status: 400 },
      );
    }

    const useCase = new UpdateBet(repo);
    const result = await useCase.execute(updateData);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en PUT /api/bets/[id]:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error desconocido",
        details: error instanceof Error ? error.stack : undefined,
      },
      {
        status:
          error instanceof Error && error.message === "No autenticado"
            ? 401
            : 500,
      },
    );
  }
}
