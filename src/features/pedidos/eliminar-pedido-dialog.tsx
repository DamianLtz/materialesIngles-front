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
import { useEliminarPedido, type PedidoListado } from "./api";

interface Props {
  pedido: PedidoListado;
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
}

export function EliminarPedidoDialog({
  pedido,
  abierto,
  onCambiarAbierto,
}: Props) {
  const eliminar = useEliminarPedido(pedido.id);
  const cerrar = () => onCambiarAbierto(false);

  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar pedido</DialogTitle>
          <DialogDescription>
            ¿Seguro que querés eliminar el pedido de{" "}
            <strong>{pedido.escuela.nombre}</strong> ({pedido.grado} –{" "}
            {pedido.catalogo})? No se puede eliminar si tiene reclamos.
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
            // Si falla (ej. tiene reclamos) el toast global explica por qué y el diálogo queda abierto
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
