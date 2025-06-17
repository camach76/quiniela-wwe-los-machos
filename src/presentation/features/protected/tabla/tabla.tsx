"use client";

import { useEffect, useState } from "react";
import { FaFutbol } from "react-icons/fa";
import { getClubRanking } from "@/lib/api";
import { TeamLogo } from "@/presentation/components/TeamLogo";

export default function TablaRankingClubes() {
  const [ranking, setRanking] = useState<Array<{
    userId: string;
    puntajeTotal: number;
    updatedAt: string;
    pj: number;
    g: number;
    e: number;
    p: number;
    gf: number;
    gc: number;
    dg: number;
    pts: number;
    forma: string[];
    club_id?: string;
    club?: {
      id: string;
      nombre: string;
      logo: string;
    };
  }>>([]);
  const userName = "Usuario";

  useEffect(() => {
    getClubRanking().then(setRanking).catch(console.error);
  }, []);

  return (
    <>
      {/* Tabla */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaFutbol /> Tabla de Posiciones
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                {[
                  { id: 'pos', label: '#' },
                  { id: 'escudo', label: 'Escudo' },
                  { id: 'club', label: 'Club' },
                  { id: 'pj', label: 'PJ' },
                  { id: 'g', label: 'G' },
                  { id: 'e', label: 'E' },
                  { id: 'p', label: 'P' },
                  { id: 'gf', label: 'GF' },
                  { id: 'gc', label: 'GC' },
                  { id: 'dg', label: 'DG' },
                  { id: 'pts', label: 'PTS' },
                ].map((header) => (
                  <th key={header.id} className="p-2">
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ranking.map((club, index) => (
                <tr key={club.userId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    <TeamLogo 
                      name={club.club?.nombre || 'Club'} 
                      logoUrl={club.club?.logo || ''} 
                      size={24} 
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">{club.club?.nombre || 'Club'}</td>
                  <td className="px-4 py-2 text-center">{club.pj}</td>
                  <td className="px-4 py-2 text-center">{club.g}</td>
                  <td className="px-4 py-2 text-center">{club.e}</td>
                  <td className="px-4 py-2 text-center">{club.p}</td>
                  <td className="px-4 py-2 text-center">{club.gf}</td>
                  <td className="px-4 py-2 text-center">{club.gc}</td>
                  <td className="px-4 py-2 text-center font-bold">{club.dg}</td>
                  <td className="px-4 py-2 text-center font-bold">{club.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
