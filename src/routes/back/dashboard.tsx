import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { EncabezadoPagina } from "@/components/encabezado-pagina";
import { Progress } from "@/components/ui/progress";
import {
  etapasTableroQuery,
  resumenQuery,
  type ResumenTablero,
} from "@/features/tablero/api";
import { GraficoBarras } from "@/features/tablero/grafico-barras";
import { GraficoDona } from "@/features/tablero/grafico-dona";
import { MomentoBadge } from "@/features/tablero/momento-badge";
import { SelectorEtapa } from "@/features/tablero/selector-etapa";
import { TarjetaKpi } from "@/features/tablero/tarjeta-kpi";
import { TarjetaReportes } from "@/features/tablero/tarjeta-reportes";
import { tieneRol, type Sesion } from "@/lib/sesion";

interface BusquedaTablero {
  etapaId?: number;
}

export const Route = createFileRoute("/back/dashboard")({
  validateSearch: (search): BusquedaTablero => {
    const etapaId = Number(search.etapaId);
    return {
      etapaId: Number.isInteger(etapaId) && etapaId > 0 ? etapaId : undefined,
    };
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    Promise.all([
      queryClient.query({ ...resumenQuery(deps.etapaId), staleTime: "static" }),
      queryClient.query({ ...etapasTableroQuery, staleTime: "static" }),
    ]),
  component: Pagina,
});

function Pagina() {
  const navigate = useNavigate();
  const { sesion } = Route.useRouteContext();
  const { etapaId } = Route.useSearch();
  const { data: resumen } = useQuery(resumenQuery(etapaId));
  const { data: etapas = [] } = useQuery(etapasTableroQuery);

  const encabezado = (
    <EncabezadoPagina
      titulo="Tablero"
      descripcion="Seguimiento de la selección de libros y de los reclamos"
    />
  );

  if (!resumen) {
    return (
      <div className="space-y-4">
        {encabezado}
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="text-lg font-medium">Todavía no hay etapas cargadas.</p>
          {tieneRol(sesion, ["admin"]) && (
            <p className="mt-2 text-sm text-muted-foreground">
              <Link
                to="/back/etapas/crear"
                className="font-medium text-primary underline underline-offset-4"
              >
                Crear la primera etapa
              </Link>
            </p>
          )}
        </div>
      </div>
    );
  }

  const { etapa, momento, proximaFecha, metricas } = resumen;

  return (
    <div className="space-y-4">
      {encabezado}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SelectorEtapa
          etapas={etapas}
          etapaId={etapa.id}
          onCambiar={(id) =>
            void navigate({ to: ".", search: { etapaId: id }, replace: true })
          }
        />
        <MomentoBadge momento={momento} proximaFecha={proximaFecha} />
      </div>

      {metricas.escuelas === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="text-lg font-medium">
            Esta etapa todavía no tiene escuelas asignadas.
          </p>
        </div>
      ) : (
        <Contenido resumen={resumen} sesion={sesion} />
      )}
    </div>
  );
}

function Contenido({
  resumen,
  sesion,
}: {
  resumen: ResumenTablero;
  sesion: Sesion;
}) {
  const { metricas: m, graficos: g, etapa: e } = resumen;
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <TarjetaKpi
          titulo="Avance de la selección"
          valor={`${m.porcentaje}%`}
          detalle={`${m.pedidos} de ${m.pedidosEsperados} ${m.pedidosEsperados === 1 ? "pedido esperado" : "pedidos esperados"}`}
        >
          <Progress value={m.porcentaje} aria-label="Avance de la selección">
            <span className="sr-only">{m.porcentaje}% de avance</span>
          </Progress>
        </TarjetaKpi>
        <TarjetaKpi
          titulo="Escuelas completas"
          valor={m.escuelasCompletas}
          detalle={`de ${m.escuelas} ${m.escuelas === 1 ? "escuela" : "escuelas"}`}
        />
        <TarjetaKpi
          titulo="Escuelas parciales"
          valor={m.escuelasParciales}
          detalle="Con pedido en algunas ofertas"
        />
        <TarjetaKpi
          titulo="Escuelas sin pedidos"
          valor={m.escuelasSinPedidos}
          detalle="Todavía no eligieron"
        />
        <TarjetaKpi
          titulo="Pedidos registrados"
          valor={m.pedidos}
          detalle={`${m.ejemplares} ${m.ejemplares === 1 ? "ejemplar" : "ejemplares"}`}
        />
        <TarjetaKpi
          titulo="Reclamos"
          valor={m.reclamos.total}
          detalle={`${m.reclamos.pendiente} pendientes · ${m.reclamos.enProceso} en proceso · ${m.reclamos.resuelto} resueltos · ${m.reclamos.rechazado} rechazados · ${m.reclamos.historico} archivados`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Ordenado por alto: cada fila junta tarjetas parecidas, así la grilla no
            estira una corta al alto de una larga. Las de alto variable van solas. */}
        <GraficoDona
          titulo="Reclamos por tipo"
          descripcion="Distribución de reclamos recibidos"
          datos={g.reclamosPorTipo}
        />
        <TarjetaReportes etapaId={e.id} sesion={sesion} />
        {/* Colores y descripciones del original; "por catálogo" no existía allá */}
        <GraficoBarras
          titulo="Libros por grado"
          descripcion="Distribución de libros solicitados por grado escolar"
          datos={g.porGrado}
          color="var(--color-graph-mostaza)"
        />
        <GraficoBarras
          titulo="Libros por editorial"
          descripcion="Cantidad de libros por casa editorial"
          datos={g.porEditorial}
          color="var(--color-graph-naranja-3)"
        />
        {/* Oculto hasta confirmar si a alguien le sirve (el back sigue mandando
            g.porCatalogo): para volver a mostrarlo, descomentar.
        <div className="xl:col-span-2">
          <GraficoBarras
            titulo="Libros por catálogo"
            descripcion="Cantidad de libros por catálogo"
            datos={g.porCatalogo}
            color="var(--color-graph-verde-5)"
          />
        </div> */}
        <div className="xl:col-span-2">
          <GraficoBarras
            titulo="Libros por comuna"
            descripcion="Distribución de solicitudes por comuna"
            datos={g.porComuna}
            color="var(--color-graph-azul)"
          />
        </div>
      </div>
    </div>
  );
}
