"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Profile } from '@/backend/core/domain/entities/Profile';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const createDefaultProfile = useCallback(async (userId: string, email: string, metadata: any = {}): Promise<Profile> => {
    const username = email?.split('@')[0] || 'usuario';
    const now = new Date().toISOString();
    
    const defaultProfile: Profile = {
      id: userId,
      username: username,
      email: email,
      full_name: metadata.full_name || null,
      avatar_url: metadata.avatar_url || null,
      phone: null,
      location: null,
      bio: null,
      website: null,
      created_at: now,
      updated_at: null,
      aciertos: 0,
      precision: 0,
      puntos: 0,
      racha: 0,
      total_apostados: 0,
      role: 'user',
      facebook_url: null,
      twitter_url: null,
      instagram_url: null,
      notifications_email: true,
      notifications_push: true,
      notifications_results: true,
      notifications_new_matches: true,
      notifications_ranking_updates: true,
    };
    
    // Intentar guardar el perfil por defecto
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([defaultProfile]);
      
    if (insertError) {
      console.error('Error al crear perfil por defecto:', insertError);
      throw new Error('No se pudo crear el perfil');
    }
    
    console.log('Perfil por defecto creado correctamente');
    return defaultProfile;
  }, [supabase]);
  
  const fetchProfile = useCallback(async (): Promise<Profile | null> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Obteniendo sesión actual...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error al obtener la sesión:', sessionError);
        throw new Error('Error al obtener la sesión');
      }
      
      if (!session?.user) {
        console.warn('No hay sesión activa');
        setProfile(null);
        return null;
      }
      
      const userId = session.user.id;
      console.log('ID de usuario:', userId);
      
      try {
        // 1. Intentar obtener el perfil existente
        console.log('Obteniendo perfil del usuario...');
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        // 2. Si el perfil existe, devolverlo
        if (profileData && !profileError) {
          console.log('Perfil cargado correctamente');
          const profile: Profile = {
            ...profileData,
            email: session.user.email || '',
            username: profileData.username || session.user.email?.split('@')[0] || 'usuario',
            full_name: profileData.full_name || session.user.user_metadata?.full_name || null,
            avatar_url: profileData.avatar_url || session.user.user_metadata?.avatar_url || null,
            aciertos: profileData.aciertos || 0,
            precision: profileData.precision || 0,
            puntos: profileData.puntos || 0,
            racha: profileData.racha || 0,
            total_apostados: profileData.total_apostados || 0,
            role: profileData.role || 'user',
          };
          
          setProfile(profile);
          return profile;
        }
        
        // 3. Si no existe, crear uno nuevo
        console.log('No se encontró el perfil, creando uno nuevo...');
        const newProfile = await createDefaultProfile(
          userId, 
          session.user.email || '', 
          session.user.user_metadata
        );
        
        setProfile(newProfile);
        return newProfile;
        
      } catch (error) {
        console.error('Error al obtener/crear el perfil:', error);
        
        // Si hay un error, intentar crear un perfil por defecto
        try {
          const newProfile = await createDefaultProfile(
            userId,
            session.user.email || '',
            session.user.user_metadata
          );
          
          setProfile(newProfile);
          return newProfile;
          
        } catch (createError) {
          console.error('Error al crear perfil por defecto:', createError);
          setError('No se pudo cargar ni crear el perfil');
          return null;
        }
      }
      
    } catch (error) {
      console.error('Error en fetchProfile:', error);
      setError('Error al cargar el perfil');
      return null;
    } finally {
      setLoading(false);
    }
  }, [createDefaultProfile, supabase]);

  // Efecto para cargar el perfil al montar el componente
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Función para actualizar el perfil
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
      
      if (data) {
        const updatedProfile: Profile = {
          ...data,
          email: session.user.email || '',
        };
        
        setProfile(updatedProfile);
        return updatedProfile;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el perfil';
      console.error('Error en updateProfile:', { error: err, errorMessage });
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    refresh: fetchProfile,
    updateProfile,
  };
}
