import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface Props {
  /** Texto que hoy está en la URL. */
  valor?: string;
  onBuscar: (texto: string) => void;
  placeholder?: string;
  /** Milisegundos de espera tras la última tecla antes de buscar. */
  espera?: number;
}

/** Campo de búsqueda que avisa recién cuando se deja de escribir. */
export function Buscador({
  valor = "",
  onBuscar,
  placeholder = "Buscar...",
  espera = 400,
}: Props) {
  const [texto, setTexto] = useState(valor);

  useEffect(() => {
    if (texto.trim() === valor) return;
    const temporizador = setTimeout(() => onBuscar(texto), espera);
    return () => clearTimeout(temporizador);
    // onBuscar cambia en cada render y no debe reiniciar la espera
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto, valor, espera]);

  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-8"
      />
    </div>
  );
}
