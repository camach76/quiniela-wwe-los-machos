"use client";

import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Iniciar Sesión
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Ingresa tus credenciales para continuar
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
