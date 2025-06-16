"use client";

import { useEffect, useState } from "react";
import { FaFutbol } from "react-icons/fa";
import { getClubRanking } from "@/lib/api";
import { TeamLogo } from "@/presentation/components/TeamLogo";

export default function TablaRankingClubes() {
  const [ranking, setRanking] = useState([]);
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
                  "#",
                  "Escudo",
                  "Club",
                  "PJ",
                  "G",
                  "E",
                  "P",
                  "GF",
                  "GC",
                  "DG",
                  "PTS",
                ].map((h) => (
                  <th key={h} className="p-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ranking.map((item: any, idx: number) => (
                <tr key={item.club.id} className="border-b">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">
                    <TeamLogo
                      name={item.club.nombre}
                      logoUrl={item.club.logo_url}
                      size={32}
                    />
                  </td>
                  <td className="p-2">{item.club.nombre}</td>
                  <td className="p-2">{item.pj}</td>
                  <td className="p-2">{item.g}</td>
                  <td className="p-2">{item.e}</td>
                  <td className="p-2">{item.p}</td>
                  <td className="p-2">{item.gf}</td>
                  <td className="p-2">{item.gc}</td>
                  <td className="p-2">{item.dg}</td>
                  <td className="p-2 font-bold">{item.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
