import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getSesion } from "@/lib/sesion";

// Layout de todo /back/*: sin sesión vuelve al login
export const Route = createFileRoute("/back")({
  beforeLoad: async () => {
    const sesion = await getSesion();
    if (!sesion) throw redirect({ to: "/" });
    return { sesion };
  },
  component: LayoutBack,
});

function LayoutBack() {
  const { sesion } = Route.useRouteContext();

  return (
    // Arranca en modo íconos, como el original
    <SidebarProvider defaultOpen={false}>
      <AppSidebar sesion={sesion} />
      {/* min-w-0: una tabla ancha scrollea por dentro en vez de ensanchar toda la página */}
      <SidebarInset className="min-w-0">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
