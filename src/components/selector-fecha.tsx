import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { es } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatearFecha } from "@/lib/formato";

interface Props {
  id?: string;
  /** Fecha como "aaaa-mm-dd", o "" si no hay. */
  valor: string;
  onCambiar: (valor: string) => void;
  placeholder?: string;
  deshabilitado?: boolean;
  invalido?: boolean;
}

/** "aaaa-mm-dd" a Date local. new Date("aaaa-mm-dd") sería UTC y mostraría el día anterior. */
function aFecha(valor: string): Date | undefined {
  if (!valor) return undefined;
  const [anio, mes, dia] = valor.split("-").map(Number);
  return new Date(anio, mes - 1, dia);
}

/** Date local a "aaaa-mm-dd". */
function aTexto(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/**
 * Elige una fecha. En el celular usa el selector nativo del teléfono (`<input type="date">`);
 * en escritorio, un botón que abre un calendario en español.
 */
export function SelectorFecha({
  id,
  valor,
  onCambiar,
  placeholder = "dd/mm/aaaa",
  deshabilitado,
  invalido,
}: Props) {
  const esMobile = useIsMobile();
  const [abierto, setAbierto] = useState(false);

  if (esMobile) {
    return (
      <Input
        id={id}
        type="date"
        value={valor}
        disabled={deshabilitado}
        aria-invalid={invalido}
        onChange={(e) => onCambiar(e.target.value)}
      />
    );
  }

  const seleccionada = aFecha(valor);
  return (
    <Popover open={abierto} onOpenChange={setAbierto}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            color="outline"
            disabled={deshabilitado}
            aria-invalid={invalido}
            className="w-full justify-start font-normal"
          />
        }
      >
        <CalendarIcon />
        {valor ? (
          formatearFecha(valor)
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto gap-2 p-0">
        <Calendar
          mode="single"
          locale={es}
          captionLayout="dropdown"
          selected={seleccionada}
          defaultMonth={seleccionada}
          onSelect={(fecha) => {
            onCambiar(fecha ? aTexto(fecha) : "");
            setAbierto(false);
          }}
        />
        {valor && (
          <div className="border-t p-2">
            <Button
              type="button"
              color="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                onCambiar("");
                setAbierto(false);
              }}
            >
              Limpiar
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
