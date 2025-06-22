import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  headerAction?: ReactNode;
  className?: string;
}

export const AdminLayout = ({
  children,
  title = 'Panel de Administración',
  headerAction,
  className = '',
}: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      </header>

      <main className={`max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ${className}`}>
        {children}
      </main>
    </div>
  );
};
