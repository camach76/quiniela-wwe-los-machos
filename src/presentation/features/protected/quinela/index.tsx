import { useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { Match } from '../../../hooks/useCompletedMatches';
import { MatchCard } from './components/MatchCard';
import { useCompletedMatches } from '../../../hooks/useCompletedMatches';
import { ProtectedLayout } from '../../../layouts/ProtectedLayout';

export function QuinelaPage() {
  const user = useUser();
  const { matches: completedMatches, loading, error, refetch } = useCompletedMatches();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  
  // Aquí deberías implementar useUpcomingMatches similar a useCompletedMatches
  const upcomingMatches: Match[] = []; // Reemplazar con el hook correspondiente
  
  const handleBetSaved = () => {
    // Recargar datos si es necesario
    refetch();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  const matchesToShow = activeTab === 'upcoming' ? upcomingMatches : completedMatches;

  return (
    <ProtectedLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Mi Quiniela</h1>
      
      {/* Pestañas */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'upcoming' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Próximos Partidos
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'completed' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('completed')}
        >
          Partidos Completados
        </button>
      </div>

      {/* Lista de partidos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matchesToShow.length > 0 ? (
          matchesToShow.map((match) => (
            <MatchCard 
              key={match.id} 
              match={match} 
              userId={user?.id || ''} 
              onBetSaved={handleBetSaved} 
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-8">
            No hay partidos {activeTab === 'upcoming' ? 'próximos' : 'completados'} para mostrar.
          </div>
        )}
      </div>
      </div>
    </ProtectedLayout>
  );
}

export default QuinelaPage;
