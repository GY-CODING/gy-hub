import { GravityStarsBackground } from "@/components/animate-ui/components/backgrounds/gravity-stars";
import "./globals.css";

export const metadata = {
  title: "Gestor IA — D&D · MTG",
  description: "Dashboard con Gemini y Animate UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-black text-zinc-200 min-h-screen antialiased font-sans relative overflow-x-hidden">
        <GravityStarsBackground className="fixed inset-0 -z-10 w-full h-full" />
        {children}
      </body>
    </html>
  );
}
