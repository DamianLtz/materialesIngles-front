import type { ReactNode } from "react";

/**
 * Título y descripción de cada pantalla. `acciones` (ej. el botón de crear) va a
 * la derecha del título; en mobile baja debajo de la descripción.
 */
export function EncabezadoPagina({
  titulo,
  descripcion,
  acciones,
}: {
  titulo: string;
  descripcion?: string;
  acciones?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-4xl font-bold">{titulo}</h1>
        {descripcion && (
          <p className="mt-1 text-lg text-muted-foreground">{descripcion}</p>
        )}
      </div>
      {acciones && <div className="flex shrink-0 gap-2">{acciones}</div>}
    </div>
  );
}
