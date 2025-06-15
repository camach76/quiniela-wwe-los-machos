import React from 'react';
import Link from 'next/link';
import { FaFutbol, FaTable, FaUser, FaBell } from 'react-icons/fa';

interface AccesoRapido {
  icono: React.ReactNode;
  titulo: string;
  descripcion: string;
  ruta: string;
  color: string;
}

export const AccesosRapidos: React.FC = () => {
  const accesos: AccesoRapido[] = [
    {
      icono: <FaFutbol className="text-blue-500" />,
      titulo: 'Mis Pronósticos',
      descripcion: 'Revisa y edita tus pronósticos',
      ruta: '/quinela',
      color: 'from-blue-100 to-blue-50'
    },
    {
      icono: <FaTable className="text-green-500" />,
      titulo: 'Tabla de Posiciones',
      descripcion: 'Consulta el ranking de jugadores',
      ruta: '/tabla',
      color: 'from-green-100 to-green-50'
    },
    {
      icono: <FaTable className="text-yellow-500" />,
      titulo: 'Partidos',
      descripcion: 'Consulta los partidos',
      ruta: '/resultados',
      color: 'from-yellow-100 to-yellow-50' 
    },
    {
      icono: <FaUser className="text-purple-500" />,
      titulo: 'Mi Perfil',
      descripcion: 'Administra tu cuenta',
      ruta: '/perfil',
      color: 'from-purple-100 to-purple-50'
    }, 
    {
      icono: <FaBell className="text-red-500" />,
      titulo: 'Notificaciones',
      descripcion: 'Mantente actualizado',
      ruta: '/notificaciones',
      color: 'from-red-100 to-red-50'
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-6 border border-white/20">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Accesos Rápidos</h2>
      <div className="space-y-3">
        {accesos.map((acceso, index) => (
          <Link
            key={index}
            href={acceso.ruta}
            className={`block p-3 rounded-lg hover:shadow-md transition-all bg-gradient-to-r ${acceso.color} border border-white`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-full shadow-sm">
                {acceso.icono}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{acceso.titulo}</h3>
                <p className="text-xs text-gray-600">{acceso.descripcion}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};