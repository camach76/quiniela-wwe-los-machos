"use client";

import { useState } from "react";
import LoginForm from "./login/components/LoginForm";
import RegisterForm from "./register/components/RegisterForm";
import Image from "next/image";

export default function AuthPage({ initialView = "login" }: { initialView?: "login" | "register" }) {
  const [view, setView] = useState<"login" | "register">((initialView || "login"));

  // Animación: si cambia el view, los paneles se deslizan/intercambian
  // Usamos transición CSS para suavidad

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 px-4">
      <div className="relative w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Imagen lateral */}
        <div
          className={`flex-1 flex items-center justify-center py-12 px-6 transition-all duration-700 ${view === "login" ? "order-1 md:order-none" : "order-2 md:order-none"}`}
          style={{ minWidth: 280, background: "linear-gradient(135deg, #1e40af 60%, #22d3ee 100%)" }}
        >
          <Image
            src="/images/logo.png"
            alt="Logo Mundial de Clubes"
            width={220}
            height={220}
            className="rounded-xl drop-shadow-xl animate-fade-in"
            priority
          />
        </div>
        {/* Panel de formulario */}
        <div
          className={`flex-1 flex items-center justify-center py-12 px-6 transition-all duration-700 bg-white ${view === "login" ? "order-2 md:order-none" : "order-1 md:order-none"}`}
        >
          <div className="w-full max-w-md">
            {view === "login" ? (
              <>
                <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">Iniciar Sesión</h2>
                <p className="text-center text-gray-500 mb-6">Ingresa tus credenciales para continuar</p>
                <LoginForm />
                <p className="text-center text-gray-600 mt-6">
                  ¿No tienes cuenta?{' '}
                  <button
                    className="text-blue-600 hover:underline font-medium transition"
                    onClick={() => setView("register")}
                  >
                    Crear una cuenta
                  </button>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">Crear Cuenta</h2>
                <p className="text-center text-gray-500 mb-6">Regístrate para participar en la quinela</p>
                <RegisterForm />
                <p className="text-center text-gray-600 mt-6">
                  ¿Ya tienes cuenta?{' '}
                  <button
                    className="text-blue-600 hover:underline font-medium transition"
                    onClick={() => setView("login")}
                  >
                    Iniciar sesión
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 1.2s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
