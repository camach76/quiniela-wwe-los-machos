import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, TrophyIcon, UsersIcon, ChartBarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navigation: NavItem[] = [
  { name: 'Inicio', href: '/admin', icon: HomeIcon },
  { name: 'Partidos', href: '/admin/matches', icon: TrophyIcon },
  { name: 'Usuarios', href: '/admin/users', icon: UsersIcon },
  { name: 'Estadísticas', href: '/admin/stats', icon: ChartBarIcon },
  { name: 'Configuración', href: '/admin/settings', icon: Cog6ToothIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="flex h-16 flex-shrink-0 items-center px-4 md:hidden">
        <h1 className="text-xl font-bold text-gray-900">Admin Quiniela</h1>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex-1 space-y-1 bg-white px-2 pb-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-6 w-6 flex-shrink-0 ${
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
        <div className="group block w-full flex-shrink-0">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src="/images/avatar-placeholder.png"
                alt="Avatar"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Admin
              </p>
              <Link 
                href="/admin/profile" 
                className="text-xs font-medium text-gray-500 hover:text-gray-700"
              >
                Ver perfil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
