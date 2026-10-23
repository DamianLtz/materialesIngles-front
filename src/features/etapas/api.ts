import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/lib/api";
import { queryListado, type ParametrosListado } from "@/lib/paginacion";

export interface OfertaEtapa {
  id: number;
  gradoId: number;
  gradoNombre: string;
  catalogoId: number;
  catalogoNombre: string;
  cantidadMaxima: number;
}

/** Fila del listado: la etapa con la cantidad de escuelas y sus ofertas. */
export interface Etapa {
  id: number;
  nombre: string;
  /** Fechas aaaa-mm-dd (sin hora). */
  fechaInicio: string | null;
  fechaFin: string | null;
  leyenda: string | null;
  reclamoInicio: string | null;
  reclamoFin: string | null;
  reclamoLeyenda: string | null;
  visible: boolean;
  cantidadEscuelas: number;
  ofertas: OfertaEtapa[];
  createdAt: string;
  updatedAt: string;
}

/** Lo que necesita el formulario de edición. */
export interface EtapaDetalle extends Omit<
  Etapa,
  "cantidadEscuelas" | "ofertas"
> {
  /** `pedidos`: cuántos pedidos tiene la oferta; con pedidos no se puede quitar. */
  ofertas: (OfertaEtapa & { pedidos: number })[];
  escuelaIds: number[];
  /** Escuelas con pedidos en la etapa: no se pueden quitar. */
  escuelasConPedidos: number[];
}

export interface EscuelaDeEtapa {
  id: number;
  nombre: string;
  cueanexo: string;
  distrito: number;
}

export const CANTIDAD_MAXIMA_POR_DEFECTO = 100;
const CANTIDAD_MAXIMA_MIN = 1;
const CANTIDAD_MAXIMA_MAX = 1000;

const FECHA = /^\d{4}-\d{2}-\d{2}$/;
const fecha = z.string().refine((v) => v === "" || FECHA.test(v), {
  message: "La fecha no es válida (formato aaaa-mm-dd).",
});

/**
 * Mismas reglas y mensajes que valida el back (GuardarEtapaDto + reglas cruzadas del
 * servicio). Las fechas viajan como texto ("" = sin fecha).
 */
export const esquemaEtapa = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres.")
      .max(255, "El nombre no puede superar los 255 caracteres."),
    fechaInicio: fecha,
    fechaFin: fecha,
    leyenda: z
      .string()
      .trim()
      .max(1000, "La leyenda no puede superar los 1000 caracteres."),
    reclamoInicio: fecha,
    reclamoFin: fecha,
    reclamoLeyenda: z
      .string()
      .trim()
      .max(
        1000,
        "La leyenda de reclamos no puede superar los 1000 caracteres.",
      ),
    visible: z.boolean(),
    escuelaIds: z.array(z.number()),
    ofertas: z
      .array(
        z.object({
          gradoId: z.number(),
          catalogoId: z.number(),
          cantidadMaxima: z
            .number()
            .int("La cantidad máxima debe ser un número entero.")
            .min(
              CANTIDAD_MAXIMA_MIN,
              `La cantidad máxima debe ser ${CANTIDAD_MAXIMA_MIN} o mayor.`,
            )
            .max(
              CANTIDAD_MAXIMA_MAX,
              `La cantidad máxima no puede superar ${CANTIDAD_MAXIMA_MAX}.`,
            ),
        }),
      )
      .min(1, "Debe agregar al menos una combinación de grado y catálogo."),
  })
  .superRefine((d, ctx) => {
    const error = (path: string, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    for (const [inicio, fin, nombre] of [
      ["fechaInicio", "fechaFin", "selección"],
      ["reclamoInicio", "reclamoFin", "reclamo"],
    ] as const) {
      if (d[inicio] && !d[fin]) {
        error(fin, `Si carga inicio de ${nombre}, debe cargar también el fin.`);
      } else if (!d[inicio] && d[fin]) {
        error(
          inicio,
          `Si carga fin de ${nombre}, debe cargar también el inicio.`,
        );
      } else if (d[inicio] && d[fin] && d[fin] < d[inicio]) {
        error(fin, `El fin de ${nombre} debe ser igual o posterior al inicio.`);
      }
    }
    if (!d.fechaInicio && !d.reclamoInicio) {
      error(
        "fechaInicio",
        "Debe cargar al menos un período (selección o reclamo).",
      );
    }

    const pares = new Set(d.ofertas.map((o) => `${o.gradoId}-${o.catalogoId}`));
    if (pares.size !== d.ofertas.length) {
      error(
        "ofertas",
        "No se puede repetir la combinación de grado y catálogo.",
      );
    }
  });
export type DatosEtapa = z.infer<typeof esquemaEtapa>;

const RECURSO = "etapas";

export const etapasQuery = (params: ParametrosListado) =>
  queryListado<Etapa>(RECURSO, "/back/etapas", params);

export const etapaQuery = (id: number) =>
  queryOptions({
    queryKey: [RECURSO, "detalle", id],
    queryFn: () => api<EtapaDetalle>(`/back/etapas/${id}`),
  });

/** Las escuelas se piden recién cuando se abre el detalle (pueden ser miles). */
export const escuelasDeEtapaQuery = (id: number) =>
  queryOptions({
    queryKey: [RECURSO, "escuelas", id],
    queryFn: () => api<EscuelaDeEtapa[]>(`/back/etapas/${id}/escuelas`),
  });

/**
 * Alta (sin id) o edición (con id). Al terminar vuelve al listado. Los errores
 * (nombre repetido, algo con pedidos...) los muestra el toast global.
 */
export function useGuardarEtapa(id?: number) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (datos: DatosEtapa) =>
      id === undefined
        ? api<EtapaDetalle>("/back/etapas", { metodo: "POST", cuerpo: datos })
        : api<EtapaDetalle>(`/back/etapas/${id}`, {
            metodo: "PUT",
            cuerpo: datos,
          }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [RECURSO] });
      toast.success(
        id === undefined
          ? "La etapa se creó correctamente."
          : "La etapa se actualizó correctamente.",
      );
      void navigate({ to: "/back/etapas" });
    },
  });
}

/** Publica u oculta la etapa (publicar oculta la que estuviera publicada). */
export function useCambiarVisible(
  etapa: Pick<Etapa, "id" | "nombre" | "visible">,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api<{ id: number; visible: boolean }>(
        `/back/etapas/${etapa.id}/visible`,
        {
          metodo: "PATCH",
        },
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [RECURSO] });
      toast.success(
        `La etapa ${etapa.nombre} ha sido ${etapa.visible ? "ocultada" : "publicada"} correctamente.`,
      );
    },
  });
}

export function useEliminarEtapa(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api<void>(`/back/etapas/${id}`, { metodo: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [RECURSO] });
      toast.success("La etapa ha sido eliminada correctamente.");
    },
  });
}
