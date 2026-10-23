import { DownloadIcon, FileSpreadsheetIcon, Loader2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MAX_MB, URL_ACTUALES, URL_PLANTILLA } from "./api";

interface Props {
  etapa: string;
  archivo: File | null;
  onArchivo: (archivo: File | null) => void;
  onCargar: () => void;
  cargando: boolean;
}

/** Avisa antes de subir lo que el back también rechazaría (otra extensión o más de 5 MB). */
function validarArchivo(archivo: File): string | null {
  if (!archivo.name.toLowerCase().endsWith(".xlsx")) {
    return "El archivo tiene que ser un Excel (.xlsx).";
  }
  if (archivo.size > MAX_MB * 1024 * 1024) {
    return `El archivo supera los ${MAX_MB} MB permitidos.`;
  }
  return null;
}

const COLUMNAS: [string, string][] = [
  ["cueanexo", "CUE/Anexo de la escuela (como texto, con todos sus dígitos)"],
  ["isbn", "ISBN del libro: de él se obtiene el grado y el catálogo"],
  ["cantidad", "Número entero, hasta el máximo de la oferta"],
  ["grado", "Opcional: sirve de control contra el grado del libro"],
];

export function PasoCarga({
  etapa,
  archivo,
  onArchivo,
  onCargar,
  cargando,
}: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [arrastrando, setArrastrando] = useState(false);

  function elegir(nuevo: File | undefined) {
    if (!nuevo) return;
    const error = validarArchivo(nuevo);
    if (error) {
      toast.error(error);
      return;
    }
    onArchivo(nuevo);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Carga de datos</h2>
        <p className="text-sm text-muted-foreground">
          Paso 1 de 3: elegí el archivo. Se asigna sobre la etapa publicada:{" "}
          <strong className="text-foreground">{etapa}</strong>.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <input
            ref={input}
            type="file"
            accept=".xlsx"
            className="sr-only"
            aria-label="Archivo de datos (.xlsx)"
            onChange={(e) => {
              elegir(e.target.files?.[0]);
              // Permite volver a elegir el mismo archivo después de corregirlo
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => input.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setArrastrando(true);
            }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={(e) => {
              e.preventDefault();
              setArrastrando(false);
              elegir(e.dataTransfer.files[0]);
            }}
            className={cn(
              "flex min-h-48 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:bg-muted/50",
              arrastrando && "border-primary bg-muted/50",
            )}
          >
            <FileSpreadsheetIcon className="size-10 text-muted-foreground" />
            {archivo ? (
              <>
                <span className="font-medium">{archivo.name}</span>
                <span className="text-sm text-muted-foreground">
                  {(archivo.size / 1024 / 1024).toFixed(2)} MB · Hacé clic para
                  cambiar
                </span>
              </>
            ) : (
              <>
                <span className="font-medium">Arrastrá tu archivo acá</span>
                <span className="text-sm text-muted-foreground">
                  o hacé clic para explorar tus carpetas (.xlsx, hasta {MAX_MB}{" "}
                  MB)
                </span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="font-semibold">Guía de importación</h3>
          <p className="text-muted-foreground">
            Usá la plantilla o descargá las asignaciones actuales, corregilas y
            volvelas a subir. Los nombres de las columnas tienen que ser
            exactos.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={URL_PLANTILLA}
              className={buttonVariants({ color: "outline", size: "sm" })}
            >
              <DownloadIcon />
              Descargar plantilla
            </a>
            <a
              href={URL_ACTUALES}
              className={buttonVariants({ color: "outline", size: "sm" })}
            >
              <DownloadIcon />
              Descargar asignaciones actuales
            </a>
          </div>
          <ul className="space-y-1">
            {COLUMNAS.map(([nombre, ayuda]) => (
              <li key={nombre}>
                <code className="rounded bg-muted px-1 py-0.5">{nombre}</code>{" "}
                <span className="text-muted-foreground">– {ayuda}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground">
            Si una escuela ya tiene un pedido en esa oferta, se actualiza (misma
            fila si solo cambia la cantidad) o se reemplaza el libro; nunca se
            borra nada definitivamente.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          disabled={!archivo || cargando}
          onClick={onCargar}
        >
          {cargando && <Loader2Icon className="animate-spin" />}
          {cargando ? "Cargando…" : "Cargar archivo"}
        </Button>
      </div>
    </div>
  );
}
