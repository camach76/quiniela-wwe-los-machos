import { Dispatch, SetStateAction } from "react";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export const ProfileTabs = ({ activeTab, setActiveTab }: ProfileTabsProps) => {
  const tabs = [
    { id: "general", label: "Información General" },
    { id: "estadisticas", label: "Estadísticas" },
    { id: "logros", label: "Logros" },
    { id: "actividad", label: "Actividad Reciente" },
    { id: "configuracion", label: "Configuración" },
  ];

  return (
    <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;
