import { LayoutProps } from "@/backend/types/next";
import { Navbar } from "@/presentation/components/navbar/navbar";

export default function ProtectedLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar className="w-full" />
      <main className="flex-1 pt-16">
        {children}
      </main>
    </div>
  );
}
