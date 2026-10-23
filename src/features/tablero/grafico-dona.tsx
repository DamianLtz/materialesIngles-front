import { Cell, Pie, PieChart } from "recharts";
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

interface Porcion {
  label: string;
  cantidad: number;
}

const CONFIG = {
  cantidad: { label: "Reclamos" },
} satisfies ChartConfig;

/** Los colores de la dona del original, en el mismo orden */
const COLORES = [
  "var(--color-graph-rosa-4)",
  "var(--color-graph-verde-4)",
  "var(--color-graph-naranja-4)",
  "var(--color-graph-azul)",
];

/** Color de cada porción; "Otros" va en gris. */
const colorDe = (porcion: Porcion, indice: number) =>
  porcion.label === "Otros"
    ? "var(--muted-foreground)"
    : COLORES[indice % COLORES.length];

/** Dona con la lista al lado (la lista también sirve de leyenda y para lectores de pantalla). */
export function GraficoDona({
  titulo,
  descripcion,
  datos,
}: {
  titulo: string;
  descripcion: string;
  datos: Porcion[];
}) {
  const total = datos.reduce((suma, d) => suma + d.cantidad, 0);
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        <CardDescription>{descripcion}</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Sin datos para mostrar.
          </p>
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <ChartContainer
              config={CONFIG}
              className="aspect-square h-48 shrink-0"
            >
              <PieChart>
                <ChartTooltip
                  content={<TooltipDona total={total} datos={datos} />}
                />
                <Pie
                  data={datos}
                  dataKey="cantidad"
                  nameKey="label"
                  innerRadius={50}
                  outerRadius={80}
                  strokeWidth={2}
                >
                  {datos.map((d, i) => (
                    <Cell key={d.label} fill={colorDe(d, i)} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <ul className="w-full space-y-1.5 text-sm">
              {datos.map((d, i) => (
                <li key={d.label} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="size-3 shrink-0 rounded-sm"
                    style={{ backgroundColor: colorDe(d, i) }}
                  />
                  <span className="flex-1">{d.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {d.cantidad}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TooltipDona({
  active,
  payload,
  total,
  datos,
}: {
  active?: boolean;
  payload?: { payload: Porcion }[];
  total: number;
  datos: Porcion[];
}) {
  if (!active || !payload?.length) return null;
  const porcion = payload[0].payload;
  // Mismo color que la porción y la leyenda
  const color = colorDe(
    porcion,
    datos.findIndex((d) => d.label === porcion.label),
  );
  return (
    <div className="grid min-w-32 gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-[2px]"
            style={{ backgroundColor: color }}
          />
          <span className="text-muted-foreground">{porcion.label}</span>
        </div>
        <span className="font-semibold tabular-nums">
          {porcion.cantidad} ({Math.round((porcion.cantidad / total) * 100)}%)
        </span>
      </div>
    </div>
  );
}
