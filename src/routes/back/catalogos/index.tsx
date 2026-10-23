import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpenIcon, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Buscador } from "@/components/data-table/buscador";
import { EncabezadoPagina } from "@/components/encabezado-pagina";
import { Button } from "@/components/ui/button";
import { catalogosQuery } from "@/features/catalogos/api";
import { CatalogoFormDialog } from "@/features/catalogos/catalogo-form-dialog";
import { TarjetaCatalogo } from "@/features/catalogos/tarjeta-catalogo";

export const Route = createFileRoute("/back/catalogos/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.query({ ...catalogosQuery, staleTime: "static" }),
  component: Pagina,
});

function Pagina() {
  const { data: catalogos = [] } = useQuery(catalogosQuery);
  const [creando, setCreando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // Son pocos catálogos: se filtra en el navegador, sin ir al servidor
  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return texto
      ? catalogos.filter((c) => c.nombre.toLowerCase().includes(texto))
      : catalogos;
  }, [catalogos, busqueda]);

  return (
    <div className="space-y-6">
      <EncabezadoPagina
        titulo="Gestión de libros"
        descripcion="Gestioná los catálogos y los libros de cada uno"
        acciones={
          <Button onClick={() => setCreando(true)}>Nuevo catálogo</Button>
        }
      />

      <Buscador
        valor={busqueda}
        onBuscar={setBusqueda}
        espera={150}
        placeholder="Buscar catálogo…"
      />

      {visibles.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed bg-muted/20 py-20 text-center">
          <BookOpenIcon className="mx-auto mb-4 size-12 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold">
            {catalogos.length === 0
              ? "Aún no hay catálogos creados"
              : "No hay catálogos que coincidan"}
          </h3>
          {catalogos.length === 0 && (
            <>
              <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
                Empezá creando tu primer catálogo (ej: Inglés) para luego poder
                cargar libros dentro de él.
              </p>
              <Button className="mt-6" onClick={() => setCreando(true)}>
                <PlusIcon />
                Crear primer catálogo
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibles.map((catalogo) => (
            <TarjetaCatalogo key={catalogo.id} catalogo={catalogo} />
          ))}
        </div>
      )}

      <CatalogoFormDialog abierto={creando} onCambiarAbierto={setCreando} />
    </div>
  );
}
