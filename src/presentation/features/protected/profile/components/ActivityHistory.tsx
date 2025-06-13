import { FaChartLine, FaTrophy, FaMedal, FaHistory } from "react-icons/fa";

interface ActivityItem {
  id: number;
  tipo: string;
  descripcion: string;
  fecha: string;
  resultado: string | null;
}

interface ActivityHistoryProps {
  activities: ActivityItem[];
}

const renderIcon = (tipo: string) => {
  switch (tipo) {
    case "pronostico":
      return <FaChartLine className="text-blue-500" />;
    case "ranking":
      return <FaTrophy className="text-yellow-500" />;
    case "logro":
      return <FaMedal className="text-purple-500" />;
    default:
      return <FaHistory className="text-gray-500" />;
  }
};

export const ActivityHistory = ({ activities }: ActivityHistoryProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, activityIdx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {activityIdx !== activities.length - 1 ? (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
                      {renderIcon(activity.tipo)}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-800">
                        {activity.descripcion}
                        {activity.resultado && (
                          <span className="ml-2 text-sm text-gray-500">{activity.resultado}</span>
                        )}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={activity.fecha}>
                        {new Date(activity.fecha).toLocaleDateString()}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ActivityHistory;
