import { formatearFecha } from "@/lib/formato";
import { cn } from "@/lib/utils";
import type { Momento } from "./api";

const MOMENTOS: Record<Momento, { etiqueta: string; clases: string }> = {
  seleccion: {
    etiqueta: "En selección",
    clases: "border-green-300 bg-green-50 text-green-800",
  },
  entre_periodos: {
    etiqueta: "Entre períodos",
    clases: "border-amber-300 bg-amber-50 text-amber-800",
  },
  reclamo: {
    etiqueta: "En reclamo",
    clases: "border-blue-300 bg-blue-50 text-blue-800",
  },
  finalizada: {
    etiqueta: "Finalizada",
    clases: "border-border bg-muted text-muted-foreground",
  },
  proxima: {
    etiqueta: "Próxima",
    clases: "border-purple-300 bg-purple-50 text-purple-800",
  },
};

/** En qué momento está la etapa hoy; "próxima" y "entre períodos" dicen cuándo empieza lo que sigue. */
export function MomentoBadge({
  momento,
  proximaFecha,
}: {
  momento: Momento;
  proximaFecha: string | null;
}) {
  const { etiqueta, clases } = MOMENTOS[momento];
  const texto =
    proximaFecha && momento === "proxima"
      ? `${etiqueta}: empieza el ${formatearFecha(proximaFecha)}`
      : proximaFecha && momento === "entre_periodos"
        ? `${etiqueta}: el reclamo empieza el ${formatearFecha(proximaFecha)}`
        : etiqueta;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        clases,
      )}
    >
      {texto}
    </span>
  );
}
