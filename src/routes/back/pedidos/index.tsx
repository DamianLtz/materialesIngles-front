import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { DownloadIcon } from "lucide-react";
import { Buscador } from "@/components/data-table/buscador";
import { DataTable } from "@/components/data-table/data-table";
import { EncabezadoPagina } from "@/components/encabezado-pagina";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  etapasFiltroQuery,
  pedidosQuery,
  urlExportarPedidos,
  type ParametrosPedidos,
} from "@/features/pedidos/api";
import { columnasPedidos } from "@/features/pedidos/columnas";
import { useListado } from "@/hooks/use-listado";
import { validarListado } from "@/lib/paginacion";
import { tieneRol } from "@/lib/sesion";

export const Route = createFileRoute("/back/pedidos/")({
  // Gestionan pedidos super_admin y admin (el back también lo exige con 403)
  beforeLoad: ({ context: { sesion } }) => {
    if (!tieneRol(sesion, ["admin"])) throw redirect({ to: "/back/dashboard" });
  },
  validateSearch: (search): ParametrosPedidos => {
    const etapaId = Number(search.etapaId);
    return {
      ...validarListado(search),
      etapaId: Number.isInteger(etapaId) && etapaId > 0 ? etapaId : undefined,
    };
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    Promise.all([
      queryClient.query({ ...pedidosQuery(deps), staleTime: "static" }),
      queryClient.query({ ...etapasFiltroQuery, staleTime: "static" }),
    ]),
  component: Pagina,
});

function Pagina() {
  const navigate = useNavigate();
  const { params, irAPagina, cambiarFilas, buscar } = useListado();
  const filtros: ParametrosPedidos = Route.useSearch();
  const { data, isFetching } = useQuery(pedidosQuery(filtros));
  const { data: etapas = [] } = useQuery(etapasFiltroQuery);

  // Etapa que resolvió el back (la publicada si la URL no pide otra)
  const etapaId = data?.etapaId ?? null;
  const etiquetas = Object.fromEntries(
    etapas.map((e) => [
      String(e.id),
      e.visible ? `${e.nombre} (publicada)` : e.nombre,
    ]),
  );

  return (
    <div className="space-y-4">
      <EncabezadoPagina
        titulo="Solicitudes"
        descripcion="Desde acá podés gestionar las solicitudes de libros"
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Buscador
            valor={params.search}
            onBuscar={buscar}
            placeholder="Buscar por escuela, CUE, libro o ISBN"
          />
          <div className="flex items-center gap-2">
            <label htmlFor="pedidos-etapa" className="text-sm font-medium">
              Etapa:
            </label>
            <Select
              items={etiquetas}
              value={etapaId === null ? null : String(etapaId)}
              onValueChange={(valor) =>
                void navigate({
                  to: ".",
                  // Al cambiar de etapa la página anterior deja de tener sentido
                  search: (prev: ParametrosPedidos) => ({
                    ...prev,
                    etapaId: valor ? Number(valor) : undefined,
                    page: undefined,
                  }),
                  replace: true,
                })
              }
              disabled={etapas.length === 0}
            >
              <SelectTrigger id="pedidos-etapa" className="min-w-56">
                <SelectValue placeholder="Sin etapas" />
              </SelectTrigger>
              <SelectContent>
                {etapas.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>
                    {etiquetas[String(e.id)]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {etapaId !== null && (
          // Descarga directa: el navegador manda la cookie y el back responde el .xlsx
          <a
            href={urlExportarPedidos(etapaId)}
            className={buttonVariants({ color: "ghost" })}
          >
            <DownloadIcon />
            Exportar Excel
          </a>
        )}
      </div>

      <DataTable
        columnas={columnasPedidos}
        datos={data}
        cargando={isFetching}
        onPagina={irAPagina}
        onFilas={cambiarFilas}
      />
    </div>
  );
}
