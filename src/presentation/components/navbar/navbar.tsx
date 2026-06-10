"use client";

import Link from "next/link";
import Image from "next/image";
import { useProfile } from "@/presentation/hooks/useProfile";
import { FaSignOutAlt, FaShieldAlt } from "react-icons/fa";
import { useLogout } from "@/presentation/features/auth/logout/hooks/useLogout";

interface NavbarProps {
  appName?: string;
  logoUrl?: string;
  className?: string;
}

export const Navbar = ({
  appName = "Quiniela Consult-Us",
  logoUrl = "/images/logo.png",
  className = "",
}: NavbarProps) => {
  const { profile } = useProfile();
  const { mutate: logout } = useLogout();

  return (
    <nav className={`bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10 flex items-center justify-between px-4 lg:px-6 py-3 ${className}`}>
      {/* Logo */}
      <div className="flex items-center">
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
        {profile?.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-medium transition-colors"
            title="Panel de administración"
          >
            <FaShieldAlt className="text-xs" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        )}

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