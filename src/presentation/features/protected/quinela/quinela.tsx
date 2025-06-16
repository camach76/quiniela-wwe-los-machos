"use client";

import { useEffect, useState, useMemo } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseMatchRepository } from "@/backend/core/infra/repositories/SupabaseMatchRepository";
import { SupabaseBetRepository } from "@/backend/core/infra/repositories/SupabaseBetRepository";
import { Bet } from "@/backend/core/domain/entities/betEntity";
import { Club } from "@/types/partidos";
import { clubService } from "@/backend/core/services/clubService";
import { ApuestaForm } from "@/presentation/components/quiniela/quinelaApuesta/apuestaForm";
import { format, parseISO, isToday, isTomorrow, isYesterday, isThisWeek, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

type PartidoConClubes = {
  id: string;
  fecha: string;
  club_a: {
    nombre: string;
    logo: string;
  };
  club_b: {
    nombre: string;
    logo: string;
  };
  goles_local: number | null;
  goles_visitante: number | null;
};

type GroupedMatches = {
  date: Date;
  dateLabel: string;
  matches: PartidoConClubes[];
};

export default function QuinelaPage() {
  const [matches, setMatches] = useState<PartidoConClubes[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<PartidoConClubes | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(0); // 0=hoy, 1=mañana, 2=pasado

  const supabase = createClientComponentClient();

  // Obtener fechas para los filtros
  const filterDates = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    
    return [today, tomorrow, dayAfterTomorrow];
  }, []);

  // Agrupar partidos por fecha
  const groupedMatches = useMemo(() => {
    const groups: GroupedMatches[] = [];
    const dates = new Set<string>();
    
    // Ordenar partidos por fecha
    const sortedMatches = [...matches].sort((a, b) => 
      new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    sortedMatches.forEach((match: PartidoConClubes) => {
      const matchDate = new Date(match.fecha);
      const dateKey = matchDate.toDateString();
      
      if (!dates.has(dateKey)) {
        dates.add(dateKey);
        
        let dateLabel = '';
        if (isToday(matchDate)) {
          dateLabel = 'Hoy';
        } else if (isTomorrow(matchDate)) {
          dateLabel = 'Mañana';
        } else if (isYesterday(matchDate)) {
          dateLabel = 'Ayer';
        } else {
          // Usamos startOfWeek para ver si está en la semana actual
          const startOfWeek = new Date();
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Lunes de esta semana
          
          if (matchDate >= startOfWeek) {
            dateLabel = format(matchDate, 'EEEE', { locale: es });
            dateLabel = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);
          } else {
            dateLabel = format(matchDate, 'EEEE d MMMM', { locale: es });
            dateLabel = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);
          }
        }
        
        groups.push({
          date: matchDate,
          dateLabel,
          matches: []
        });
      }
      
      const group = groups.find(g => 
        isSameDay(new Date(g.date), matchDate)
      );
      
      if (group) {
        group.matches.push(match);
      }
    });
    
    return groups;
  }, [matches]);

  // Filtrar partidos por día seleccionado
  const filteredGroups = useMemo(() => {
    if (groupedMatches.length === 0) return [];
    
    const selectedDate = filterDates[selectedDay];
    const filtered = groupedMatches.filter((group: GroupedMatches) => 
      isSameDay(new Date(group.date), selectedDate)
    );
    
    // Si no hay partidos para el día seleccionado, devolver un array vacío
    return filtered.length > 0 ? filtered : [];
  }, [groupedMatches, selectedDay, filterDates]);
  
  // Función para obtener la etiqueta del día
  const getDayLabel = (date: Date) => {
    if (isToday(date)) return 'Hoy';
    if (isTomorrow(date)) return 'Mañana';
    return format(date, 'EEEE', { locale: es });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) throw new Error("No hay usuario");

        setUserId(user.id);

        // Inicializamos los repositorios sin pasar el cliente de Supabase
        const matchRepo = new SupabaseMatchRepository();
        const betRepo = new SupabaseBetRepository();

        const [upcoming, userBets, allClubs] = await Promise.all([
          matchRepo.getUpcoming(),
          betRepo.getByUser(user.id),
          clubService.getAll(),
        ]);

        const clubsMap = allClubs.reduce<Record<string, Club>>(
          (acc, club) => {
            acc[club.id] = club;
            return acc;
          },
          {}
        );

        const partidos: PartidoConClubes[] = upcoming.map((match) => {
          const clubA = clubsMap[match.club_a_id.toString()];
          const clubB = clubsMap[match.club_b_id.toString()];

          return {
            id: match.id.toString(),
            fecha: match.fecha,
            club_a: {
              nombre: clubA?.nombre ?? "Desconocido",
              logo: clubA?.logo ?? "",
            },
            club_b: {
              nombre: clubB?.nombre ?? "Desconocido",
              logo: clubB?.logo ?? "",
            },
            goles_local: match.resultado_a,
            goles_visitante: match.resultado_b,
          };
        });

        setMatches(partidos);
        setBets(userBets);
      } catch (err) {
        console.error("❌ Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmitPrediction = async (
    matchId: number,
    a: number,
    b: number,
  ) => {
    if (!userId) return;

    const betRepo = new SupabaseBetRepository();

    try {
      // Primero intentamos obtener la apuesta existente
      let existingBet = bets.find(b => b.matchId === matchId);
      
      // Si no encontramos la apuesta localmente, intentamos buscarla en la base de datos
      if (!existingBet) {
        try {
          const betsFromDb = await betRepo.getByUser(userId);
          existingBet = betsFromDb.find(b => b.matchId === matchId);
        } catch (error) {
          console.error('Error al buscar apuesta existente:', error);
        }
      }
      
      if (existingBet) {
        // Si existe, la actualizamos
        await betRepo.update({
          ...existingBet,
          prediccionA: a,
          prediccionB: b,
        });
      } else {
        // Si no existe, creamos una nueva
        await betRepo.create({
          userId,
          matchId,
          prediccionA: a,
          prediccionB: b,
        });
      }

      // Actualizamos la lista de apuestas
      const updated = await betRepo.getByUser(userId);
      setBets(updated);
    } catch (err) {
      console.error('Error al guardar la predicción:', err);
      alert("Error al guardar la predicción. Por favor, inténtalo de nuevo.");
    }
  };

  if (loading)
    return <div className="p-4 text-center">Cargando partidos...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
      {/* 🟦 Lista de partidos */}
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Partidos</h2>
          <div className="flex flex-wrap gap-2">
            {filterDates.map((date, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex-1 min-w-[120px] text-center ${
                  selectedDay === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="font-medium">{getDayLabel(date)}</div>
                <div className="text-xs opacity-80">
                  {format(date, 'd MMM', { locale: es })}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredGroups.length === 0 ? (
            <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow">
              No hay partidos programados para esta fecha
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.date.toString()} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-700">
                  {group.dateLabel}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.matches.map((match) => (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatch(match)}
                      className={`p-4 bg-white border rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md ${
                        selectedMatch?.id === match.id 
                          ? 'ring-2 ring-blue-500 border-blue-300' 
                          : 'border-gray-200 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-right flex-1 pr-2">
                          <div className="font-medium text-sm sm:text-base">{match.club_a.nombre}</div>
                        </div>
                        <div className="px-2 text-gray-500 text-sm sm:text-base">vs</div>
                        <div className="text-left flex-1 pl-2">
                          <div className="font-medium text-sm sm:text-base">{match.club_b.nombre}</div>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500 text-center">
                        {format(parseISO(match.fecha), 'HH:mm')} hs
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🟨 Formulario de apuesta */}
      <div className="lg:sticky lg:top-6 lg:w-[36rem] xl:w-[40rem] flex-shrink-0">
        <div className="h-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {selectedMatch ? (
            <>
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 text-white">
                <h2 className="text-2xl font-bold">Haz tu apuesta</h2>
              </div>
              <div className="p-5">
                <ApuestaForm
                  match={selectedMatch}
                  bet={bets.find((b) => b.matchId === parseInt(selectedMatch.id))}
                  onSubmit={(a, b) =>
                    handleSubmitPrediction(parseInt(selectedMatch.id), a, b)
                  }
                />
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <div className="text-gray-300 mb-3">
                <svg 
                  className="w-16 h-16 mx-auto" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.5" 
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">Selecciona un partido</h3>
              <p className="text-gray-500 text-sm">
                Elige un partido de la lista para hacer tu apuesta
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
