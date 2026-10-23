import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Buscador } from "@/components/data-table/buscador";
import { DataTable } from "@/components/data-table/data-table";
import { EncabezadoPagina } from "@/components/encabezado-pagina";
import { buttonVariants } from "@/components/ui/button";
import { etapasQuery } from "@/features/etapas/api";
import { columnasEtapas } from "@/features/etapas/columnas";
import { useListado } from "@/hooks/use-listado";
import { validarListado } from "@/lib/paginacion";
import { tieneRol } from "@/lib/sesion";

export const Route = createFileRoute("/back/etapas/")({
  // Gestionan etapas super_admin y admin (el back también lo exige con 403)
  beforeLoad: ({ context: { sesion } }) => {
    if (!tieneRol(sesion, ["admin"])) throw redirect({ to: "/back/dashboard" });
  },
  validateSearch: validarListado,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.query({ ...etapasQuery(deps), staleTime: "static" }),
  component: Pagina,
});

function Pagina() {
  const { params, irAPagina, cambiarFilas, buscar } = useListado();
  const { data, isFetching } = useQuery(etapasQuery(params));

  return (
    <div className="space-y-4">
      <EncabezadoPagina
        titulo="Etapas"
        descripcion="Gestioná las etapas de selección y reclamo de libros"
        acciones={
          <Link to="/back/etapas/crear" className={buttonVariants()}>
            Nueva etapa
          </Link>
        }
      />

      <Buscador
        valor={params.search}
        onBuscar={buscar}
        placeholder="Buscar etapa…"
      />

      <DataTable
        columnas={columnasEtapas}
        datos={data}
        cargando={isFetching}
        onPagina={irAPagina}
        onFilas={cambiarFilas}
      />
    </div>
  );
}
