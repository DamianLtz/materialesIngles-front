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
import { useEliminarUsuario, type Usuario } from "./api";

interface Props {
  usuario: Usuario;
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
}

export function EliminarUsuarioDialog({
  usuario,
  abierto,
  onCambiarAbierto,
}: Props) {
  const eliminar = useEliminarUsuario(usuario.id);
  const cerrar = () => onCambiarAbierto(false);

  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dar de baja al usuario</DialogTitle>
          <DialogDescription>
            ¿Seguro que querés dar de baja a <strong>{usuario.nombre}</strong>?
            Pierde el acceso al sistema de inmediato.
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
            onClick={() => eliminar.mutate(undefined, { onSuccess: cerrar })}
          >
            {eliminar.isPending && <Loader2Icon className="animate-spin" />}
            Dar de baja
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
