'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from './components/layout/AdminLayout';
import { UserCircleIcon, TrophyIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useAdminUsers } from './hooks/useAdminUsers';

type UserWithPoints = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  points: number;
  correct_predictions: number;
  total_predictions: number;
};

export const UsersView = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { users, loading, error, refreshUsers } = useAdminUsers();

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshUsers();
    } finally {
      setIsRefreshing(false);
    }
  };

  const headerAction = (
    <button
      onClick={handleRefresh}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      disabled={loading || isRefreshing}
    >
      <ArrowPathIcon className={`-ml-1 mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Actualizando...' : 'Actualizar Puntajes'}
    </button>
  );

  if (error) {
    return (
      <AdminLayout title="Error">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error al cargar los usuarios: {error.message}
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Puntajes de Usuarios" headerAction={headerAction}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Clasificación de Usuarios
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {users.length} usuarios registrados
          </p>
        </div>
        
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No hay usuarios registrados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posición
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Puntos
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aciertos
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user: UserWithPoints, index: number) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                          {index < 3 && (
                            <TrophyIcon 
                              className={`h-5 w-5 mr-2 ${
                                index === 0 ? 'text-yellow-400' : 
                                index === 1 ? 'text-gray-400' : 
                                'text-amber-600'
                              }`} 
                            />
                          )}
                          {index + 1}°
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.avatar_url ? (
                              <img 
                                className="h-10 w-10 rounded-full" 
                                src={user.avatar_url} 
                                alt={user.full_name || 'Avatar del usuario'}
                              />
                            ) : (
                              <UserCircleIcon className="h-10 w-10 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.full_name || 'Usuario sin nombre'}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-semibold">{user.points || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.correct_predictions || 0} de {user.total_predictions || 0} partidos
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersView;
