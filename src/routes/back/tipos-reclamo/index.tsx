import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Buscador } from "@/components/data-table/buscador";
import { DataTable } from "@/components/data-table/data-table";
import { EncabezadoPagina } from "@/components/encabezado-pagina";
import { Button } from "@/components/ui/button";
import { tiposReclamoQuery } from "@/features/tipos-reclamo/api";
import { columnasTiposReclamo } from "@/features/tipos-reclamo/columnas";
import { TipoReclamoFormDialog } from "@/features/tipos-reclamo/tipo-reclamo-form-dialog";
import { useListado } from "@/hooks/use-listado";
import { validarListado } from "@/lib/paginacion";

export const Route = createFileRoute("/back/tipos-reclamo/")({
  validateSearch: validarListado,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.query({ ...tiposReclamoQuery(deps), staleTime: "static" }),
  component: Pagina,
});

function Pagina() {
  const { params, irAPagina, cambiarFilas, buscar } = useListado();
  const { data, isFetching } = useQuery(tiposReclamoQuery(params));
  const [creando, setCreando] = useState(false);

  return (
    <div className="space-y-4">
      <EncabezadoPagina
        titulo="Tipos de reclamo"
        descripcion="Gestioná los tipos de reclamos disponibles"
        acciones={
          <Button onClick={() => setCreando(true)}>Nuevo tipo de reclamo</Button>
        }
      />

      <Buscador
        valor={params.search}
        onBuscar={buscar}
        placeholder="Buscar tipo de reclamo…"
      />

      <DataTable
        columnas={columnasTiposReclamo}
        datos={data}
        cargando={isFetching}
        onPagina={irAPagina}
        onFilas={cambiarFilas}
      />

      <TipoReclamoFormDialog abierto={creando} onCambiarAbierto={setCreando} />
    </div>
  );
}
