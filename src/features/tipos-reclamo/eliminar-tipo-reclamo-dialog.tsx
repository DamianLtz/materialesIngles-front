import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEliminarTipoReclamo, type TipoReclamo } from "./api";

interface Props {
  tipo: TipoReclamo;
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
}

export function EliminarTipoReclamoDialog({
  tipo,
  abierto,
  onCambiarAbierto,
}: Props) {
  const eliminar = useEliminarTipoReclamo(tipo.id);
  const cerrar = () => onCambiarAbierto(false);

  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar tipo de reclamo</DialogTitle>
          <DialogDescription>
            ¿Seguro que querés eliminar <strong>{tipo.nombre}</strong>? No se
            puede eliminar si hay reclamos de este tipo.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            color="ghost"
            onClick={cerrar}
            disabled={eliminar.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            color="destructive"
            disabled={eliminar.isPending}
            // Si falla (ej. está en uso) el toast global explica por qué y el diálogo queda abierto
            onClick={() => eliminar.mutate(undefined, { onSuccess: cerrar })}
          >
            {eliminar.isPending && <Loader2Icon className="animate-spin" />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
