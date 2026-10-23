import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Buscador } from "@/components/data-table/buscador";
import { Button } from "@/components/ui/button";
import { librosDeOfertaQuery, type LibroBuscado } from "../api";

interface Props {
  ofertaId: number;
  onElegir: (libro: LibroBuscado) => void;
  onCancelar: () => void;
}

/** Busca entre los libros del grado y catálogo de la oferta (por título, ISBN o editorial). */
export function BuscadorLibros({ ofertaId, onElegir, onCancelar }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const { data: libros = [], isFetching } = useQuery(
    librosDeOfertaQuery(ofertaId, busqueda),
  );

  return (
    <div className="space-y-2 rounded-md border p-3">
      {/* El campo no se bloquea mientras busca: se puede seguir escribiendo */}
      <Buscador
        valor={busqueda}
        onBuscar={(texto) => setBusqueda(texto.trim())}
        placeholder="ISBN, título o editorial…"
        espera={400}
      />
      <div className="max-h-56 space-y-1 overflow-y-auto">
        {isFetching && libros.length === 0 ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" />
            Buscando…
          </p>
        ) : libros.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No se encontraron libros
          </p>
        ) : (
          libros.map((libro) => (
            <button
              key={libro.id}
              type="button"
              onClick={() => onElegir(libro)}
              className="block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
            >
              <span className="font-medium">{libro.titulo}</span>
              <span className="block text-xs text-muted-foreground">
                ISBN {libro.isbn} · {libro.editorial}
              </span>
            </button>
          ))
        )}
      </div>
      <Button type="button" color="ghost" size="sm" onClick={onCancelar}>
        Cancelar
      </Button>
    </div>
  );
}
