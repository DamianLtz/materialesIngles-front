/** Error de una llamada al back. `datos` trae el cuerpo de la respuesta (ej. errores de validación). */
export class ApiError extends Error {
  readonly status: number;
  readonly datos: unknown;

  constructor(status: number, datos: unknown) {
    super(mensajeDe(datos) ?? `Error ${status}`);
    this.status = status;
    this.datos = datos;
  }
}

function mensajeDe(datos: unknown): string | undefined {
  if (typeof datos !== "object" || datos === null || !("message" in datos)) {
    return undefined;
  }
  const { message } = datos;
  // Nest devuelve un string o, en errores de validación, una lista de mensajes
  if (Array.isArray(message)) return message.join(". ");
  return typeof message === "string" ? message : undefined;
}

type Metodo = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Llama a `/api{ruta}` con la cookie de sesión. Devuelve el JSON de la respuesta
 * (o undefined si viene vacía) y lanza ApiError si el status no es 2xx.
 */
export async function api<T>(
  ruta: string,
  opciones: { metodo?: Metodo; cuerpo?: unknown } = {},
): Promise<T> {
  const { metodo = "GET", cuerpo } = opciones;
  // Un FormData (subida de archivos) lo arma el navegador con su propio Content-Type
  const esArchivo = cuerpo instanceof FormData;
  const res = await fetch(`/api${ruta}`, {
    method: metodo,
    headers:
      cuerpo === undefined || esArchivo
        ? undefined
        : { "Content-Type": "application/json" },
    body:
      cuerpo === undefined
        ? undefined
        : esArchivo
          ? cuerpo
          : JSON.stringify(cuerpo),
  });

  const texto = await res.text();
  const datos: unknown = texto ? JSON.parse(texto) : undefined;
  if (!res.ok) throw new ApiError(res.status, datos);
  return datos as T;
}
