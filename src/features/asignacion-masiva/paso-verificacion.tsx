import type { ColumnDef } from "@tanstack/react-table";
import { DownloadIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Buscador } from "@/components/data-table/buscador";
import { DataTableCliente } from "@/components/data-table/data-table-cliente";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FilaValidada, ResumenFilas } from "./api";
import { descargarErrores } from "./descargar-errores";
import { EstadoFilaBadge } from "./estado-fila";

type Fila = FilaValidada & { id: number };

interface Props {
  filas: FilaValidada[];
  resumen: ResumenFilas;
  /** Cantidades que el usuario cambió en la vista previa, por número de fila. */
  ediciones: Record<number, number>;
  onEditar: (fila: number, cantidad: number) => void;
  onVolver: () => void;
  onContinuar: () => void;
}

const coincide = (f: FilaValidada, texto: string) =>
  [f.cueanexo, f.escuela, f.isbn, f.libro].some((v) =>
    v?.toLowerCase().includes(texto),
  );

export function PasoVerificacion({
  filas,
  resumen,
  ediciones,
  onEditar,
  onVolver,
  onContinuar,
}: Props) {
  const [soloErrores, setSoloErrores] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const visibles = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return filas
      .filter((f) => !soloErrores || f.estado === "error")
      .filter((f) => !texto || coincide(f, texto))
      .map((f): Fila => ({ ...f, id: f.fila }));
  }, [filas, soloErrores, busqueda]);

  const columnas: ColumnDef<Fila>[] = [
    { accessorKey: "fila", header: "Fila" },
    {
      id: "escuela",
      header: "Escuela",
      cell: ({ row: { original: f } }) => (
        <div>
          <div>{f.escuela ?? "—"}</div>
          <div className="text-xs text-muted-foreground">
            CUE/Anexo {f.cueanexo || "—"}
          </div>
        </div>
      ),
    },
    {
      id: "libro",
      header: "Libro",
      cell: ({ row: { original: f } }) => (
        <div>
          <div>{f.libro ?? "—"}</div>
          <div className="text-xs text-muted-foreground">
            ISBN {f.isbn || "—"}
          </div>
        </div>
      ),
    },
    {
      id: "oferta",
      header: "Grado – Catálogo",
      cell: ({ row: { original: f } }) =>
        f.grado && f.catalogo ? `${f.grado} – ${f.catalogo}` : "—",
    },
    {
      id: "cantidad",
      header: "Cantidad",
      cell: ({ row: { original: f } }) =>
        f.estado === "error" || f.cantidadMaxima === null ? (
          f.cantidadRaw || "—"
        ) : (
          <Input
            type="number"
            min={1}
            max={f.cantidadMaxima}
            value={ediciones[f.fila] ?? f.cantidad ?? ""}
            aria-label={`Cantidad de la fila ${f.fila}`}
            className="w-20"
            onChange={(e) => {
              const n = Number(e.target.value);
              // Solo enteros entre 1 y el máximo de la oferta; lo demás se ignora
              if (Number.isInteger(n) && n >= 1 && n <= f.cantidadMaxima!) {
                onEditar(f.fila, n);
              }
            }}
          />
        ),
    },
    {
      id: "estado",
      header: "Estado",
      cell: ({ row: { original: f } }) => <EstadoFilaBadge estado={f.estado} />,
    },
    {
      id: "detalle",
      header: "Detalle",
      cell: ({ row: { original: f } }) => (
        <div className="min-w-64 max-w-sm whitespace-normal text-sm">
          {f.estado === "error" ? (
            <span className="text-destructive">{f.errores.join(" ")}</span>
          ) : f.estado === "reemplaza" ? (
            <span className="text-muted-foreground">
              Reemplaza "{f.libroAnterior}"
            </span>
          ) : f.estado === "actualiza" ? (
            <span className="text-muted-foreground">
              Antes: {f.cantidadAnterior}{" "}
              {f.cantidadAnterior === 1 ? "ejemplar" : "ejemplares"}
            </span>
          ) : null}
        </div>
      ),
    },
  ];

  const hayEdiciones = Object.keys(ediciones).length > 0;
  const aImportar = resumen.total - resumen.errores;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Verificación de datos</h2>
        <p className="text-sm text-muted-foreground">
          Paso 2 de 3: revisá qué pasaría con cada fila antes de importar.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Resumen valor={resumen.nuevas} etiqueta="nuevas" />
        <Resumen valor={resumen.actualizan} etiqueta="actualizan" />
        <Resumen valor={resumen.reemplazan} etiqueta="reemplazan" />
        <Resumen valor={resumen.sinCambios} etiqueta="sin cambios" />
        <Resumen valor={resumen.errores} etiqueta="con errores" peligro />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Buscador
          valor={busqueda}
          onBuscar={(t) => setBusqueda(t.trim())}
          placeholder="Buscar por escuela, CUE, libro o ISBN"
        />
        {resumen.errores > 0 && (
          <>
            <div className="flex items-center gap-2">
              <Checkbox
                id="solo-errores"
                checked={soloErrores}
                onCheckedChange={(v) => setSoloErrores(v === true)}
              />
              <Label htmlFor="solo-errores">
                Mostrar solo filas con errores
              </Label>
            </div>
            <Button
              type="button"
              color="outline"
              size="sm"
              onClick={() => void descargarErrores(filas)}
            >
              <DownloadIcon />
              Descargar errores (.xlsx)
            </Button>
          </>
        )}
      </div>

      <DataTableCliente
        columnas={columnas}
        filas={visibles}
        filtros={`${soloErrores}|${busqueda}`}
      />

      {hayEdiciones && (
        <p className="text-xs text-muted-foreground">
          Cambiaste cantidades: el estado de cada fila se confirma al guardar,
          porque el servidor vuelve a validar todo.
        </p>
      )}

      <div className="flex justify-between">
        <Button type="button" color="outline" onClick={onVolver}>
          Volver
        </Button>
        <Button type="button" disabled={aImportar === 0} onClick={onContinuar}>
          Continuar
        </Button>
      </div>
    </div>
  );
}

function Resumen({
  valor,
  etiqueta,
  peligro,
}: {
  valor: number;
  etiqueta: string;
  peligro?: boolean;
}) {
  return (
    <span
      className={
        peligro && valor > 0
          ? "rounded-full border border-red-200 bg-red-50 px-3 py-1 font-medium text-red-800"
          : "rounded-full border px-3 py-1"
      }
    >
      <strong>{valor}</strong> {etiqueta}
    </span>
  );
}
