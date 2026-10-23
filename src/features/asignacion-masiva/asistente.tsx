import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  useGuardar,
  useParse,
  type ResultadoGuardado,
  type VistaPrevia,
} from "./api";
import { PantallaExito, PasoConfirmacion } from "./paso-confirmacion";
import { PasoCarga } from "./paso-carga";
import { PasoVerificacion } from "./paso-verificacion";

const PASOS = ["Carga de datos", "Verificación", "Confirmar"];

/** Asistente de 3 pasos (cargar, verificar, confirmar) y una pantalla de éxito. */
export function Asistente({
  etapa,
}: {
  etapa: { id: number; nombre: string };
}) {
  const [paso, setPaso] = useState(0);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [vista, setVista] = useState<VistaPrevia | null>(null);
  const [ediciones, setEdiciones] = useState<Record<number, number>>({});
  const [resultado, setResultado] = useState<ResultadoGuardado | null>(null);
  const parse = useParse();
  const guardar = useGuardar();

  function reiniciar() {
    setPaso(0);
    setArchivo(null);
    setVista(null);
    setEdiciones({});
    setResultado(null);
  }

  /** Al guardar solo se mandan las filas válidas; el back vuelve a validarlas. */
  function confirmar() {
    if (!vista) return;
    const filas = vista.filas
      .filter((f) => f.estado !== "error" && f.cantidad !== null)
      .map((f) => ({
        fila: f.fila,
        cueanexo: f.cueanexo,
        isbn: f.isbn,
        cantidad: ediciones[f.fila] ?? f.cantidad!,
      }));
    guardar.mutate(filas, { onSuccess: setResultado });
  }

  if (resultado) {
    return (
      <Marco>
        <PantallaExito
          etapa={etapa.nombre}
          resultado={resultado}
          onOtra={reiniciar}
        />
      </Marco>
    );
  }

  return (
    <div className="space-y-6">
      <IndicadorDePasos paso={paso} />
      <Marco>
        {paso === 0 && (
          <PasoCarga
            etapa={etapa.nombre}
            archivo={archivo}
            onArchivo={setArchivo}
            cargando={parse.isPending}
            onCargar={() => {
              if (!archivo) return;
              // Si falla (columnas, formato, tamaño) el toast global muestra el motivo exacto
              parse.mutate(archivo, {
                onSuccess: (datos) => {
                  setVista(datos);
                  setEdiciones({});
                  setPaso(1);
                },
              });
            }}
          />
        )}
        {paso === 1 && vista && (
          <PasoVerificacion
            filas={vista.filas}
            resumen={vista.resumen}
            ediciones={ediciones}
            onEditar={(fila, cantidad) =>
              setEdiciones((prev) => ({ ...prev, [fila]: cantidad }))
            }
            onVolver={() => setPaso(0)}
            onContinuar={() => setPaso(2)}
          />
        )}
        {paso === 2 && vista && (
          <PasoConfirmacion
            etapa={etapa.nombre}
            resumen={vista.resumen}
            guardando={guardar.isPending}
            onVolver={() => setPaso(1)}
            onConfirmar={confirmar}
          />
        )}
      </Marco>
    </div>
  );
}

const Marco = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-xl border p-4 sm:p-6">{children}</div>
);

function IndicadorDePasos({ paso }: { paso: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4" aria-label="Pasos">
      {PASOS.map((titulo, i) => (
        <li
          key={titulo}
          className="flex items-center gap-2"
          aria-current={i === paso ? "step" : undefined}
        >
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
              i < paso && "border-primary bg-primary text-primary-foreground",
              i === paso && "border-primary text-primary",
              i > paso && "text-muted-foreground",
            )}
          >
            {i < paso ? <CheckIcon className="size-4" /> : i + 1}
          </span>
          <span
            className={cn(
              "text-sm font-medium",
              i === paso ? "inline" : "hidden sm:inline",
              i > paso && "text-muted-foreground",
            )}
          >
            {titulo}
          </span>
          {i < PASOS.length - 1 && (
            <span className="hidden h-px w-8 bg-border sm:block" />
          )}
        </li>
      ))}
    </ol>
  );
}
