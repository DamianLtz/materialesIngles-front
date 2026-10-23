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
import { useCerrarSesionesUsuario, type Usuario } from "./api";

interface Props {
  usuario: Usuario;
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
}

export function CerrarSesionesDialog({
  usuario,
  abierto,
  onCambiarAbierto,
}: Props) {
  const cerrarSesiones = useCerrarSesionesUsuario(usuario.id);
  const cerrar = () => onCambiarAbierto(false);

  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cerrar sesiones</DialogTitle>
          <DialogDescription>
            Se cierran todas las sesiones abiertas de{" "}
            <strong>{usuario.nombre}</strong>. Podrá volver a entrar con Google.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            color={"ghost"}
            onClick={cerrar}
            disabled={cerrarSesiones.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={cerrarSesiones.isPending}
            variant={"obelisco"}
            color={"destructive"}
            onClick={() =>
              cerrarSesiones.mutate(undefined, { onSuccess: cerrar })
            }
          >
            {cerrarSesiones.isPending && (
              <Loader2Icon className="animate-spin" />
            )}
            Cerrar sesiones
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
