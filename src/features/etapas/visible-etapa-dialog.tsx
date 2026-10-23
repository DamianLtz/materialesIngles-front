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
import { useCambiarVisible, type Etapa } from "./api";

interface Props {
  etapa: Etapa;
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
}

/** Confirma publicar u ocultar. Solo una etapa puede estar publicada a la vez. */
export function VisibleEtapaDialog({
  etapa,
  abierto,
  onCambiarAbierto,
}: Props) {
  const cambiar = useCambiarVisible(etapa);
  const cerrar = () => onCambiarAbierto(false);

  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {etapa.visible ? "¿Ocultar la etapa?" : "¿Publicar la etapa?"}
          </DialogTitle>
          <DialogDescription>
            {etapa.visible
              ? "La etapa seleccionada dejará de ser visible para las escuelas."
              : "La etapa seleccionada pasará a ser la publicada. Si hay otra etapa publicada, se oculta automáticamente."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            color="ghost"
            onClick={cerrar}
            disabled={cambiar.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            color={etapa.visible ? "destructive" : "default"}
            disabled={cambiar.isPending}
            onClick={() => cambiar.mutate(undefined, { onSuccess: cerrar })}
          >
            {cambiar.isPending && <Loader2Icon className="animate-spin" />}
            {etapa.visible ? "Ocultar" : "Publicar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
