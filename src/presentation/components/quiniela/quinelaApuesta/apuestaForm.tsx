"use client";

import React, { useState } from "react";

interface ApuestaFormProps {
  match: {
    id: string;
    fecha: string;
    club_a: { nombre: string; logo: string };
    club_b: { nombre: string; logo: string };
  };
  bet?: {
    prediccion_a: number;
    prediccion_b: number;
  } | null;
  onSubmit: (a: number, b: number) => void;
}

export const ApuestaForm: React.FC<ApuestaFormProps> = ({
  match,
  bet,
  onSubmit,
}) => {
  const [a, setA] = useState<string>(
    bet?.prediccion_a !== undefined && bet?.prediccion_a !== null
      ? bet.prediccion_a.toString()
      : "",
  );

  const [b, setB] = useState<string>(
    bet?.prediccion_b !== undefined && bet?.prediccion_b !== null
      ? bet.prediccion_b.toString()
      : "",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!a || !b) return alert("Debes ingresar ambos marcadores");
    onSubmit(parseInt(a), parseInt(b));
  };

  return (
    <div className="bg-white shadow p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        {match.club_a.nombre} vs {match.club_b.nombre}
      </h2>
      <p className="text-sm text-gray-500 mb-2">
        {new Date(match.fecha).toLocaleString("es-ES", {
          weekday: "long",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium">Local</label>
            <input
              type="number"
              min="0"
              className="w-full border p-2 rounded"
              value={a}
              onChange={(e) => setA(e.target.value)}
              disabled={!!bet}
            />
          </div>
          <div className="text-xl font-bold">-</div>
          <div className="flex-1">
            <label className="block text-sm font-medium">Visitante</label>
            <input
              type="number"
              min="0"
              className="w-full border p-2 rounded"
              value={b}
              onChange={(e) => setB(e.target.value)}
              disabled={!!bet}
            />
          </div>
        </div>
        {!bet && (
          <div className="text-right">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar Apuesta
            </button>
          </div>
        )}
        {bet && (
          <p className="text-green-600 text-sm text-center font-medium">
            Ya apostaste este partido
          </p>
        )}
      </form>
    </div>
  );
};
