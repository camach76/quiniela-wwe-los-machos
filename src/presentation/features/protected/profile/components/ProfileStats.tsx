interface StatsData {
  puntosTotales: number;
  posicionRanking: number;
  precision: number;
}

interface ProfileStatsProps {
  stats: StatsData;
}

export const ProfileStats = ({ stats }: ProfileStatsProps) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-blue-600">{stats.puntosTotales}</span>
        <span className="text-xs text-gray-500">Puntos</span>
      </div>
      <div className="h-10 border-r border-gray-200"></div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-green-600">#{stats.posicionRanking}</span>
        <span className="text-xs text-gray-500">Ranking</span>
      </div>
      <div className="h-10 border-r border-gray-200"></div>
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-purple-600">{stats.precision}%</span>
        <span className="text-xs text-gray-500">Precisión</span>
      </div>
    </div>
  );
};

export default ProfileStats;
