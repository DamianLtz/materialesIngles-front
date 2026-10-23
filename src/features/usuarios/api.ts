import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "@/lib/api";
import { queryListado, type ParametrosListado } from "@/lib/paginacion";
import type { Sesion } from "@/lib/sesion";

export type Rol = Sesion["rol"];

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Orden en el que se ofrecen los roles y cómo se nombran en pantalla. */
export const ROLES: { valor: Rol; etiqueta: string }[] = [
  { valor: "super_admin", etiqueta: "Super admin" },
  { valor: "admin", etiqueta: "Admin" },
  { valor: "operador", etiqueta: "Operador" },
];

export const etiquetaRol = (rol: Rol) =>
  ROLES.find((r) => r.valor === rol)?.etiqueta ?? rol;

/** Mismas reglas que valida el back (CrearUsuarioDto / ActualizarUsuarioDto). */
export const esquemaUsuario = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(255, "El nombre no puede superar los 255 caracteres."),
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio.")
    .email("Ingresá un email válido.")
    .max(255, "El email no puede superar los 255 caracteres."),
  rol: z.enum(["super_admin", "admin", "operador"], {
    message: "El rol no es válido.",
  }),
  /** Solo se envía al editar; al crear el usuario nace activo. */
  activo: z.boolean(),
});
export type DatosUsuario = z.infer<typeof esquemaUsuario>;

const RECURSO = "usuarios";

export const usuariosQuery = (params: ParametrosListado) =>
  queryListado<Usuario>(RECURSO, "/back/usuarios", params);

/** Alta (sin id) o edición (con id). Los errores los muestra el toast global. */
export function useGuardarUsuario(id?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ activo, ...datos }: DatosUsuario) =>
      id === undefined
        ? api<Usuario>("/back/usuarios", { metodo: "POST", cuerpo: datos })
        : api<Usuario>(`/back/usuarios/${id}`, {
            metodo: "PUT",
            cuerpo: { ...datos, activo },
          }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [RECURSO] });
      toast.success(
        id === undefined
          ? "Usuario creado correctamente."
          : "Usuario actualizado correctamente.",
      );
    },
  });
}

export function useEliminarUsuario(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api<void>(`/back/usuarios/${id}`, { metodo: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [RECURSO] });
      toast.success("Usuario dado de baja correctamente.");
    },
  });
}

export function useCerrarSesionesUsuario(id: number) {
  return useMutation({
    mutationFn: () =>
      api<void>(`/back/usuarios/${id}/cerrar-sesiones`, { metodo: "POST" }),
    onSuccess: () => toast.success("Se cerraron las sesiones del usuario."),
  });
}
