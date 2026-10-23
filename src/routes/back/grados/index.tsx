import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Buscador } from "@/components/data-table/buscador";
import { DataTable } from "@/components/data-table/data-table";
import { EncabezadoPagina } from "@/components/encabezado-pagina";
import { Button } from "@/components/ui/button";
import { gradosQuery } from "@/features/grados/api";
import { columnasGrados } from "@/features/grados/columnas";
import { GradoFormDialog } from "@/features/grados/grado-form-dialog";
import { useListado } from "@/hooks/use-listado";
import { validarListado } from "@/lib/paginacion";

export const Route = createFileRoute("/back/grados/")({
  validateSearch: validarListado,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.query({ ...gradosQuery(deps), staleTime: "static" }),
  component: Pagina,
});

function Pagina() {
  const { params, irAPagina, cambiarFilas, buscar } = useListado();
  const { data, isFetching } = useQuery(gradosQuery(params));
  const [creando, setCreando] = useState(false);

  return (
    <div className="space-y-4">
      <EncabezadoPagina
        titulo="Tipos de grado"
        descripcion="Gestioná los tipos de grado disponibles para la asignación de libros"
        acciones={
          <Button onClick={() => setCreando(true)}>Nuevo tipo de grado</Button>
        }
      />

      <Buscador
        valor={params.search}
        onBuscar={buscar}
        placeholder="Buscar tipo de grado…"
      />

      <DataTable
        columnas={columnasGrados}
        datos={data}
        cargando={isFetching}
        onPagina={irAPagina}
        onFilas={cambiarFilas}
      />

      <GradoFormDialog abierto={creando} onCambiarAbierto={setCreando} />
    </div>
  );
}
