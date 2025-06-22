'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { MatchResultForm } from './components/MatchResultForm';
import { AdminLayout } from './components/layout/AdminLayout';
import { MatchList } from './components/matches';
import { Match, MatchWithClubs } from './types/match';
import { useAdminMatches } from './hooks/useAdminMatches';

export default function AdminView() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [status, setStatus] = useState<'scheduled' | 'completed' | 'all'>('scheduled');
  
  const {
    matches,
    loading: matchesLoading,
    error: matchesError,
    editingMatch,
    isSubmitting,
    setEditingMatch,
    updateMatchResult,
    resetMatchResult,
    refreshMatches,
    toggleMatchCompletion,
  } = useAdminMatches();

  // Filtrar partidos por estado
  const filteredMatches = () => {
    switch (status) {
      case 'scheduled':
        return matches.filter(match => !match.isComplete);
      case 'completed':
        return matches.filter(match => match.isComplete);
      case 'all':
      default:
        return [...matches].sort((a, b) => 
          new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        const supabase = createClientComponentClient();
        
        // Obtener la sesión actual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error al verificar la sesión:', sessionError);
          setError('Error al verificar la sesión');
          router.push('/login');
          return;
        }
        
        if (!session?.user) {
          console.log('No hay sesión activa, redirigiendo a login');
          router.push('/login');
          return;
        }
        
        // Verificar si el usuario es administrador
        const userEmail = session.user.email;
        const isAdminUser = userEmail === 'admin@quinela.com';
        
        if (!isAdminUser) {
          console.log('Usuario no es administrador, redirigiendo a dashboard');
          router.push('/dashboard');
          return;
        }
        
        setIsAdmin(true);
      } catch (error) {
        console.error('Error en AdminView:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [router]);

  const handleUpdateResult = async (resultado_a: number | null, resultado_b: number | null) => {
    if (!editingMatch) return { success: false, error: 'No hay partido seleccionado' };
    return updateMatchResult(editingMatch.id, resultado_a, resultado_b);
  };
  
  const handleResetResult = async (matchId: number) => {
    if (window.confirm('¿Estás seguro de que deseas reiniciar el resultado de este partido?')) {
      await resetMatchResult(matchId);
    }
  };
  
  if (isLoading || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Cargando panel de administración...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Administración de Partidos</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setStatus('scheduled')}
              className={`px-4 py-2 text-sm rounded-md ${
                status === 'scheduled' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Próximos
            </button>
            <button
              onClick={() => setStatus('completed')}
              className={`px-4 py-2 text-sm rounded-md ${
                status === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Completados
            </button>
            <button
              onClick={() => setStatus('all')}
              className={`px-4 py-2 text-sm rounded-md ${
                status === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todos
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {status === 'scheduled' 
                    ? 'Próximos Partidos' 
                    : status === 'completed' 
                      ? 'Partidos Completados' 
                      : 'Todos los Partidos'}
                </h2>
                <p className="text-sm text-gray-500">
                  {filteredMatches().length} partidos encontrados
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={refreshMatches}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={matchesLoading}
                >
                  {matchesLoading ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {matchesLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredMatches().length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {status === 'scheduled' 
                  ? 'No hay partidos programados' 
                  : status === 'completed' 
                    ? 'No hay partidos completados' 
                    : 'No hay partidos disponibles'}
              </div>
            ) : (
              <MatchList
                matches={filteredMatches()}
                onEdit={(match) => setEditingMatch(match)}
                onReset={handleResetResult}
                onToggleComplete={toggleMatchCompletion}
                isLoading={matchesLoading}
                isSubmitting={isSubmitting}
                emptyMessage={
                  status === 'scheduled' 
                    ? 'No hay partidos programados' 
                    : status === 'completed' 
                      ? 'No hay partidos completados' 
                      : 'No hay partidos disponibles'
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal de edición de resultado */}
      {editingMatch && (
        <MatchResultForm
          match={editingMatch}
          onCancel={() => setEditingMatch(null)}
          onSubmit={handleUpdateResult}
          isSubmitting={isSubmitting}
        />
      )}
    </AdminLayout>
  );
}
