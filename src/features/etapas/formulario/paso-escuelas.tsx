import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useController, type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { escuelasOpcionesQuery } from "@/features/escuelas/api";
import type { DatosEtapa } from "../api";

const FILAS_POR_PAGINA = 50;
const TODOS_LOS_DISTRITOS = "todos";

/** Minúsculas y sin tildes, para buscar "peru" y encontrar "Perú". */
const normalizar = (texto: string) =>
  texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

interface Props {
  form: UseFormReturn<DatosEtapa>;
  /** Escuelas con pedidos en esta etapa: no se pueden destildar. */
  bloqueadas: number[];
}

/**
 * Paso 2: qué escuelas participan. Son miles, así que se filtran y paginan en el
 * navegador (50 filas por vez) y "seleccionar todas" actúa sobre las filtradas.
 */
export function PasoEscuelas({ form, bloqueadas }: Props) {
  const { data: escuelas = [] } = useQuery(escuelasOpcionesQuery);
  const { field } = useController({
    control: form.control,
    name: "escuelaIds",
  });
  const [texto, setTexto] = useState("");
  const [distrito, setDistrito] = useState(TODOS_LOS_DISTRITOS);
  const [pagina, setPagina] = useState(1);

  const seleccion = useMemo(() => new Set(field.value), [field.value]);
  const conPedidos = useMemo(() => new Set(bloqueadas), [bloqueadas]);

  const distritos = useMemo(
    () => [...new Set(escuelas.map((e) => e.distrito))].sort((a, b) => a - b),
    [escuelas],
  );
  const itemsDistrito = useMemo(
    () => ({
      [TODOS_LOS_DISTRITOS]: "Todos los distritos",
      ...Object.fromEntries(distritos.map((d) => [String(d), `Distrito ${d}`])),
    }),
    [distritos],
  );

  const filtradas = useMemo(() => {
    const buscado = normalizar(texto.trim());
    return escuelas.filter(
      (e) =>
        (distrito === TODOS_LOS_DISTRITOS || String(e.distrito) === distrito) &&
        (!buscado ||
          normalizar(e.nombre).includes(buscado) ||
          e.cueanexo.includes(buscado)),
    );
  }, [escuelas, texto, distrito]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(filtradas.length / FILAS_POR_PAGINA),
  );
  const paginaActual = Math.min(pagina, totalPaginas);
  const filas = filtradas.slice(
    (paginaActual - 1) * FILAS_POR_PAGINA,
    paginaActual * FILAS_POR_PAGINA,
  );

  const marcadas = filtradas.filter((e) => seleccion.has(e.id)).length;
  const todasMarcadas = filtradas.length > 0 && marcadas === filtradas.length;

  function marcarVisibles(marcar: boolean) {
    const visibles = new Set(filtradas.map((e) => e.id));
    field.onChange(
      marcar
        ? [...new Set([...field.value, ...visibles])]
        : // las escuelas con pedidos se quedan aunque se quiten "todas"
          field.value.filter((id) => !visibles.has(id) || conPedidos.has(id)),
    );
  }

  function alternar(id: number, marcar: boolean) {
    field.onChange(
      marcar ? [...field.value, id] : field.value.filter((x) => x !== id),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Escuelas asignadas</h2>
          <p className="text-sm text-muted-foreground">
            Elegí las escuelas que participan de esta etapa.
          </p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
          Seleccionadas: {field.value.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Buscar escuela"
            className="pl-8"
            placeholder="Buscar por nombre o CUE/Anexo…"
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              setPagina(1);
            }}
          />
        </div>
        <Select
          items={itemsDistrito}
          value={distrito}
          onValueChange={(valor) => {
            setDistrito(valor ?? TODOS_LOS_DISTRITOS);
            setPagina(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-52" aria-label="Distrito">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODOS_LOS_DISTRITOS}>
              Todos los distritos
            </SelectItem>
            {distritos.map((d) => (
              <SelectItem key={d} value={String(d)}>
                Distrito {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-md border">
        <label className="flex items-center gap-3 border-b bg-muted/50 px-4 py-2.5 text-sm font-medium">
          <Checkbox
            aria-label="Seleccionar todas las visibles"
            checked={todasMarcadas}
            indeterminate={marcadas > 0 && !todasMarcadas}
            disabled={filtradas.length === 0}
            onCheckedChange={marcarVisibles}
          />
          Seleccionar todas las visibles ({filtradas.length})
        </label>

        {filas.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No hay escuelas que coincidan con la búsqueda.
          </p>
        ) : (
          <ul className="divide-y">
            {filas.map((e) => {
              const marcada = seleccion.has(e.id);
              const bloqueada = conPedidos.has(e.id);
              return (
                <li key={e.id}>
                  <label className="flex cursor-pointer items-center gap-3 px-4 py-2 text-sm hover:bg-muted/50">
                    <Checkbox
                      aria-label={`Seleccionar ${e.nombre}`}
                      checked={marcada}
                      disabled={bloqueada && marcada}
                      onCheckedChange={(valor) => alternar(e.id, valor)}
                    />
                    <span className="flex-1">{e.nombre}</span>
                    {bloqueada && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                        Con pedidos
                      </span>
                    )}
                    <span className="hidden text-muted-foreground sm:inline">
                      CUE/Anexo {e.cueanexo}
                    </span>
                    <span className="w-24 text-right text-muted-foreground">
                      Distrito {e.distrito}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          Página {paginaActual} de {totalPaginas} · {filtradas.length} escuelas
        </span>
        <div className="flex gap-2">
          <Button
            type="button"
            color="outline"
            size="sm"
            aria-label="Página anterior"
            disabled={paginaActual <= 1}
            onClick={() => setPagina(paginaActual - 1)}
          >
            Anterior
          </Button>
          <Button
            type="button"
            color="outline"
            size="sm"
            aria-label="Página siguiente"
            disabled={paginaActual >= totalPaginas}
            onClick={() => setPagina(paginaActual + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
      {bloqueadas.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Las escuelas con pedidos en esta etapa no se pueden quitar.
        </p>
      )}
    </div>
  );
}
