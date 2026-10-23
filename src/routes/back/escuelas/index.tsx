import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { Buscador } from "@/components/data-table/buscador";
import { DataTable } from "@/components/data-table/data-table";
import { EncabezadoPagina } from "@/components/encabezado-pagina";
import { Button, buttonVariants } from "@/components/ui/button";
import { escuelasQuery, urlExportarEscuelas } from "@/features/escuelas/api";
import { columnasEscuelas } from "@/features/escuelas/columnas";
import { EscuelaFormDialog } from "@/features/escuelas/escuela-form-dialog";
import { useListado } from "@/hooks/use-listado";
import { validarListado } from "@/lib/paginacion";

export const Route = createFileRoute("/back/escuelas/")({
  validateSearch: validarListado,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.query({ ...escuelasQuery(deps), staleTime: "static" }),
  component: Pagina,
});

function Pagina() {
  const { sesion } = Route.useRouteContext();
  const { params, irAPagina, cambiarFilas, buscar } = useListado();
  const { data, isFetching } = useQuery(escuelasQuery(params));
  const [creando, setCreando] = useState(false);

  return (
    <div className="space-y-4">
      <EncabezadoPagina
        titulo="Escuelas"
        descripcion="Desde acá vas a poder gestionar las escuelas"
        acciones={
          <Button onClick={() => setCreando(true)}>Nueva escuela</Button>
        }
      />

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Buscador
          valor={params.search}
          onBuscar={buscar}
          placeholder="Buscar por nombre o CUE/Anexo"
        />
        {sesion.puedeExportarEscuelas && (
          // Descarga directa: el navegador manda la cookie y el back responde el .xlsx
          <a
            href={urlExportarEscuelas(params.search)}
            className={buttonVariants({ color: "ghost" })}
          >
            <DownloadIcon />
            Exportar Excel
          </a>
        )}
      </div>

      <DataTable
        columnas={columnasEscuelas}
        datos={data}
        cargando={isFetching}
        onPagina={irAPagina}
        onFilas={cambiarFilas}
      />

      <EscuelaFormDialog abierto={creando} onCambiarAbierto={setCreando} />
    </div>
  );
}
