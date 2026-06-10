"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/presentation/utils/supabase/client";
import { TeamLogo } from "@/presentation/components/TeamLogo";

type TeamStanding = {
  id: number;
  nombre: string;
  logo_url: string;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
};

type GroupStandings = {
  grupo: string;
  teams: TeamStanding[];
};

function computeStandings(matches: any[]): GroupStandings[] {
  const groups: Record<string, Record<number, TeamStanding>> = {};

  const ensureTeam = (grupo: string, club: any): void => {
    if (!groups[grupo]) groups[grupo] = {};
    if (!groups[grupo][club.id]) {
      groups[grupo][club.id] = {
        id: club.id,
        nombre: club.nombre,
        logo_url: club.logo_url,
        pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0,
      };
    }
  };

  for (const match of matches) {
    const { grupo, club_a, club_b, resultado_a: ra, resultado_b: rb } = match;
    if (!grupo || ra === null || rb === null || !club_a || !club_b) continue;

    ensureTeam(grupo, club_a);
    ensureTeam(grupo, club_b);

    const a = groups[grupo][club_a.id];
    const b = groups[grupo][club_b.id];

    a.pj++; b.pj++;
    a.gf += ra; a.gc += rb;
    b.gf += rb; b.gc += ra;

    if (ra > rb)      { a.g++; a.pts += 3; b.p++; }
    else if (ra < rb) { b.g++; b.pts += 3; a.p++; }
    else              { a.e++; a.pts++; b.e++; b.pts++; }

    a.dg = a.gf - a.gc;
    b.dg = b.gf - b.gc;
  }

  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([grupo, teamsMap]) => ({
      grupo,
      teams: Object.values(teamsMap).sort(
        (a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf
      ),
    }));
}

export default function TablaGrupos() {
  const [standings, setStandings] = useState<GroupStandings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("matches")
      .select("grupo, resultado_a, resultado_b, club_a:club_a_id(id, nombre, logo_url), club_b:club_b_id(id, nombre, logo_url)")
      .not("resultado_a", "is", null)
      .then(({ data, error }) => {
        if (!error && data) setStandings(computeStandings(data));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full p-4 md:p-6 grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-48" />
        ))}
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <span className="text-5xl mb-4">⚽</span>
        <p className="text-lg font-medium">Sin resultados todavía</p>
        <p className="text-sm mt-1">Las posiciones aparecerán cuando el admin ingrese resultados</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-5">Tabla de Posiciones — Copa Mundial FIFA 2026</h1>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))' }}>
        {standings.map(({ grupo, teams }) => (
          <div key={grupo} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header del grupo */}
            <div className="bg-blue-600 px-4 py-2">
              <span className="text-white font-bold text-sm tracking-wide">GRUPO {grupo}</span>
            </div>

            {/* Tabla */}
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase">
                  <th className="px-3 py-2 text-left font-semibold" colSpan={2}>Selección</th>
                  <th className="py-2 text-center font-semibold w-6">PJ</th>
                  <th className="py-2 text-center font-semibold w-6">G</th>
                  <th className="py-2 text-center font-semibold w-6">E</th>
                  <th className="py-2 text-center font-semibold w-6">P</th>
                  <th className="py-2 text-center font-semibold w-6">DG</th>
                  <th className="py-2 text-center font-semibold w-8 text-blue-600">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {teams.map((team, idx) => (
                  <tr key={team.id} className={`hover:bg-gray-50 transition-colors ${idx < 2 ? 'bg-green-50/40' : ''}`}>
                    <td className="pl-3 py-2 w-7">
                      <span className={`text-xs font-bold ${idx < 2 ? 'text-green-600' : 'text-gray-400'}`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-2">
                        <TeamLogo name={team.nombre} logoUrl={team.logo_url} size={20} />
                        <span className="font-medium text-gray-800 truncate">{team.nombre}</span>
                      </div>
                    </td>
                    <td className="py-2 text-center text-gray-600">{team.pj}</td>
                    <td className="py-2 text-center text-gray-600">{team.g}</td>
                    <td className="py-2 text-center text-gray-600">{team.e}</td>
                    <td className="py-2 text-center text-gray-600">{team.p}</td>
                    <td className={`py-2 text-center font-medium ${team.dg > 0 ? 'text-green-600' : team.dg < 0 ? 'text-red-500' : 'text-gray-600'}`}>
                      {team.dg > 0 ? `+${team.dg}` : team.dg}
                    </td>
                    <td className="py-2 text-center font-black text-blue-600 pr-3">{team.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Leyenda */}
            <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1" />
                Clasifican a octavos
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
