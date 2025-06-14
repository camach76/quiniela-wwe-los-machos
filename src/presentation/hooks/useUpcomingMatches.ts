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
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/match/upcoming");
        if (!res.ok) throw new Error("Error cargando los partidos");
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        setError("No se pudieron cargar los partidos");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return { matches, loading, error };
};
