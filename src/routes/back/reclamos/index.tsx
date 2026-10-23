import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArchiveIcon, DownloadIcon } from "lucide-react";
import { useState } from "react";
import { Buscador } from "@/components/data-table/buscador";
import { DataTable } from "@/components/data-table/data-table";
import { EncabezadoPagina } from "@/components/encabezado-pagina";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  etapasFiltroQuery,
  reclamosQuery,
  urlExportarReclamos,
  type ParametrosReclamos,
} from "@/features/reclamos/api";
import { ArchivarDialog } from "@/features/reclamos/archivar-dialog";
import { columnasReclamos } from "@/features/reclamos/columnas";
import { ESTADOS, ESTADOS_TODOS, esEstado } from "@/features/reclamos/estados";
import { useListado } from "@/hooks/use-listado";
import { validarListado } from "@/lib/paginacion";
import { tieneRol } from "@/lib/sesion";

/** Valor del filtro de estado que significa "sin filtrar". */
const TODOS = "todos";

const ETIQUETAS_ESTADO: Record<string, string> = {
  [TODOS]: "Todos",
  ...Object.fromEntries(ESTADOS_TODOS.map((e) => [e, ESTADOS[e].etiqueta])),
};

export const Route = createFileRoute("/back/reclamos/")({
  validateSearch: (search): ParametrosReclamos => {
    const etapaId = Number(search.etapaId);
    return {
      ...validarListado(search),
      etapaId: Number.isInteger(etapaId) && etapaId > 0 ? etapaId : undefined,
      estado: esEstado(search.estado) ? search.estado : undefined,
    };
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    Promise.all([
      queryClient.query({ ...reclamosQuery(deps), staleTime: "static" }),
      queryClient.query({ ...etapasFiltroQuery, staleTime: "static" }),
    ]),
  component: Pagina,
});

function Pagina() {
  const navigate = useNavigate();
  const { sesion } = Route.useRouteContext();
  const { params, irAPagina, cambiarFilas, buscar } = useListado();
  const filtros: ParametrosReclamos = Route.useSearch();
  const { data, isFetching } = useQuery(reclamosQuery(filtros));
  const { data: etapas = [] } = useQuery(etapasFiltroQuery);
  const [archivando, setArchivando] = useState(false);

  // Etapa que resolvió el back (la del reclamo abierto si la URL no pide otra)
  const etapaId = data?.etapaId ?? null;
  const etiquetasEtapa = Object.fromEntries(
    etapas.map((e) => [
      String(e.id),
      e.visible ? `${e.nombre} (publicada)` : e.nombre,
    ]),
  );

  // Cambia un filtro conservando los demás; la página anterior deja de tener sentido
  const filtrar = (cambios: Partial<ParametrosReclamos>) =>
    void navigate({
      to: ".",
      search: (prev: ParametrosReclamos) => ({
        ...prev,
        ...cambios,
        page: undefined,
      }),
      replace: true,
    });

  return (
    <div className="space-y-4">
      <EncabezadoPagina
        titulo="Reclamos"
        descripcion="Gestioná los reclamos seleccionando la etapa correspondiente"
      />

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Buscador
            valor={params.search}
            onBuscar={buscar}
            placeholder="Buscar por escuela, CUE, libro o ISBN"
          />
          <div className="flex items-center gap-2">
            <label htmlFor="reclamos-etapa" className="text-sm font-medium">
              Etapa:
            </label>
            <Select
              items={etiquetasEtapa}
              value={etapaId === null ? null : String(etapaId)}
              onValueChange={(valor) =>
                filtrar({ etapaId: valor ? Number(valor) : undefined })
              }
              disabled={etapas.length === 0}
            >
              <SelectTrigger id="reclamos-etapa" className="min-w-56">
                <SelectValue placeholder="Sin etapas" />
              </SelectTrigger>
              <SelectContent>
                {etapas.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>
                    {etiquetasEtapa[String(e.id)]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="reclamos-estado" className="text-sm font-medium">
              Estado:
            </label>
            <Select
              items={ETIQUETAS_ESTADO}
              value={filtros.estado ?? TODOS}
              onValueChange={(valor) =>
                filtrar({
                  estado: valor && esEstado(valor) ? valor : undefined,
                })
              }
            >
              <SelectTrigger id="reclamos-estado" className="min-w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODOS}>{ETIQUETAS_ESTADO[TODOS]}</SelectItem>
                {ESTADOS_TODOS.map((e) => (
                  <SelectItem key={e} value={e}>
                    {ESTADOS[e].etiqueta}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {etapaId !== null && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Descarga directa: el navegador manda la cookie y el back responde el .xlsx */}
            <a
              href={urlExportarReclamos(etapaId)}
              className={buttonVariants({ color: "ghost" })}
            >
              <DownloadIcon />
              Exportar Excel
            </a>
            {/* Archivar es masivo e irreversible: solo super_admin y admin (el back también lo exige) */}
            {tieneRol(sesion, ["admin"]) && (
              <Button color="outline" onClick={() => setArchivando(true)}>
                <ArchiveIcon />
                Archivar reclamos
              </Button>
            )}
          </div>
        )}
      </div>

      <DataTable
        columnas={columnasReclamos}
        datos={data}
        cargando={isFetching}
        onPagina={irAPagina}
        onFilas={cambiarFilas}
      />

      {etapaId !== null && (
        <ArchivarDialog
          etapaId={etapaId}
          abierto={archivando}
          onCambiarAbierto={setArchivando}
        />
      )}
    </div>
  );
}
