import { useEffect, useState } from "react";

export interface Club {
  id: string
  nombre: string
  logo: string
  color: string
}

export interface Competition {
  id: string
  name: string
}

export interface Match {
  id: string
  fecha: string
  status: string
  venue: string
  competition: Competition
  club_a: Club
  club_b: Club
  home_team: string
  away_team: string
  home_score: number | null
  away_score: number | null
}

export const useUpcomingMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log('Iniciando carga de partidos...');
    const fetchMatches = async () => {
      try {
        console.log('Haciendo fetch a /api/match/upcoming');
        const res = await fetch("/api/match/upcoming");
        console.log('Respuesta recibida:', res.status, res.statusText);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error en la respuesta:', errorText);
          throw new Error(`Error cargando los partidos: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('Datos recibidos:', data);
        setMatches(data);
      } catch (err) {
        console.error('Error al cargar partidos:', err);
        setError(`No se pudieron cargar los partidos: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        console.log('Finalizando carga de partidos');
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return { matches, loading, error };
};
