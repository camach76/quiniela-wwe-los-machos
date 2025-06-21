"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import supabase from "@/presentation/utils/supabase/client";

function AuthPopupContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Cargando...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        setStatus("Iniciando autenticación...");

        const authId = searchParams.get("authId");
        const redirectTo =
          searchParams.get("redirectTo") ||
          `${window.location.origin}/dashboard`;

        console.log("=== POPUP DE AUTENTICACIÓN ===");
        console.log("Auth ID:", authId);
        console.log("Redirect To:", redirectTo);

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Evento de autenticación:", event);

          if (event === "SIGNED_IN" && session) {
            console.log("Sesión iniciada en el popup:", session);
            setStatus("¡Inicio de sesión exitoso! Cerrando...");

            // Enviar mensaje a la ventana principal
            window.opener.postMessage(
              {
                event: "SIGNED_IN",
                session: {
                  access_token: session.access_token,
                  refresh_token: session.refresh_token,
                  user: {
                    id: session.user?.id,
                    email: session.user?.email,
                  },
                },
              },
              window.location.origin,
            );

            // Cerrar el popup después de un breve retraso
            setTimeout(() => window.close(), 1000);
          } else if (event === "SIGNED_OUT") {
            console.log("Sesión cerrada");
            setError("No se pudo iniciar sesión. Intenta de nuevo.");
          }
        });

        // Iniciar el flujo de autenticación con Google
        setStatus("Conectando con Google...");

        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: redirectTo,
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
            // @ts-expect-error - La propiedad flowType no está en los tipos pero es necesaria
            flowType: "implicit",
          },
        });

        if (error) {
          console.error("Error en signInWithOAuth:", error);
          setError(`Error al iniciar sesión: ${error.message}`);

          // Enviar mensaje de error a la ventana principal
          window.opener.postMessage(
            {
              event: "AUTH_ERROR",
              error: error.message,
            },
            window.location.origin,
          );

          // Cerrar el popup después de un breve retraso
          setTimeout(() => window.close(), 3000);
        }

        // Limpiar la suscripción cuando el componente se desmonte
        return () => {
          if (subscription) {
            subscription.unsubscribe();
          }
        };
      } catch (err) {
        console.error("Error en el popup de autenticación:", err);
        setError(
          `Error inesperado: ${err instanceof Error ? err.message : String(err)}`,
        );

        // Enviar mensaje de error a la ventana principal
        window.opener.postMessage(
          {
            event: "AUTH_ERROR",
            error: "Error inesperado al iniciar sesión",
          },
          window.location.origin,
        );

        // Cerrar el popup después de un breve retraso
        setTimeout(() => window.close(), 3000);
      }
    };

    handleAuth();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Iniciando sesión
          </h1>
          <p className="text-gray-600">
            Estamos conectándote con tu cuenta de Google
          </p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>

          <div className="mt-4">
            <p className="text-gray-700 font-medium">{status}</p>
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          </div>

          <button
            onClick={() => window.close()}
            className="mt-6 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente principal que envuelve el contenido en un Suspense boundary
export default function AuthPopup() {
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
      <AuthPopupContent />
    </Suspense>
  );
}
