import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { Buscador } from "@/components/data-table/buscador";
import { DataTable } from "@/components/data-table/data-table";
import { EncabezadoPagina } from "@/components/encabezado-pagina";
import { Button } from "@/components/ui/button";
import { catalogoQuery, librosQuery } from "@/features/catalogos/api";
import { columnasLibros } from "@/features/catalogos/columnas-libros";
import { LibroFormDialog } from "@/features/catalogos/libro-form-dialog";
import { gradosOpcionesQuery } from "@/features/grados/api";
import { useListado } from "@/hooks/use-listado";
import { validarListado } from "@/lib/paginacion";

export const Route = createFileRoute("/back/catalogos/$catalogoId/libros")({
  validateSearch: validarListado,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps, params }) => {
    const catalogoId = Number(params.catalogoId);
    return Promise.all([
      queryClient.query({ ...catalogoQuery(catalogoId), staleTime: "static" }),
      queryClient.query({
        ...librosQuery(catalogoId, deps),
        staleTime: "static",
      }),
      queryClient.query({ ...gradosOpcionesQuery, staleTime: "static" }),
    ]);
  },
  component: Pagina,
});

function Pagina() {
  const catalogoId = Number(Route.useParams().catalogoId);
  const { params, irAPagina, cambiarFilas, buscar } = useListado();
  const { data: catalogo } = useQuery(catalogoQuery(catalogoId));
  const { data, isFetching } = useQuery(librosQuery(catalogoId, params));
  const [creando, setCreando] = useState(false);

  const cantidad = catalogo?.cantidadLibros ?? 0;

  return (
    <div className="space-y-4">
      <Link
        to="/back/catalogos"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Volver a los catálogos
      </Link>

      <EncabezadoPagina
        titulo={catalogo?.nombre ?? "Catálogo"}
        descripcion={`${cantidad} ${cantidad === 1 ? "libro cargado" : "libros cargados"} en esta sección`}
        acciones={
          <Button onClick={() => setCreando(true)}>Nuevo libro</Button>
        }
      />

      <Buscador
        valor={params.search}
        onBuscar={buscar}
        placeholder="Buscar por título, ISBN o editorial…"
      />

      <DataTable
        columnas={columnasLibros}
        datos={data}
        cargando={isFetching}
        onPagina={irAPagina}
        onFilas={cambiarFilas}
      />

      <LibroFormDialog
        catalogoId={catalogoId}
        abierto={creando}
        onCambiarAbierto={setCreando}
      />
    </div>
  );
}
