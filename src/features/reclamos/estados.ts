export type EstadoReclamo =
  "pendiente" | "en_proceso" | "resuelto" | "rechazado" | "historico";

/** Etiqueta y colores (badge) de cada estado. Los mismos que el original. */
export const ESTADOS: Record<
  EstadoReclamo,
  { etiqueta: string; clases: string }
> = {
  pendiente: {
    etiqueta: "Pendiente",
    clases: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  en_proceso: {
    etiqueta: "En proceso",
    clases: "bg-blue-100 text-blue-800 border-blue-200",
  },
  resuelto: {
    etiqueta: "Resuelto",
    clases: "bg-green-100 text-green-800 border-green-200",
  },
  rechazado: {
    etiqueta: "Rechazado",
    clases: "bg-red-100 text-red-800 border-red-200",
  },
  historico: {
    etiqueta: "Histórico",
    clases: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

/** Los que se pueden elegir a mano: "histórico" solo lo pone la acción de archivar. */
export const ESTADOS_EDITABLES: EstadoReclamo[] = [
  "pendiente",
  "en_proceso",
  "resuelto",
  "rechazado",
];

export const ESTADOS_TODOS = Object.keys(ESTADOS) as EstadoReclamo[];

export const esEstado = (valor: unknown): valor is EstadoReclamo =>
  typeof valor === "string" && valor in ESTADOS;
