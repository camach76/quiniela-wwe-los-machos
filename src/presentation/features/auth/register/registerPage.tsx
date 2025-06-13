"use client";

import dynamic from "next/dynamic";
const AuthPage = dynamic(() => import("../AuthPage"), { ssr: false });

export default function RegisterPage() {
  return <AuthPage initialView="register" />;
}
