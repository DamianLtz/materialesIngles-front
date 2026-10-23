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
import { useEliminarGrado, type Grado } from "./api";

interface Props {
  grado: Grado;
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
}

export function EliminarGradoDialog({
  grado,
  abierto,
  onCambiarAbierto,
}: Props) {
  const eliminar = useEliminarGrado(grado.id);
  const cerrar = () => onCambiarAbierto(false);

  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar tipo de grado</DialogTitle>
          <DialogDescription>
            ¿Seguro que querés eliminar <strong>{grado.nombre}</strong>? No se
            puede eliminar si hay libros u ofertas que lo usan.
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
