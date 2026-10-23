import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import type { PuntoGrafico } from "./api";

const ALTO_FILA = 34;

/** Barras horizontales de ejemplares; el tooltip suma cuántos pedidos son. */
export function GraficoBarras({
  titulo,
  descripcion,
  datos,
  color,
}: {
  titulo: string;
  descripcion: string;
  datos: PuntoGrafico[];
  /** Cada gráfico tiene su color, como en el original (ej. "var(--color-graph-mostaza)") */
  color: string;
}) {
  const config = {
    ejemplares: { label: "Ejemplares", color },
  } satisfies ChartConfig;

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        <CardDescription>{descripcion}</CardDescription>
      </CardHeader>
      <CardContent>
        {datos.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Sin datos para mostrar.
          </p>
        ) : (
          <ChartContainer
            config={config}
            className="aspect-auto w-full"
            style={{ height: datos.length * ALTO_FILA + 28 }}
          >
            <BarChart
              data={datos}
              layout="vertical"
              // Lugar a la derecha para el número al final de la barra
              margin={{ left: 0, right: 40 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="label"
                type="category"
                width={110}
                tickLine={false}
                axisLine={false}
                interval={0}
                tickFormatter={(v: string) =>
                  v.length > 16 ? `${v.slice(0, 15)}…` : v
                }
              />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={<TooltipLibros color={color} />}
              />
              <Bar
                dataKey="ejemplares"
                fill="var(--color-ejemplares)"
                radius={4}
                barSize={20}
              >
                <LabelList
                  dataKey="ejemplares"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

function TooltipLibros({
  active,
  payload,
  color,
}: {
  active?: boolean;
  payload?: { payload: PuntoGrafico }[];
  color: string;
}) {
  if (!active || !payload?.length) return null;
  const { label, ejemplares, pedidos } = payload[0].payload;
  return (
    <div className="grid min-w-32 gap-1 rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-[2px]"
            style={{ backgroundColor: color }}
          />
          <span className="text-muted-foreground">{label}</span>
        </div>
        <span className="font-semibold tabular-nums">{ejemplares}</span>
      </div>
      <p className="text-muted-foreground">
        {ejemplares === 1 ? "ejemplar" : "ejemplares"} en {pedidos}{" "}
        {pedidos === 1 ? "pedido" : "pedidos"}
      </p>
    </div>
  );
}
