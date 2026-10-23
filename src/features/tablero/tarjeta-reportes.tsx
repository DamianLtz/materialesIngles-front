import {
  DownloadIcon,
  FileClockIcon,
  FileSpreadsheetIcon,
  FileWarningIcon,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tieneRol, type Sesion } from "@/lib/sesion";
import { cn } from "@/lib/utils";
import {
  urlExportarPedidos,
  urlExportarPendientes,
  urlExportarReclamos,
} from "./api";

interface Reporte {
  titulo: string;
  detalle: string;
  url: string;
  icono: LucideIcon;
  colorIcono: string;
}

/** Descargas de la etapa elegida. Pedidos y pendientes: super_admin y admin; reclamos: los 3 roles. */
export function TarjetaReportes({
  etapaId,
  sesion,
}: {
  etapaId: number;
  sesion: Sesion;
}) {
  const gestiona = tieneRol(sesion, ["admin"]);
  const reportes: Reporte[] = [
    ...(gestiona
      ? [
          {
            titulo: "Selección de libros",
            detalle: "Detalle completo de la selección por escuela",
            url: urlExportarPedidos(etapaId),
            icono: FileSpreadsheetIcon,
            colorIcono: "text-graph-azul",
          },
          {
            titulo: "Escuelas pendientes",
            detalle: "Escuelas que no completaron la selección y qué les falta",
            url: urlExportarPendientes(etapaId),
            icono: FileClockIcon,
            colorIcono: "text-graph-naranja-4",
          },
        ]
      : []),
    {
      titulo: "Reclamos",
      detalle: "Detalle completo de los reclamos por escuela",
      url: urlExportarReclamos(etapaId),
      icono: FileWarningIcon,
      colorIcono: "text-red-500",
    },
  ];

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Reportes</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {reportes.map((r) => (
          // Como en el original, toda la fila es el link. Descarga directa:
          // el navegador manda la cookie y el back responde el .xlsx
          <a
            key={r.titulo}
            href={r.url}
            aria-label={`Descargar Excel de ${r.titulo.toLowerCase()}`}
            className="flex items-center justify-between gap-4 rounded-md px-4 py-2 outline outline-slate-200 transition-colors hover:outline-azul-600"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-sm bg-muted p-2">
                <r.icono className={cn("size-4", r.colorIcono)} />
              </div>
              <div>
                <p className="font-semibold">{r.titulo}</p>
                <p className="text-sm text-slate-600">{r.detalle}</p>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-sm p-2">
              <DownloadIcon className="size-4 text-graph-azul" />
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
