import { prisma } from "@/lib/prisma";

export async function getClubRanking() {
  const res = await fetch('/api/club_ranking');
  if (!res.ok) {
    throw new Error('Error al obtener ranking de clubes: ' + res.statusText);
  }
  return res.json(); // esperá array con { club, pj, g, e, p, gf, gc, dg, pts, forma }
}

