"use client";

import { useState, useEffect, useCallback } from "react";
import { FaShieldAlt, FaUser } from "react-icons/fa";
import { adminService, AdminProfile } from "../services/adminService";
import { toast } from "react-hot-toast";

export function UsersManager() {
  const [users, setUsers] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch {
      toast.error("Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleRole = async (user: AdminProfile) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      setUpdatingId(user.id);
      await adminService.updateUserRole(user.id, newRole);
      toast.success(`${user.username} ahora es ${newRole === "admin" ? "administrador" : "usuario"}`);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      );
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error actualizando rol");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{users.length} usuarios registrados</p>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Usuario</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Puntos</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Aciertos</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Precisión</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Apuestas</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Rol</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-800">{user.username}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-semibold text-blue-600">
                  {user.puntos ?? 0}
                </td>
                <td className="px-4 py-3 text-center text-gray-600 hidden sm:table-cell">
                  {user.aciertos ?? 0}
                </td>
                <td className="px-4 py-3 text-center text-gray-600 hidden md:table-cell">
                  {user.precision !== null ? `${Number(user.precision).toFixed(1)}%` : "—"}
                </td>
                <td className="px-4 py-3 text-center text-gray-600 hidden md:table-cell">
                  {user.total_apostados ?? 0}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleRole(user)}
                    disabled={updatingId === user.id}
                    title={user.role === "admin" ? "Quitar admin" : "Hacer admin"}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {user.role === "admin" ? (
                      <>
                        <FaShieldAlt className="text-xs" /> Admin
                      </>
                    ) : (
                      <>
                        <FaUser className="text-xs" /> Usuario
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
