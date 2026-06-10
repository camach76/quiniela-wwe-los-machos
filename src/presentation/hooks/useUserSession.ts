"use client";

import { useEffect, useState } from "react";
import {
  clearSupabaseSession,
  isInvalidRefreshTokenError,
  supabase,
} from '@/presentation/utils/supabase/client'

export function useUserSession() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        if (isInvalidRefreshTokenError(error)) {
          await clearSupabaseSession();
          setUser(null);
          return;
        }

        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase.auth]);

  return { user, loading };
}
