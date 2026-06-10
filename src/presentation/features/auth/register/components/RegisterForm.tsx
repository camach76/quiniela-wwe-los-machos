"use client";

import type React from "react";

import { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { FaBuilding, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const COMPANY_OPTIONS = ["Consult-Us", "Lignum", "IGST", "Zigi"] as const;

function stripAccents(str: string): string {
  return str.normalize("NFD").replace(/\p{Mn}/gu, "");
}

function toEmailLocalPart(name: string): string {
  return stripAccents(name)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9.]/g, "");
}

function toEmailDomain(company: string): string {
  return stripAccents(company)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function generateEmail(name: string, company: string): string {
  const local = toEmailLocalPart(name);
  const domain = toEmailDomain(company);
  if (!local || !domain) return "";
  return `${local}@${domain}.com`;
}

export default function RegisterForm() {
  const { mutate, isPending, error } = useRegister();
  const [company, setCompany] =
    useState<(typeof COMPANY_OPTIONS)[number]>("Consult-Us");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const email = generateEmail(name, company);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ company, name, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Card con efecto de glassmorphism */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
          {/* Branding */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative w-20 h-20 mb-3">
              <Image
                src="/images/logo.png"
                alt="Quiniela Consult-Us"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Registro Quiniela Consult-Us
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Crea tu cuenta para participar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700 mb-1 ml-1"
                >
                  Empresa
                </label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <FaBuilding />
                  </span>
                  <select
                    id="company"
                    value={company}
                    onChange={(e) =>
                      setCompany(e.target.value as (typeof COMPANY_OPTIONS)[number])
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all bg-white/50 backdrop-blur-sm appearance-none"
                    required
                  >
                    {COMPANY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1 ml-1"
                >
                  Nombre
                </label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <FaUser />
                  </span>
                  <input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1 ml-1"
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaEnvelope />
                  </span>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    readOnly
                    placeholder="Se genera automáticamente"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-default select-all"
                  />
                </div>
                {email && (
                  <p className="text-xs text-gray-400 mt-1 ml-1">
                    Este será tu correo para iniciar sesión
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1 ml-1"
                >
                  Contraseña
                </label>
                <div className="relative group">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <FaLock />
                  </span>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {error instanceof Error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-medium py-3 px-4 rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isPending ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : null}
              {isPending ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
