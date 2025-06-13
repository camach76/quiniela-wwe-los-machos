// Tipos para los datos del usuario
export interface UserData {
  nombre: string;
  usuario: string;
  email: string;
  telefono: string;
  ubicacion: string;
  biografia: string;
  sitioWeb: string;
  redes: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  notificaciones: {
    email: boolean;
    push: boolean;
    resultados: boolean;
    nuevosPartidos: boolean;
    actualizacionesRanking: boolean;
  };
}

// Tipos para estadísticas
export interface StatsData {
  puntosTotales: number;
  posicionRanking: number;
  partidosPronosticados: number;
  aciertos: number;
  precision: number;
  rachaActual: number;
  mejorRacha: number;
  competicionFavorita: string;
  equipoMasAcertado: string;
}

// Tipos para logros
export interface Achievement {
  id: number;
  nombre: string;
  descripcion: string;
  completado: boolean;
  fecha?: string;
  progreso?: number;
  total?: number;
  icono: string;
}

// Tipos para actividad
export interface ActivityItem {
  id: number;
  tipo: string;
  descripcion: string;
  fecha: string;
  resultado: string | null;
}

// Tipos para las propiedades de los componentes
export interface ProfileHeaderProps {
  modoEdicion: boolean;
  nombre: string;
  usuario: string;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export interface ProfileStatsProps {
  stats: StatsData;
}

export interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface ProfileEditFormProps {
  userData: UserData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface ActivityHistoryProps {
  activities: ActivityItem[];
}

export interface AchievementsListProps {
  achievements: Achievement[];
}
