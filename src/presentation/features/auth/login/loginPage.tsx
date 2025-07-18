"use client";

import dynamic from "next/dynamic";
const AuthPage = dynamic(() => import("../AuthPage"), { ssr: false });

export default function LoginPage() {
  return <AuthPage initialView="login" />;
}
