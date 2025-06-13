"use client";

import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Link from "next/link";

export default function LoginForm() {
  const { mutate, isPending } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 py-12 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          {/* Aquí puedes poner el logo */}
          <img src="/logo-mundial.png" alt="Mundial de Clubes" className="w-16 h-16 mb-2" />
          <h2 className="text-2xl font-bold text-blue-700 mb-1">Quinela Mundial de Clubes</h2>
          <p className="text-gray-500 text-sm">Inicia sesión para participar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaEnvelope />
              </span>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FaLock />
              </span>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                required
              />
            </div>
          </div>

          {/* Aquí podrías mostrar errores si los tienes, por ejemplo: */}
          {/* <p className="text-red-500 text-sm">Error al iniciar sesión</p> */}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold py-2 rounded-md hover:scale-[1.03] hover:shadow-lg transition-all duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            )}
            Iniciar Sesión
          </button>
        </form>

        <div className="flex justify-between items-center mt-6 text-sm">
          <Link href="/register" className="text-blue-600 hover:underline">¿No tienes cuenta? Regístrate</Link>
          <Link href="/forgot" className="text-gray-500 hover:underline">¿Olvidaste tu contraseña?</Link>
        </div>
      </div>
    </div>

  );
}
