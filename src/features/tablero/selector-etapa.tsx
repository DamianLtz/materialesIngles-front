import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EtapaTablero } from "./api";

/** Elige la etapa que muestra el tablero (la publicada va primero). */
export function SelectorEtapa({
  etapas,
  etapaId,
  onCambiar,
}: {
  etapas: EtapaTablero[];
  etapaId: number;
  onCambiar: (etapaId: number) => void;
}) {
  const etiquetas = Object.fromEntries(
    etapas.map((e) => [
      String(e.id),
      e.visible ? `${e.nombre} (publicada)` : e.nombre,
    ]),
  );
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="tablero-etapa" className="text-sm font-medium">
        Etapa:
      </label>
      <Select
        items={etiquetas}
        value={String(etapaId)}
        onValueChange={(valor) => valor && onCambiar(Number(valor))}
      >
        <SelectTrigger id="tablero-etapa" className="min-w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {etapas.map((e) => (
            <SelectItem key={e.id} value={String(e.id)}>
              {etiquetas[String(e.id)]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
