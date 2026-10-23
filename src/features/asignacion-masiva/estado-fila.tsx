import { cn } from "@/lib/utils";
import type { EstadoFila } from "./api";

/** Etiqueta y colores del estado de cada fila de la vista previa. */
const ESTADOS_FILA: Record<EstadoFila, { etiqueta: string; clases: string }> = {
  nueva: {
    etiqueta: "Nueva",
    clases: "bg-green-100 text-green-800 border-green-200",
  },
  actualiza: {
    etiqueta: "Actualiza",
    clases: "bg-blue-100 text-blue-800 border-blue-200",
  },
  reemplaza: {
    etiqueta: "Reemplaza",
    clases: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  sin_cambios: {
    etiqueta: "Sin cambios",
    clases: "bg-gray-100 text-gray-600 border-gray-200",
  },
  error: {
    etiqueta: "Error",
    clases: "bg-red-100 text-red-800 border-red-200",
  },
};

export function EstadoFilaBadge({ estado }: { estado: EstadoFila }) {
  const { etiqueta, clases } = ESTADOS_FILA[estado];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        clases,
      )}
    >
      {etiqueta}
    </span>
  );
}
