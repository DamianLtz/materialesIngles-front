import { createFileRoute, redirect } from "@tanstack/react-router";
import { catalogosQuery } from "@/features/catalogos/api";
import { escuelasOpcionesQuery } from "@/features/escuelas/api";
import { EtapaForm } from "@/features/etapas/formulario/etapa-form";
import { gradosOpcionesQuery } from "@/features/grados/api";
import { tieneRol } from "@/lib/sesion";

export const Route = createFileRoute("/back/etapas/crear")({
  beforeLoad: ({ context: { sesion } }) => {
    if (!tieneRol(sesion, ["admin"])) throw redirect({ to: "/back/dashboard" });
  },
  // Las opciones de los pasos 2 y 3 se precargan para que el asistente no muestre listas vacías
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.query({ ...escuelasOpcionesQuery, staleTime: "static" }),
      queryClient.query({ ...gradosOpcionesQuery, staleTime: "static" }),
      queryClient.query({ ...catalogosQuery, staleTime: "static" }),
    ]);
  },
  component: () => <EtapaForm />,
});
