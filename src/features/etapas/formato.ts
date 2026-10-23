import { formatearFecha } from "@/lib/formato";

/** "01/10/2026 al 31/10/2026", o "—" si el período no está cargado. */
export function textoPeriodo(
  inicio: string | null,
  fin: string | null,
): string {
  return inicio && fin
    ? `${formatearFecha(inicio)} al ${formatearFecha(fin)}`
    : "—";
}
