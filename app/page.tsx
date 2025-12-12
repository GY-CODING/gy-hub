import { HomeLayout } from "./components/home/HomeLayout";
import { HomePage } from "./components/home/HomePage";

/**
 * Página principal
 * Responsabilidad: Punto de entrada, composición de layout y contenido
 */
export default function Page() {
  return (
    <HomeLayout>
      <HomePage />
    </HomeLayout>
  );
}
