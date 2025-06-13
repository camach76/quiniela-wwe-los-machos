import Image from "next/image";
import { FaUser, FaEdit, FaSave } from "react-icons/fa";

interface ProfileHeaderProps {
  modoEdicion: boolean;
  nombre: string;
  usuario: string;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileHeader = ({
  modoEdicion,
  nombre,
  usuario,
  onEditToggle,
  onSave,
  onCancel,
}: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaUser className="text-blue-500" /> Mi Perfil
        </h1>
        <p className="text-gray-600 mt-1">Gestiona tu información personal y preferencias</p>
      </div>

      <div>
        {modoEdicion ? (
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <FaSave />
              <span>Guardar Cambios</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onEditToggle}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaEdit />
            <span>Editar Perfil</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
