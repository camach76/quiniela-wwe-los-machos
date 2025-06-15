"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Profile } from '@/backend/core/domain/entities/Profile';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener la sesión actual
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('No hay sesión activa');
      }
      
      // Obtener el perfil del usuario
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        throw profileError;
      }
      
      // Mapear los datos al formato esperado
      const profileData: Profile = {
        id: data.id,
        username: data.username,
        email: session.user.email || '',
        full_name: data.full_name || null,
        avatar_url: data.avatar_url || null,
        phone: data.phone || null,
        location: data.location || null,
        bio: data.bio || null,
        website: data.website || null,
        created_at: data.created_at,
        updated_at: data.updated_at || null,
        aciertos: data.aciertos || 0,
        precision: data.precision || 0,
        puntos: data.puntos || 0,
        racha: data.racha || 0,
        total_apostados: data.total_apostados || 0,
        role: data.role || 'user',
        facebook_url: data.facebook_url || null,
        twitter_url: data.twitter_url || null,
        instagram_url: data.instagram_url || null,
        notifications_email: data.notifications_email ?? true,
        notifications_push: data.notifications_push ?? true,
        notifications_results: data.notifications_results ?? true,
        notifications_new_matches: data.notifications_new_matches ?? true,
        notifications_ranking_updates: data.notifications_ranking_updates ?? true,
      };
      
      setProfile(profileData);
      return profileData;
    } catch (err) {
      console.error('Error al cargar el perfil:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar el perfil');
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('No hay sesión activa');
      }
      
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id)
        .select()
        .single();
      
      if (updateError) {
        throw updateError;
      }
      
      // Actualizar el estado local con los nuevos datos
      setProfile(prev => ({
        ...prev!,
        ...data,
        email: session.user.email || prev?.email || '',
      }));
      
      return data;
    } catch (err) {
      console.error('Error al actualizar el perfil:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al actualizar el perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar el perfil al montar el componente
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refresh: fetchProfile,
    updateProfile,
  };
}
