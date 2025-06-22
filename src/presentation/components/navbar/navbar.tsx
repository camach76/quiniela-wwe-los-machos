"use client";

import Link from "next/link";
import Image from "next/image";
import { useUserSession } from "@/presentation/hooks/useUserSession";
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import { useLogout } from "@/presentation/features/auth/logout/hooks/useLogout";
import { useState } from "react";

interface NavbarProps {
  appName?: string;
  logoUrl?: string;
  showNotifications?: boolean;
  className?: string;
}

export const Navbar = ({
  appName = "Quiniela Los Machos",
  logoUrl = "/images/logo.png",
  showNotifications = true, // Este prop se mantiene por compatibilidad
  className = "",
}: NavbarProps) => {
  const { user } = useUserSession();
  const { mutate: logout } = useLogout();
  const [userName, setUserName] = useState("Usuario");

  // Obtener el nombre de usuario del email si está disponible
  if (user?.email && userName === "Usuario") {
    setUserName(user.email.split('@')[0]);
  }
  
  // Deshabilitar notificaciones temporalmente
  const shouldShowNotifications = false;

  return (
    <nav className={`bg-white/80 backdrop-blur-md shadow-sm sticky top-0 left-0 right-0 z-50 flex items-center justify-between px-4 lg:px-6 py-3 w-full ${className}`}>
      {/* Menú móvil - Botón de hamburguesa */}
      <div className="md:hidden">
        <button className="p-1 text-gray-600 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      {/* Logo */}
      <div className="flex items-center flex-1 md:flex-none justify-center md:justify-start">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="relative w-8 h-8 md:w-10 md:h-10">
            <Image 
              src={logoUrl} 
              alt="Logo" 
              fill 
              className="object-contain rounded-full" 
              priority
            />
          </div>
        </Link>
      </div>

      {/* Título de la aplicación - Solo visible en móviles */}
      <div className="md:hidden">
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          {appName.split(' ')[0]}
        </h1>
      </div>

      {/* Título de la aplicación - Visible en pantallas medianas y grandes */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          {appName}
        </h1>
      </div>

      {/* Controles de usuario */}
      <div className="flex items-center gap-3 md:gap-4">
        {shouldShowNotifications && (
          <button 
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Notificaciones"
          >
            <FaBell className="text-lg md:text-xl" />
          </button>
        )}
        
        {shouldShowNotifications && <div className="h-6 w-px bg-gray-200"></div>}
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm md:text-base">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:inline text-sm font-medium text-gray-700">
            {userName}
          </span>
        </div>
        
        <button 
          onClick={() => logout()}
          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
        >
          <FaSignOutAlt className="text-lg md:text-xl" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;