"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaFutbol, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { getClubRanking } from '@/lib/api';
import { TeamLogo } from '@/presentation/components/TeamLogo';

export default function TablaRankingClubes() {
  const [ranking, setRanking] = useState([]);
  const userName = "Usuario"; // Reemplazalo con tu lógica de auth si querés

  useEffect(() => {
    getClubRanking()
      .then(setRanking)
      .catch(console.error);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10 flex items-center justify-between px-4 lg:px-6 py-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <img
                src="/images/logo.png"
                alt="Logo"
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Quinela Mundial de Clubes
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative">
            <FaBell className="text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              {userName.charAt(0)}
            </div>
            <span className="text-gray-700 font-medium">Hola, {userName}</span>
          </div>
          <button className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition-colors">
            <FaSignOutAlt />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </nav>

      {/* Tabla */}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaFutbol /> Tabla de Posiciones
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                {['#','Escudo','Club','PJ','G','E','P','GF','GC','DG','PTS'].map(h => (
                  <th key={h} className="p-2">{h}</th>
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
