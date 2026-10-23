import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: RootComponent,
  },
);

function RootComponent() {
  return (
    // El sidebar de Base UI no trae su propio TooltipProvider (el de Radix sí)
    <TooltipProvider>
      <Outlet />
      <Toaster richColors position="top-right" />
      {/* Arriba a la derecha: abajo a la izquierda tapaba el menú del usuario del sidebar */}
      <TanStackRouterDevtools position="top-right" />
      <ReactQueryDevtools />
    </TooltipProvider>
  );
}
