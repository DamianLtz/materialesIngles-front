import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FILAS_POR_PAGINA, type Paginado } from "@/lib/paginacion";

/** Páginas a mostrar: primera, última y la actual con sus vecinas; "..." en los saltos. */
function numerosDePagina(actual: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const visibles = [
    ...new Set(
      [1, total, actual - 1, actual, actual + 1].filter(
        (p) => p >= 1 && p <= total,
      ),
    ),
  ].sort((a, b) => a - b);

  const resultado: (number | "...")[] = [];
  visibles.forEach((pagina, i) => {
    if (i > 0 && pagina - visibles[i - 1] > 1) resultado.push("...");
    resultado.push(pagina);
  });
  return resultado;
}

interface Props {
  meta: Paginado<unknown>["meta"];
  onPagina: (page: number) => void;
  onFilas: (perPage: number) => void;
}

export function DataTablePagination({ meta, onPagina, onFilas }: Props) {
  const { page, perPage, total, lastPage } = meta;
  const desde = total === 0 ? 0 : (page - 1) * perPage + 1;
  const hasta = Math.min(page * perPage, total);
  const irA = (destino: number) => {
    if (destino >= 1 && destino <= lastPage && destino !== page) {
      onPagina(destino);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Filas por página:</span>
          <Select
            value={String(perPage)}
            onValueChange={(valor) => valor && onFilas(Number(valor))}
          >
            <SelectTrigger size="sm" className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILAS_POR_PAGINA.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="hidden text-sm text-muted-foreground sm:block">
          {total === 0 ? (
            "Sin resultados"
          ) : (
            <>
              Mostrando <span className="font-medium">{desde}</span> a{" "}
              <span className="font-medium">{hasta}</span> de{" "}
              <span className="font-medium">{total}</span> resultados
            </>
          )}
        </p>
      </div>

      <div className="flex items-center justify-center gap-1">
        <Button
          color="outline"
          size="sm"
          aria-label="Primera página"
          onClick={() => irA(1)}
          disabled={page <= 1}
        >
          <ChevronsLeftIcon />
        </Button>
        <Button
          color="outline"
          size="sm"
          aria-label="Página anterior"
          onClick={() => irA(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeftIcon />
        </Button>

        <div className="hidden items-center gap-1 sm:flex">
          {numerosDePagina(page, lastPage).map((n, i) =>
            n === "..." ? (
              <span
                key={`salto-${i}`}
                className="px-2 text-sm text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={n}
                color={n === page ? "default" : "outline"}
                size="sm"
                className="w-9"
                aria-current={n === page ? "page" : undefined}
                onClick={() => irA(n)}
              >
                {n}
              </Button>
            ),
          )}
        </div>
        <span className="px-2 text-sm text-muted-foreground sm:hidden">
          Página {page} de {Math.max(lastPage, 1)}
        </span>

        <Button
          color="outline"
          size="sm"
          aria-label="Página siguiente"
          onClick={() => irA(page + 1)}
          disabled={page >= lastPage}
        >
          <ChevronRightIcon />
        </Button>
        <Button
          color="outline"
          size="sm"
          aria-label="Última página"
          onClick={() => irA(lastPage)}
          disabled={page >= lastPage}
        >
          <ChevronsRightIcon />
        </Button>
      </div>
    </div>
  );
}
