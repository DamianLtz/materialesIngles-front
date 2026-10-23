import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { catalogosQuery } from "@/features/catalogos/api";
import { escuelasOpcionesQuery } from "@/features/escuelas/api";
import { etapaQuery } from "@/features/etapas/api";
import { EtapaForm } from "@/features/etapas/formulario/etapa-form";
import { gradosOpcionesQuery } from "@/features/grados/api";
import { ApiError } from "@/lib/api";
import { tieneRol } from "@/lib/sesion";

export const Route = createFileRoute("/back/etapas/$etapaId/editar")({
  beforeLoad: ({ context: { sesion } }) => {
    if (!tieneRol(sesion, ["admin"])) throw redirect({ to: "/back/dashboard" });
  },
  loader: async ({ context: { queryClient }, params }) => {
    const id = Number(params.etapaId);
    try {
      await Promise.all([
        queryClient.query({ ...etapaQuery(id), staleTime: "static" }),
        queryClient.query({ ...escuelasOpcionesQuery, staleTime: "static" }),
        queryClient.query({ ...gradosOpcionesQuery, staleTime: "static" }),
        queryClient.query({ ...catalogosQuery, staleTime: "static" }),
      ]);
    } catch (error) {
      // Etapa borrada o id inválido: vuelve al listado en lugar de mostrar un error
      if (error instanceof ApiError && error.status === 404) {
        toast.error("La etapa no existe.");
        throw redirect({ to: "/back/etapas" });
      }
      throw error;
    }
  },
  component: Pagina,
});

function Pagina() {
  const { etapaId } = Route.useParams();
  const { data: etapa } = useSuspenseQuery(etapaQuery(Number(etapaId)));
  // key: si se navega a otra etapa, el formulario arranca con sus datos
  return <EtapaForm key={etapa.id} etapa={etapa} />;
}
