import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResultadoGuardado, ResumenFilas } from "./api";

interface Props {
  etapa: string;
  resumen: ResumenFilas;
  guardando: boolean;
  onVolver: () => void;
  onConfirmar: () => void;
}

export function PasoConfirmacion({
  etapa,
  resumen,
  guardando,
  onVolver,
  onConfirmar,
}: Props) {
  const modifican = resumen.nuevas + resumen.actualizan + resumen.reemplazan;
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Confirmar importación</h2>
        <p className="text-sm text-muted-foreground">
          Paso 3 de 3: revisá el resumen final antes de guardar.
        </p>
      </div>

      <div className="rounded-lg border p-4 text-sm">
        <p>
          Etapa: <strong>{etapa}</strong>
        </p>
        <ul className="mt-2 space-y-1">
          <li>
            <strong>{resumen.nuevas}</strong> pedidos nuevos
          </li>
          <li>
            <strong>{resumen.actualizan}</strong> pedidos con la cantidad
            actualizada
          </li>
          <li>
            <strong>{resumen.reemplazan}</strong> pedidos con el libro
            reemplazado (el anterior queda en el historial)
          </li>
          <li>
            <strong>{resumen.sinCambios}</strong> filas sin cambios
          </li>
        </ul>
      </div>

      {resumen.errores > 0 && (
        <div
          role="alert"
          className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900"
        >
          Se van a omitir <strong>{resumen.errores}</strong>{" "}
          {resumen.errores === 1 ? "fila" : "filas"} con errores. Podés
          corregirlas y cargarlas después en otro archivo.
        </div>
      )}

      <div className="flex justify-between">
        <Button
          type="button"
          color="outline"
          disabled={guardando}
          onClick={onVolver}
        >
          Volver
        </Button>
        <Button
          type="button"
          disabled={guardando || modifican + resumen.sinCambios === 0}
          onClick={onConfirmar}
        >
          {guardando && <Loader2Icon className="animate-spin" />}
          {guardando ? "Importando…" : "Confirmar e importar"}
        </Button>
      </div>
    </div>
  );
}

/** Lo que realmente pasó: los números los devuelve el servidor al guardar. */
export function PantallaExito({
  etapa,
  resultado,
  onOtra,
}: {
  etapa: string;
  resultado: ResultadoGuardado;
  onOtra: () => void;
}) {
  return (
    <div className="space-y-4 text-center">
      <CheckCircle2Icon className="mx-auto size-12 text-green-600" />
      <div>
        <h2 className="text-lg font-semibold">Operación exitosa</h2>
        <p className="text-sm text-muted-foreground">
          La importación se completó en <strong>{etapa}</strong>.
        </p>
      </div>
      <ul className="mx-auto w-fit space-y-1 text-left text-sm">
        <li>
          <strong>{resultado.nuevas}</strong> pedidos nuevos
        </li>
        <li>
          <strong>{resultado.actualizadas}</strong> con la cantidad actualizada
        </li>
        <li>
          <strong>{resultado.reemplazadas}</strong> con el libro reemplazado
        </li>
        <li>
          <strong>{resultado.sinCambios}</strong> sin cambios
        </li>
        {resultado.omitidas > 0 && (
          <li className="text-destructive">
            <strong>{resultado.omitidas}</strong> omitidas por errores
          </li>
        )}
      </ul>
      {resultado.errores.length > 0 && (
        <ul className="mx-auto max-w-xl space-y-1 rounded-lg border p-3 text-left text-xs text-muted-foreground">
          {resultado.errores.slice(0, 10).map((e) => (
            <li key={e.fila}>
              Fila {e.fila} ({e.cueanexo}): {e.errores.join(" ")}
            </li>
          ))}
          {resultado.errores.length > 10 && (
            <li>… y {resultado.errores.length - 10} más.</li>
          )}
        </ul>
      )}
      <Button type="button" onClick={onOtra}>
        Realizar otra importación
      </Button>
    </div>
  );
}
