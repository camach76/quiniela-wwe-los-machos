"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaShieldAlt, FaFutbol, FaUsers } from "react-icons/fa";
import { useProfile } from "@/presentation/hooks/useProfile";
import { MatchesManager } from "./components/MatchesManager";
import { UsersManager } from "./components/UsersManager";

type Tab = "partidos" | "usuarios";

export default function AdminView() {
  const { profile, loading } = useProfile();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("partidos");

  useEffect(() => {
    if (!loading && profile && profile.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [loading, profile, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!profile || profile.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100">
      <main className="w-full px-4 lg:px-6 py-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <FaShieldAlt className="text-purple-600 text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Panel de Administración</h1>
            <p className="text-sm text-gray-500">Gestioná partidos y usuarios</p>
          </div>
        </div>

        {/* Card principal */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/20">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("partidos")}
              className={`flex items-center gap-2 flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                activeTab === "partidos"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaFutbol className="text-xs" />
              Partidos
            </button>
            <button
              onClick={() => setActiveTab("usuarios")}
              className={`flex items-center gap-2 flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${
                activeTab === "usuarios"
                  ? "text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaUsers className="text-xs" />
              Usuarios
            </button>
          </div>

          {/* Contenido */}
          <div className="p-4 md:p-6">
            {activeTab === "partidos" && <MatchesManager />}
            {activeTab === "usuarios" && <UsersManager />}
          </div>
        </div>
      </main>
    </div>
  );
}
