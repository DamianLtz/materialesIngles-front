import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { EncabezadoPagina } from "@/components/encabezado-pagina";
import { etapaPublicadaQuery } from "@/features/asignacion-masiva/api";
import { Asistente } from "@/features/asignacion-masiva/asistente";
import { tieneRol } from "@/lib/sesion";

export const Route = createFileRoute("/back/asignacion-masiva/")({
  // Asignan super_admin y admin (el back también lo exige con 403)
  beforeLoad: ({ context: { sesion } }) => {
    if (!tieneRol(sesion, ["admin"])) throw redirect({ to: "/back/dashboard" });
  },
  loader: ({ context: { queryClient } }) =>
    queryClient.query({ ...etapaPublicadaQuery, staleTime: "static" }),
  component: Pagina,
});

function Pagina() {
  const { data } = useQuery(etapaPublicadaQuery);
  const etapa = data?.etapa ?? null;

  return (
    <div className="space-y-4">
      <EncabezadoPagina
        titulo="Asignación masiva"
        descripcion="Importá un archivo Excel (.xlsx) para asignar libros a escuelas de forma masiva"
      />
      {etapa ? (
        // La key reinicia el asistente si cambia la etapa publicada
        <Asistente key={etapa.id} etapa={etapa} />
      ) : (
        <p className="rounded-lg border p-6 text-center text-muted-foreground">
          No hay una etapa publicada. Publicá una desde{" "}
          <Link to="/back/etapas" className="underline">
            Etapas
          </Link>{" "}
          para poder importar.
        </p>
      )}
    </div>
  );
}
