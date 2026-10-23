import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** Un número grande con su título y un detalle debajo. */
export function TarjetaKpi({
  titulo,
  valor,
  detalle,
  children,
}: {
  titulo: string;
  valor: ReactNode;
  detalle?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-3xl font-bold tabular-nums">{valor}</p>
        {children}
        {detalle && <p className="text-sm text-muted-foreground">{detalle}</p>}
      </CardContent>
    </Card>
  );
}
