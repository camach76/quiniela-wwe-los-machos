import { LayoutProps } from "@/backend/types/next";
import { Navbar } from "@/presentation/components/navbar/navbar";

export default function ProtectedLayout({ children }: LayoutProps) {
  return <main>
    <Navbar/>
    {children}</main>;
}
