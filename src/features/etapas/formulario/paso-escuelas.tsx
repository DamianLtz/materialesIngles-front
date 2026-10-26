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
import {
  escuelasOpcionesQuery,
  etiquetaComuna,
  type OpcionEscuela,
} from "@/features/escuelas/api";
import type { DatosEtapa } from "../api";

const FILAS_POR_PAGINA = 50;
const TODAS_LAS_COMUNAS = "todas";
const SIN_COMUNA = "sin-comuna";

/** Valor del filtro para una escuela: el número de comuna, o SIN_COMUNA si no la tiene. */
const valorComuna = (comuna: OpcionEscuela["comuna"]) =>
  comuna === null ? SIN_COMUNA : String(comuna);

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
  const [comuna, setComuna] = useState(TODAS_LAS_COMUNAS);
  const [pagina, setPagina] = useState(1);

  const seleccion = useMemo(() => new Set(field.value), [field.value]);
  const conPedidos = useMemo(() => new Set(bloqueadas), [bloqueadas]);

  // Las comunas presentes, en orden, y "Sin comuna" al final si hay escuelas sin cargar
  const comunas = useMemo(() => {
    const presentes = [...new Set(escuelas.map((e) => e.comuna))];
    const numeros = presentes
      .filter((c) => c !== null)
      .sort((a, b) => a - b);
    return presentes.includes(null) ? [...numeros, null] : numeros;
  }, [escuelas]);
  const itemsComuna = useMemo(
    () => ({
      [TODAS_LAS_COMUNAS]: "Todas las comunas",
      ...Object.fromEntries(
        comunas.map((c) => [valorComuna(c), etiquetaComuna(c)]),
      ),
    }),
    [comunas],
  );

  const filtradas = useMemo(() => {
    const buscado = normalizar(texto.trim());
    return escuelas.filter(
      (e) =>
        (comuna === TODAS_LAS_COMUNAS || valorComuna(e.comuna) === comuna) &&
        (!buscado ||
          normalizar(e.nombre).includes(buscado) ||
          e.cueanexo.includes(buscado)),
    );
  }, [escuelas, texto, comuna]);

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

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative sm:max-w-lg w-full">
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
          items={itemsComuna}
          value={comuna}
          onValueChange={(valor) => {
            setComuna(valor ?? TODAS_LAS_COMUNAS);
            setPagina(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-52" aria-label="Comuna">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TODAS_LAS_COMUNAS}>Todas las comunas</SelectItem>
            {comunas.map((c) => (
              <SelectItem key={valorComuna(c)} value={valorComuna(c)}>
                {etiquetaComuna(c)}
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
                      {etiquetaComuna(e.comuna)}
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
