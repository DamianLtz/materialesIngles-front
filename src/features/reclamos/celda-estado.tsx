import { ChevronDownIcon, Loader2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useCambiarEstado, type ReclamoListado } from "./api";
import { ESTADOS, ESTADOS_EDITABLES } from "./estados";

const CLASES_BADGE =
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium";

/** Estado del reclamo como badge; con un menú para cambiarlo salvo que esté archivado. */
export function CeldaEstado({ reclamo }: { reclamo: ReclamoListado }) {
  const cambiar = useCambiarEstado(reclamo.id);
  const { etiqueta, clases } = ESTADOS[reclamo.estado];

  if (reclamo.estado === "historico") {
    return <span className={cn(CLASES_BADGE, clases)}>{etiqueta}</span>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={cambiar.isPending}
        aria-label={`Estado del reclamo ${reclamo.id}: ${etiqueta}. Cambiar`}
        className={cn(CLASES_BADGE, clases, "cursor-pointer")}
      >
        {etiqueta}
        {cambiar.isPending ? (
          <Loader2Icon className="size-3 animate-spin" />
        ) : (
          <ChevronDownIcon className="size-3" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {ESTADOS_EDITABLES.filter((e) => e !== reclamo.estado).map((estado) => (
          // Si falla, el toast global muestra el motivo (ej. ya estaba archivado)
          <DropdownMenuItem key={estado} onClick={() => cambiar.mutate(estado)}>
            {ESTADOS[estado].etiqueta}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
