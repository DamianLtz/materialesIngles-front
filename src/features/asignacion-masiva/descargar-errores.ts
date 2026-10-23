import writeXlsxFile from "write-excel-file/browser";
import type { FilaValidada } from "./api";

/**
 * Baja un Excel con las filas que tuvieron error, en el mismo formato que la plantilla
 * (cueanexo, isbn, cantidad) más una columna "errores". Se corrige y se vuelve a subir:
 * la columna extra se ignora al leer.
 */
export async function descargarErrores(filas: FilaValidada[]): Promise<void> {
  const conError = filas.filter((f) => f.estado === "error");
  const encabezado = ["cueanexo", "isbn", "cantidad", "errores"].map(
    (value) => ({
      value,
      fontWeight: "bold" as const,
    }),
  );
  await writeXlsxFile(
    [
      encabezado,
      ...conError.map((f) => [
        { value: f.cueanexo },
        { value: f.isbn },
        { value: f.cantidadRaw },
        { value: f.errores.join(" ") },
      ]),
    ],
    {
      columns: [{ width: 14 }, { width: 18 }, { width: 10 }, { width: 80 }],
    },
  ).toFile("filas-con-errores.xlsx");
}
