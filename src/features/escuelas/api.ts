import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/lib/api";
import {
  armarQuery,
  queryListado,
  type ParametrosListado,
} from "@/lib/paginacion";

export interface Escuela {
  id: number;
  cueanexo: string;
  nombre: string;
  distrito: number;
  descripcion: string | null;
  calle: string;
  altura: number;
  codigoPostal: string;
  /** Participa de una etapa publicada: solo entonces se le pueden asignar libros. */
  participaEnEtapaActiva: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Lo mínimo para elegir una escuela en otros formularios (ej. asignarlas a una etapa). */
export interface OpcionEscuela {
  id: number;
  nombre: string;
  cueanexo: string;
  distrito: number;
}

/** Todas las escuelas sin paginar (son miles): se filtran y paginan en el navegador. */
export const escuelasOpcionesQuery = queryOptions({
  queryKey: ["escuelas", "opciones"],
  queryFn: () => api<OpcionEscuela[]>("/back/escuelas/opciones"),
});

/**
 * Mismas reglas que valida el back (GuardarEscuelaDto). Distrito y número viajan
 * como texto desde los inputs y se convierten a número al enviar.
 */
export const esquemaEscuela = z.object({
  cueanexo: z
    .string()
    .trim()
    .min(1, "El CUE/Anexo es obligatorio.")
    .regex(/^\d{1,20}$/, "El CUE/Anexo debe tener solo números (hasta 20)."),
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(255, "El nombre no puede superar los 255 caracteres."),
  distrito: z
    .string()
    .trim()
    .regex(/^\d+$/, "El distrito debe ser un número.")
    .refine(
      (v) => Number(v) >= 1 && Number(v) <= 99,
      "El distrito debe estar entre 1 y 99.",
    ),
  descripcion: z
    .string()
    .trim()
    .max(500, "La descripción no puede superar los 500 caracteres."),
  calle: z
    .string()
    .trim()
    .min(2, "La calle debe tener al menos 2 caracteres.")
    .max(255, "La calle no puede superar los 255 caracteres."),
  altura: z
    .string()
    .trim()
    .regex(/^\d+$/, "El número debe ser entero (0 si no tiene).")
    .refine((v) => Number(v) <= 999999, "El número no puede superar 999999."),
  codigoPostal: z
    .string()
    .trim()
    .min(1, "El código postal es obligatorio.")
    .max(10, "El código postal no puede superar los 10 caracteres."),
});
export type DatosEscuela = z.infer<typeof esquemaEscuela>;

const RECURSO = "escuelas";

export const escuelasQuery = (params: ParametrosListado) =>
  queryListado<Escuela>(RECURSO, "/back/escuelas", params);

/** Dirección de descarga del Excel; el navegador la baja con la cookie de sesión. */
export const urlExportarEscuelas = (search?: string) =>
  `/api/back/escuelas/exportar${armarQuery({ search })}`;

/** Alta (sin id) o edición (con id). Los errores los muestra el toast global. */
export function useGuardarEscuela(id?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: DatosEscuela) => {
      const cuerpo = {
        ...datos,
        distrito: Number(datos.distrito),
        altura: Number(datos.altura),
      };
      return id === undefined
        ? api<Escuela>("/back/escuelas", { metodo: "POST", cuerpo })
        : api<Escuela>(`/back/escuelas/${id}`, { metodo: "PUT", cuerpo });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [RECURSO] });
      toast.success(
        id === undefined
          ? "Escuela creada correctamente."
          : "Escuela actualizada correctamente.",
      );
    },
  });
}

export function useEliminarEscuela(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api<void>(`/back/escuelas/${id}`, { metodo: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [RECURSO] });
      toast.success("Escuela eliminada correctamente.");
    },
  });
}
