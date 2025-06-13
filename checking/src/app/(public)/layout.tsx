import { LayoutProps } from "@/backend/types/next";

export default function ProtectedLayout({ children }: LayoutProps) {
  return <main>{children}</main>;
}
