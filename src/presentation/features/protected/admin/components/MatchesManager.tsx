"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { FaPlus, FaEdit, FaTrash, FaTrophy, FaCheckCircle, FaClock } from "react-icons/fa";
import { adminService, MatchAdmin, ClubOption } from "../services/adminService";
import { toast } from "react-hot-toast";

const GRUPOS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

type MatchFormData = {
  club_a_id: string;
  club_b_id: string;
  fecha: string;
  estadio: string;
  grupo: string;
};

type ResultFormData = {
  resultado_a: string;
  resultado_b: string;
};

const emptyMatchForm: MatchFormData = {
  club_a_id: "",
  club_b_id: "",
  fecha: "",
  estadio: "",
  grupo: "",
};

export function MatchesManager() {
  const [matches, setMatches] = useState<MatchAdmin[]>([]);
  const [clubs, setClubs] = useState<ClubOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<MatchAdmin | null>(null);
  const [targetMatch, setTargetMatch] = useState<MatchAdmin | null>(null);

  const [matchForm, setMatchForm] = useState<MatchFormData>(emptyMatchForm);
  const [resultForm, setResultForm] = useState<ResultFormData>({ resultado_a: "", resultado_b: "" });

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [m, c] = await Promise.all([adminService.getMatches(), adminService.getClubs()]);
      setMatches(m);
      setClubs(c);
    } catch {
      toast.error("Error cargando datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditingMatch(null);
    setMatchForm(emptyMatchForm);
    setShowMatchModal(true);
  };

  const openEdit = (match: MatchAdmin) => {
    setEditingMatch(match);
    setMatchForm({
      club_a_id: String(match.club_a_id),
      club_b_id: String(match.club_b_id),
      fecha: match.fecha.slice(0, 16),
      estadio: match.estadio,
      grupo: match.grupo ?? "",
    });
    setShowMatchModal(true);
  };

  const openResult = (match: MatchAdmin) => {
    setTargetMatch(match);
    setResultForm({
      resultado_a: match.resultado_a !== null ? String(match.resultado_a) : "",
      resultado_b: match.resultado_b !== null ? String(match.resultado_b) : "",
    });
    setShowResultModal(true);
  };

  const handleSaveMatch = async () => {
    if (!matchForm.club_a_id || !matchForm.club_b_id || !matchForm.fecha || !matchForm.estadio || !matchForm.grupo) {
      toast.error("Completá todos los campos");
      return;
    }
    if (matchForm.club_a_id === matchForm.club_b_id) {
      toast.error("Los dos equipos no pueden ser el mismo");
      return;
    }
    try {
      setSaving(true);
      const input = {
        club_a_id: Number(matchForm.club_a_id),
        club_b_id: Number(matchForm.club_b_id),
        fecha: new Date(matchForm.fecha).toISOString(),
        estadio: matchForm.estadio.trim(),
        grupo: matchForm.grupo.toUpperCase(),
      };
      if (editingMatch) {
        await adminService.updateMatch(editingMatch.id, input);
        toast.success("Partido actualizado");
      } else {
        await adminService.createMatch(input);
        toast.success("Partido creado");
      }
      setShowMatchModal(false);
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error guardando partido");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveResult = async () => {
    if (resultForm.resultado_a === "" || resultForm.resultado_b === "") {
      toast.error("Ingresá ambos resultados");
      return;
    }
    if (!targetMatch) return;
    try {
      setSaving(true);
      await adminService.setResult(
        targetMatch.id,
        Number(resultForm.resultado_a),
        Number(resultForm.resultado_b)
      );
      toast.success("Resultado guardado y puntos calculados");
      setShowResultModal(false);
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error guardando resultado");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setSaving(true);
      await adminService.deleteMatch(id);
      toast.success("Partido eliminado");
      setDeleteConfirm(null);
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error eliminando partido");
    } finally {
      setSaving(false);
    }
  };

  const isComplete = (m: MatchAdmin) => m.resultado_a !== null && m.resultado_b !== null;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{matches.length} partidos en total</p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <FaPlus /> Nuevo Partido
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Grupo</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Partido</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Estadio</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {matches.map((match) => (
              <tr key={match.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  {match.grupo && (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                      {match.grupo}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {format(new Date(match.fecha), "dd/MM/yy HH:mm")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <span className="text-xs text-gray-500 hidden sm:inline">{match.club_a?.nombre}</span>
                    <span className="hidden sm:inline">vs</span>
                    <span className="text-xs text-gray-500 hidden sm:inline">{match.club_b?.nombre}</span>
                    <span className="sm:hidden text-xs">{match.club_a?.nombre} vs {match.club_b?.nombre}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{match.estadio}</td>
                <td className="px-4 py-3 text-center">
                  {isComplete(match) ? (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      <FaCheckCircle className="text-xs" />
                      {match.resultado_a} - {match.resultado_b}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                      <FaClock className="text-xs" />
                      Pendiente
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openResult(match)}
                      title={isComplete(match) ? "Recalcular resultado" : "Ingresar resultado"}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <FaTrophy />
                    </button>
                    <button
                      onClick={() => openEdit(match)}
                      title="Editar partido"
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FaEdit />
                    </button>
                    {deleteConfirm === match.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(match.id)}
                          disabled={saving}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(match.id)}
                        title="Eliminar partido"
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {matches.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No hay partidos cargados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Crear / Editar Partido */}
      {showMatchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingMatch ? "Editar Partido" : "Nuevo Partido"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipo A (local)</label>
                <select
                  value={matchForm.club_a_id}
                  onChange={(e) => setMatchForm((p) => ({ ...p, club_a_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar equipo...</option>
                  {clubs.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre} ({c.pais})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipo B (visitante)</label>
                <select
                  value={matchForm.club_b_id}
                  onChange={(e) => setMatchForm((p) => ({ ...p, club_b_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar equipo...</option>
                  {clubs.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre} ({c.pais})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora</label>
                <input
                  type="datetime-local"
                  value={matchForm.fecha}
                  onChange={(e) => setMatchForm((p) => ({ ...p, fecha: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estadio</label>
                <input
                  type="text"
                  placeholder="Nombre del estadio"
                  value={matchForm.estadio}
                  onChange={(e) => setMatchForm((p) => ({ ...p, estadio: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
                <select
                  value={matchForm.grupo}
                  onChange={(e) => setMatchForm((p) => ({ ...p, grupo: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar grupo...</option>
                  {GRUPOS.map((g) => (
                    <option key={g} value={g}>Grupo {g}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowMatchModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveMatch}
                disabled={saving}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Ingresar / Recalcular Resultado */}
      {showResultModal && targetMatch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {isComplete(targetMatch) ? "Recalcular Resultado" : "Ingresar Resultado"}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {targetMatch.club_a?.nombre} vs {targetMatch.club_b?.nombre}
            </p>
            {isComplete(targetMatch) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs text-yellow-700 mb-4">
                Este partido ya tiene resultado. Si cambiás los valores, los puntos de todos los usuarios serán recalculados.
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1 text-center">
                  {targetMatch.club_a?.nombre}
                </label>
                <input
                  type="number"
                  min={0}
                  value={resultForm.resultado_a}
                  onChange={(e) => setResultForm((p) => ({ ...p, resultado_a: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="text-gray-400 font-bold text-xl pt-5">—</span>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1 text-center">
                  {targetMatch.club_b?.nombre}
                </label>
                <input
                  type="number"
                  min={0}
                  value={resultForm.resultado_b}
                  onChange={(e) => setResultForm((p) => ({ ...p, resultado_b: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Puntaje: resultado exacto = 3pts · ganador/empate correcto = 1pt · incorrecto = 0pts
            </p>
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowResultModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveResult}
                disabled={saving}
                className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
              >
                {saving ? "Calculando..." : "Guardar y Calcular"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
