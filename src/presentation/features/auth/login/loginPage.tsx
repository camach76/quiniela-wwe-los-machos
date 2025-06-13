"use client";

import LoginForm from "./components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Iniciar Sesión
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Ingresa tus credenciales para continuar
        </p>

        <LoginForm />

        <p className="text-center text-gray-600 mt-6">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Crear una cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
