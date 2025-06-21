"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import supabase from "@/presentation/utils/supabase/client";

function AuthCallbackContent() {
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
        // Asegurarnos de que el email no sea undefined
        if (!user.email) {
          console.error("El usuario no tiene un email asociado");
          return router.push("/auth/error?error=no_email");
        }

        await supabase.from("profiles").upsert({
          id: user.id,
          email: user.email,
          username:
            user.user_metadata?.full_name ||
            user.email.split("@")[0] ||
            `user_${user.id.substring(0, 8)}`,
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

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="p-8 bg-white rounded-lg shadow-md text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              Cargando autenticación...
            </h2>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
