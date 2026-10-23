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
import { useEliminarEtapa, type Etapa } from "./api";

interface Props {
  etapa: Etapa;
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
}

export function EliminarEtapaDialog({
  etapa,
  abierto,
  onCambiarAbierto,
}: Props) {
  const eliminar = useEliminarEtapa(etapa.id);
  const cerrar = () => onCambiarAbierto(false);

  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar la etapa?</DialogTitle>
          <DialogDescription>
            La etapa <strong>{etapa.nombre}</strong> será eliminada. No se puede
            eliminar si alguna escuela ya hizo pedidos en ella.
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
            // Si falla (ej. tiene pedidos) el toast global explica por qué y el diálogo queda abierto
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
