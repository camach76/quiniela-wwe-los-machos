import { FaCheck, FaLock } from "react-icons/fa";

interface Achievement {
  id: number;
  nombre: string;
  descripcion: string;
  completado: boolean;
  fecha?: string;
  progreso?: number;
  total?: number;
  icono: string;
}

interface AchievementsListProps {
  achievements: Achievement[];
}

export const AchievementsList = ({ achievements }: AchievementsListProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Tus Logros</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((logro) => (
          <div
            key={logro.id}
            className={`relative rounded-lg border p-4 shadow-sm transition-all ${
              logro.completado
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <span className="text-2xl">{logro.icono}</span>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="text-sm font-medium text-gray-900">{logro.nombre}</h4>
                <p className="mt-1 text-sm text-gray-500">{logro.descripcion}</p>
                
                {logro.progreso !== undefined && logro.total !== undefined && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Progreso</span>
                      <span>{logro.progreso}/{logro.total}</span>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(logro.progreso / logro.total) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {logro.completado && logro.fecha && (
                  <div className="mt-2 flex items-center text-xs text-green-600">
                    <FaCheck className="mr-1" />
                    <span>Completado el {logro.fecha}</span>
                  </div>
                )}
                
                {!logro.completado && (
                  <div className="absolute right-2 top-2 text-gray-400">
                    <FaLock size={14} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsList;
