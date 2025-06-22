'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserGroupIcon, ChartBarIcon, HomeIcon } from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  className?: string;
  headerAction?: ReactNode;
}

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navigation: NavItem[] = [
  { name: 'Inicio', href: '/admin', icon: HomeIcon },
  { name: 'Usuarios', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Estadísticas', href: '/admin/stats', icon: ChartBarIcon },
];

export const AdminLayout = ({
  children,
  title = 'Panel de Administración',
  className = '',
  headerAction,
}: AdminLayoutProps) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra de navegación superior */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-gray-900">Admin Quiniela</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                        isActive
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {headerAction}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main>
        <div className={`mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${className}`}>
          {children}
        </div>
      </main>
    </div>
  );
};
