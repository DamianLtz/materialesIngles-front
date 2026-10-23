export type Rol = "super_admin" | "admin" | "operador";

export interface Sesion {
  id: number;
  nombre: string;
  email: string;
  avatarUrl: string | null;
  rol: Rol;
  /** Mientras no haya permisos por rol, la exportación de escuelas se limita por email. */
  puedeExportarEscuelas: boolean;
}

/** El usuario tiene alguno de estos roles. super_admin pasa siempre, como en el back (@Roles). */
export function tieneRol(sesion: Sesion, roles: Rol[]): boolean {
  return sesion.rol === "super_admin" || roles.includes(sesion.rol);
}

/** Usuario de la sesión actual, o null si no hay sesión (el back responde 401). */
export async function getSesion(): Promise<Sesion | null> {
  const res = await fetch("/api/auth/me");
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Error al consultar la sesión (${res.status})`);
  return res.json();
}

/** Cierra todas las sesiones del usuario en el back (ver AuthService.cerrarSesiones). */
export async function cerrarSesion(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}
