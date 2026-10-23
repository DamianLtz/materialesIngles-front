import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api";

export type EstadoFila =
  "nueva" | "actualiza" | "reemplaza" | "sin_cambios" | "error";

/** Una fila del Excel ya validada por el back: qué pasaría con ella. */
export interface FilaValidada {
  fila: number;
  cueanexo: string;
  isbn: string;
  cantidad: number | null;
  /** Lo que decía la celda de cantidad (se muestra cuando es inválida). */
  cantidadRaw: string;
  escuela: string | null;
  libro: string | null;
  grado: string | null;
  catalogo: string | null;
  cantidadMaxima: number | null;
  estado: EstadoFila;
  errores: string[];
  libroAnterior: string | null;
  cantidadAnterior: number | null;
}

export interface ResumenFilas {
  total: number;
  nuevas: number;
  actualizan: number;
  reemplazan: number;
  sinCambios: number;
  errores: number;
}

export interface VistaPrevia {
  etapa: { id: number; nombre: string };
  filas: FilaValidada[];
  resumen: ResumenFilas;
}

/** Lo que se manda a guardar: el back vuelve a validar todo, no confía en esto. */
export interface FilaGuardar {
  fila: number;
  cueanexo: string;
  isbn: string;
  cantidad: number;
}

export interface ResultadoGuardado {
  nuevas: number;
  actualizadas: number;
  reemplazadas: number;
  sinCambios: number;
  omitidas: number;
  errores: {
    fila: number;
    cueanexo: string;
    isbn: string;
    errores: string[];
  }[];
}

const RECURSO = "asignacion-masiva";

/** Tope que también controla el back (5 MB y .xlsx): acá se avisa antes de subir. */
export const MAX_MB = 5;

export const etapaPublicadaQuery = queryOptions({
  queryKey: [RECURSO, "etapa"],
  queryFn: () =>
    api<{ etapa: { id: number; nombre: string } | null }>(
      "/back/mass-assignment/etapa",
    ),
});

/** Descargas directas: el navegador manda la cookie y el back responde el .xlsx. */
export const URL_PLANTILLA = "/api/back/mass-assignment/plantilla";
export const URL_ACTUALES = "/api/back/mass-assignment/actuales";

/** Lee y valida el archivo sin guardar nada. Los errores (400/409) los muestra el toast global. */
export function useParse() {
  return useMutation({
    mutationFn: (archivo: File) => {
      const cuerpo = new FormData();
      cuerpo.append("archivo", archivo);
      return api<VistaPrevia>("/back/mass-assignment/parse", {
        metodo: "POST",
        cuerpo,
      });
    },
  });
}

/** Guarda las filas válidas. Al terminar los pedidos cambiaron: se invalidan sus listados. */
export function useGuardar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (filas: FilaGuardar[]) =>
      api<ResultadoGuardado>("/back/mass-assignment/save", {
        metodo: "POST",
        cuerpo: { filas },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["pedidos"] });
    },
  });
}
