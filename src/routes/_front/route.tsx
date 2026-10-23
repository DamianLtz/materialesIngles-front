import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

// Layout de las páginas públicas (todo lo que no es /back): header y footer, sin sidebar.
// Es una ruta sin path: "_front" no aparece en la URL.
export const Route = createFileRoute("/_front")({
  component: LayoutFront,
});

function LayoutFront() {
  return (
    <div className="public-layout">
      <Header conSidebar={false} />
      <Outlet />
      <Footer />
    </div>
  );
}
