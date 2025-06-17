"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/presentation/utils/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const next = searchParams.get("next") || "/dashboard";

    if (!code) {
      router.replace("/login");
      return;
    }

    const handleAuth = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Failed to exchange session:", error);
        router.replace("/login");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          username: user.user_metadata?.full_name || user.email.split("@")[0],
          role: "user",
          puntos: 0,
          aciertos: 0,
          total_apostados: 0,
          precision: 0,
          racha: 0,
          created_at: new Date().toISOString(),
        });
      }

      router.replace(next);
    };

    handleAuth();
  }, [router, searchParams]);

  return <p className="text-center mt-10 text-gray-600">Iniciando sesión...</p>;
}
