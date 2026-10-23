import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { toast } from "sonner";
import "./index.css";
import { ApiError } from "./lib/api";
import { routeTree } from "./routeTree.gen";

/** Sesión vencida o cerrada en otro lado: limpia la caché y vuelve al login. */
function siSesionVencida(error: Error): boolean {
  if (!(error instanceof ApiError) || error.status !== 401) return false;
  queryClient.clear();
  void router.navigate({ to: "/" });
  return true;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // El loader de cada ruta precarga los datos y el componente los vuelve a pedir:
      // con staleTime 0 eso duplica cada pedido. Las mutaciones invalidan lo que cambian.
      staleTime: 10_000,
    },
  },
  queryCache: new QueryCache({ onError: siSesionVencida }),
  mutationCache: new MutationCache({
    // Las acciones que fallan avisan con un toast; si una mutation define su
    // propio onError (ej. errores por campo en un formulario), igual corre este
    onError: (error) => {
      if (!siSesionVencida(error)) toast.error(error.message);
    },
  }),
});

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0, // la caché la maneja Query, no el router
  // defaultPendingComponent: PageSkeleton,
  // defaultErrorComponent: PageError,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
