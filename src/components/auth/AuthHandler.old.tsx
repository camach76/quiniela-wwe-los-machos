"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/presentation/utils/supabase/client";

export default function AuthHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateProfile = async (user: any) => {
      if (!user) return;

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        username:
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Usuario",
        role: "user",
        created_at: new Date().toISOString(),
        puntos: 0,
        aciertos: 0,
        total_apostados: 0,
        precision: 0,
        racha: 0,
      });

      if (error) {
        console.error("Error updating profile:", error);
      } else {
        console.log("Profile updated successfully");
      }
    };

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await updateProfile(session.user);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await updateProfile(session.user);
        if (pathname === "/login" || pathname === "/auth/callback") {
          router.push("/dashboard");
          router.refresh();
        }
      } else if (event === "SIGNED_OUT") {
        router.push("/login");
        router.refresh();
      }
    });

    checkSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, pathname]);

  return null;
}
