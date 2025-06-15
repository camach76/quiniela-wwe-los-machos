"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SupabaseMatchRepository } from "@/backend/core/infra/repositories/SupabaseMatchRepository";
import { SupabaseBetRepository } from "@/backend/core/infra/repositories/SupabaseBetRepository";
import { Bet } from "@/backend/core/domain/entities/betEntity";
import { Club } from "@/types/partidos";
import { clubService } from "@/backend/core/services/clubService";
import { ApuestaForm } from "@/presentation/components/quiniela/quinelaApuesta/apuestaForm";

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

export default function QuinelaPage() {
  const [matches, setMatches] = useState<PartidoConClubes[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<PartidoConClubes | null>(
    null,
  );

  const supabase = createClientComponentClient();

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

        const matchRepo = new SupabaseMatchRepository(supabase);
        const betRepo = new SupabaseBetRepository(supabase);

        const [upcoming, userBets, allClubs] = await Promise.all([
          matchRepo.getUpcoming(),
          betRepo.getByUser(user.id),
          clubService.getAll(),
        ]);

        const clubsMap = allClubs.reduce(
          (acc, club) => {
            acc[club.id] = club;
            return acc;
          },
          {} as Record<string, Club>,
        );

        const partidos = upcoming.map((match) => {
          const clubA = clubsMap[match.club_a_id.toString()];
          const clubB = clubsMap[match.club_b_id.toString()];

          return {
            id: match.id.toString(),
            fecha: match.fecha,
            club_a: {
              nombre: clubA?.nombre ?? "Desconocido",
              logo: clubA?.logo_url ?? "",
            },
            club_b: {
              nombre: clubB?.nombre ?? "Desconocido",
              logo: clubB?.logo_url ?? "",
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

    const betRepo = new SupabaseBetRepository(supabase);

    try {
      await betRepo.create({
        userId,
        matchId,
        prediccion_a: a,
        prediccion_b: b,
      });

      const updated = await betRepo.getByUser(userId);
      setBets(updated);
    } catch (err) {
      console.error(err);
      alert("Error al guardar la predicción");
    }
  };

  if (loading)
    return <div className="p-4 text-center">Cargando partidos...</div>;

  const hoy = new Date().toDateString();
  const partidosDelDia = matches.filter(
    (p) => new Date(p.fecha).toDateString() === hoy,
  );

  return (
    <div className="grid md:grid-cols-2 gap-6 p-4 max-w-6xl mx-auto">
      {/* 🟦 Lista de partidos */}
      <div>
        <h2 className="text-xl font-bold mb-4">Partidos de hoy</h2>
        {partidosDelDia.length === 0 && (
          <p className="text-gray-500">No hay partidos hoy</p>
        )}
        <ul className="space-y-2">
          {partidosDelDia.map((match) => (
            <li
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              className={`p-3 border rounded cursor-pointer hover:bg-gray-100 ${
                selectedMatch?.id === match.id ? "bg-blue-100" : ""
              }`}
            >
              {match.club_a.nombre} vs {match.club_b.nombre}
            </li>
          ))}
        </ul>
      </div>

      {/* 🟨 Formulario de apuesta */}
      <div>
        {selectedMatch ? (
          <ApuestaForm
            match={selectedMatch}
            bet={bets.find((b) => b.matchId === parseInt(selectedMatch.id))}
            onSubmit={(a, b) =>
              handleSubmitPrediction(parseInt(selectedMatch.id), a, b)
            }
          />
        ) : (
          <p className="text-gray-500 text-center mt-10">
            Selecciona un partido para hacer tu apuesta
          </p>
        )}
      </div>
    </div>
  );
}
