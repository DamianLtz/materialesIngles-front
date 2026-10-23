/**
 * Fecha en formato dd/mm/aaaa. Acepta un timestamp ISO ("2026-03-07T15:00:00Z")
 * o una fecha sola ("2026-03-07"); esta última se toma como día local, porque
 * como UTC mostraría el día anterior en Argentina.
 */
export function formatearFecha(valor: string): string {
  const fecha = new Date(valor.includes("T") ? valor : `${valor}T00:00:00`);
  return fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
