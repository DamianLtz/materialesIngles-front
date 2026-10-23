import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/lib/api";
import { queryListado, type ParametrosListado } from "@/lib/paginacion";

export interface Catalogo {
  id: number;
  nombre: string;
  cantidadLibros: number;
  createdAt: string;
  updatedAt: string;
}

export interface Libro {
  id: number;
  isbn: string;
  titulo: string;
  editorial: string;
  catalogoId: number;
  grado: { id: number; nombre: string };
  createdAt: string;
  updatedAt: string;
}

/** Mismas reglas que valida el back (GuardarCatalogoDto). */
export const esquemaCatalogo = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(255, "El nombre no puede superar los 255 caracteres."),
});
export type DatosCatalogo = z.infer<typeof esquemaCatalogo>;

/** Mismas reglas que valida el back (ActualizarLibroDto). El grado viaja como texto del <select>. */
export const esquemaLibro = z.object({
  titulo: z
    .string()
    .trim()
    .min(2, "El título debe tener al menos 2 caracteres.")
    .max(255, "El título no puede superar los 255 caracteres."),
  isbn: z
    .string()
    .trim()
    .min(1, "El ISBN es obligatorio.")
    .max(30, "El ISBN no puede superar los 30 caracteres."),
  editorial: z
    .string()
    .trim()
    .min(1, "La editorial es obligatoria.")
    .max(255, "La editorial no puede superar los 255 caracteres."),
  gradoId: z.string().min(1, "Seleccioná un grado."),
});
export type DatosLibro = z.infer<typeof esquemaLibro>;

// ── Consultas ────────────────────────────────────────────────────────────────

export const catalogosQuery = queryOptions({
  queryKey: ["catalogos", "lista"],
  queryFn: () => api<Catalogo[]>("/back/catalogos"),
});

export const catalogoQuery = (id: number) =>
  queryOptions({
    queryKey: ["catalogos", "detalle", id],
    queryFn: () => api<Catalogo>(`/back/catalogos/${id}`),
  });

export const librosQuery = (catalogoId: number, params: ParametrosListado) =>
  queryListado<Libro>(
    ["libros", catalogoId],
    `/back/catalogos/${catalogoId}/libros`,
    params,
  );

// ── Mutaciones de catálogos ──────────────────────────────────────────────────

/** Alta (sin id) o edición (con id). Los errores los muestra el toast global. */
export function useGuardarCatalogo(id?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datos: DatosCatalogo) =>
      id === undefined
        ? api<Catalogo>("/back/catalogos", { metodo: "POST", cuerpo: datos })
        : api<Catalogo>(`/back/catalogos/${id}`, {
            metodo: "PUT",
            cuerpo: datos,
          }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["catalogos"] });
      toast.success(
        id === undefined
          ? "Catálogo creado correctamente."
          : "Catálogo actualizado correctamente.",
      );
    },
  });
}

export function useEliminarCatalogo(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api<void>(`/back/catalogos/${id}`, { metodo: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["catalogos"] });
      toast.success("Catálogo eliminado correctamente.");
    },
  });
}

// ── Mutaciones de libros ─────────────────────────────────────────────────────

/** Los libros cambian la cantidad que muestran los catálogos, por eso se invalidan ambos. */
function useRefrescarLibros() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["libros"] }),
      queryClient.invalidateQueries({ queryKey: ["catalogos"] }),
    ]);
}

/** Alta (sin `id`, con `catalogoId`) o edición (con `id`). */
export function useGuardarLibro(opciones: { id?: number; catalogoId: number }) {
  const refrescar = useRefrescarLibros();
  const { id, catalogoId } = opciones;
  return useMutation({
    mutationFn: (datos: DatosLibro) => {
      const cuerpo = { ...datos, gradoId: Number(datos.gradoId) };
      return id === undefined
        ? api<Libro>("/back/libros", {
            metodo: "POST",
            cuerpo: { ...cuerpo, catalogoId },
          })
        : api<Libro>(`/back/libros/${id}`, { metodo: "PUT", cuerpo });
    },
    onSuccess: () => {
      void refrescar();
      toast.success(
        id === undefined
          ? "Libro creado correctamente."
          : "Libro actualizado correctamente.",
      );
    },
  });
}

export function useEliminarLibro(id: number) {
  const refrescar = useRefrescarLibros();
  return useMutation({
    mutationFn: () => api<void>(`/back/libros/${id}`, { metodo: "DELETE" }),
    onSuccess: () => {
      void refrescar();
      toast.success("Libro eliminado correctamente.");
    },
  });
}
