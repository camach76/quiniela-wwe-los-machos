
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const hoy = new Date();
    hoy.setUTCHours(0, 0, 0, 0);

    const matches = await prisma.match.findMany({
      where: {
        fecha: {
          gte: hoy,
        },
      },
      include: {
        club_a: true,
        club_b: true,
      },
      orderBy: {
        fecha: "asc",
      },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Error obteniendo los partidos de hoy:", error);
    return NextResponse.json(
      { error: "Error al obtener los partidos." },
      { status: 500 }
    );
  }
}
