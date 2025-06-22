'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useProfile } from '@/presentation/hooks/useProfile';

type UserWithPoints = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  puntos: number;
  aciertos: number;
  total_apostados: number;
  // Alias para compatibilidad
  points: number;
  correct_predictions: number;
  total_predictions: number;
};

export const useAdminUsers = () => {
  const [users, setUsers] = useState<UserWithPoints[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { profile, loading: profileLoading } = useProfile();
  const isAdmin = profile?.role === 'admin';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando fetchUsers...');
      const supabase = createClientComponentClient<Database>();

          // Si el perfil no está cargado, no hacer nada
      if (profileLoading) {
        console.log('Perfil aún cargando...');
        return;
      }
      
      // Si no hay perfil, limpiar usuarios
      if (!profile) {
        console.log('No hay perfil de usuario');
        setUsers([]);
        return;
      }
      
      console.log('Verificando permisos de administrador...');
      
      // Si el usuario no es administrador, no tiene permiso para ver todos los perfiles
      if (!isAdmin) {
        console.warn('Usuario no es administrador, mostrando solo su perfil');
        
        // Mostrar solo el perfil del usuario actual
        const userWithPoints = {
          id: profile.id,
          username: profile.username,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          puntos: profile.puntos || 0,
          aciertos: profile.aciertos || 0,
          total_apostados: profile.total_apostados || 0,
          points: profile.puntos || 0,
          correct_predictions: profile.aciertos || 0,
          total_predictions: profile.total_apostados || 0,
        };
        
        setUsers([userWithPoints]);
        return;
      }

      console.log('Obteniendo todos los perfiles (admin)...');
      
      // Si es administrador, obtener todos los perfiles
      const { data: profiles, error: profilesError, status, statusText } = await supabase
        .from('profiles')
        .select('*')
        .order('puntos', { ascending: false });

      console.log('Respuesta de Supabase (todos los perfiles):', { 
        profilesCount: profiles?.length,
        error: profilesError,
        status, 
        statusText 
      });

      if (profilesError) {
        console.error('Error al cargar perfiles:', profilesError);
        throw new Error(`Error al cargar los perfiles: ${profilesError.message || 'Error desconocido'}`);
      }


      if (!profiles || profiles.length === 0) {
        console.warn('No se recibieron perfiles del servidor');
        setUsers([]);
        return;
      }
      
      console.log(`Se recibieron ${profiles.length} perfiles`);

      console.log(`Se recibieron ${profiles.length} perfiles`);
      
      // Mapeamos los resultados al tipo esperado
      const mappedProfiles = profiles.map(profile => {
        // Usar valores por defecto para campos que podrían faltar
        const puntos = typeof profile.puntos === 'number' ? profile.puntos : 0;
        const aciertos = typeof profile.aciertos === 'number' ? profile.aciertos : 0;
        const totalApostados = typeof profile.total_apostados === 'number' ? profile.total_apostados : 0;
        const fullName = profile.full_name || profile.username || 'Usuario';
        const avatarUrl = profile.avatar_url || '';
        
        return {
          id: profile.id,
          username: profile.username || `user_${profile.id.substring(0, 6)}`,
          full_name: fullName,
          avatar_url: avatarUrl,
          // Usar los valores numéricos con valores por defecto
          puntos,
          aciertos,
          total_apostados: totalApostados,
          // Alias para compatibilidad
          points: puntos,
          correct_predictions: aciertos,
          total_predictions: totalApostados
        };
      });
      
      setUsers(mappedProfiles);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los usuarios';
      console.error('Error en fetchUsers:', errorMessage, err);
      setError(new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  // Calcular puntajes (esto podría moverse a una función de utilidad o servicio)
  const calculateScores = async () => {
    try {
      setLoading(true);
      
      // Aquí iría la lógica para calcular los puntajes de los usuarios
      // basado en las predicciones y los resultados reales de los partidos
      
      // Por ahora, solo actualizamos la lista de usuarios
      await fetchUsers();
    } catch (err) {
      console.error('Error calculating scores:', err);
      setError(err instanceof Error ? err : new Error('Error al calcular los puntajes'));
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los usuarios cuando el perfil esté listo
  useEffect(() => {
    // Solo intentar cargar usuarios si el perfil ya está cargado
    if (!profileLoading && profile) {
      console.log('Perfil cargado, obteniendo usuarios...');
      fetchUsers();
    } else if (!profileLoading && !profile) {
      console.log('No hay perfil de usuario, limpiando lista de usuarios');
      setUsers([]);
      setLoading(false);
    }
  }, [profile, profileLoading]);

  return {
    users,
    loading,
    error,
    refreshUsers: fetchUsers,
    calculateScores
  };
};
