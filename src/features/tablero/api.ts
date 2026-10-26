import { queryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type Momento =
  "seleccion" | "entre_periodos" | "reclamo" | "finalizada" | "proxima";

export interface EtapaTablero {
  id: number;
  nombre: string;
  visible: boolean;
}

export interface PuntoGrafico {
  label: string;
  ejemplares: number;
  pedidos: number;
}

export interface ResumenTablero {
  etapa: EtapaTablero & {
    fechaInicio: string | null;
    fechaFin: string | null;
    reclamoInicio: string | null;
    reclamoFin: string | null;
  };
  momento: Momento;
  /** Cuándo empieza lo próximo ("proxima" y "entre_periodos"). */
  proximaFecha: string | null;
  metricas: {
    escuelas: number;
    ofertas: number;
    pedidosEsperados: number;
    pedidos: number;
    ejemplares: number;
    porcentaje: number;
    escuelasCompletas: number;
    escuelasParciales: number;
    escuelasSinPedidos: number;
    reclamos: {
      total: number;
      pendiente: number;
      enProceso: number;
      resuelto: number;
      rechazado: number;
      historico: number;
    };
  };
  graficos: {
    porGrado: PuntoGrafico[];
    porCatalogo: PuntoGrafico[];
    porEditorial: PuntoGrafico[];
    porComuna: PuntoGrafico[];
    reclamosPorTipo: { label: string; cantidad: number }[];
  };
}

const RECURSO = "tablero";

export const etapasTableroQuery = queryOptions({
  queryKey: [RECURSO, "etapas"],
  queryFn: () => api<EtapaTablero[]>("/back/tablero/etapas"),
});

/** Sin `etapaId` el back elige la publicada. Devuelve null si todavía no hay etapas. */
export const resumenQuery = (etapaId?: number) =>
  queryOptions({
    queryKey: [RECURSO, "resumen", etapaId ?? null],
    queryFn: async () => {
      const ruta =
        etapaId === undefined
          ? "/back/tablero"
          : `/back/tablero?etapaId=${etapaId}`;
      // Sin etapas el back responde vacío (api() devuelve undefined) y react-query no admite undefined
      return (await api<ResumenTablero | undefined>(ruta)) ?? null;
    },
  });

/** Descargas: el navegador las baja con la cookie de sesión. */
export const urlExportarPedidos = (etapaId: number) =>
  `/api/back/pedidos/exportar/${etapaId}`;
export const urlExportarReclamos = (etapaId: number) =>
  `/api/back/reclamos/exportar/${etapaId}`;
export const urlExportarPendientes = (etapaId: number) =>
  `/api/back/tablero/exportar-pendientes/${etapaId}`;
