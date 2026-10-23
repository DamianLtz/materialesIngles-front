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
import { useEliminarCatalogo, type Catalogo } from "./api";

interface Props {
  catalogo: Catalogo;
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
}

export function EliminarCatalogoDialog({
  catalogo,
  abierto,
  onCambiarAbierto,
}: Props) {
  const eliminar = useEliminarCatalogo(catalogo.id);
  const cerrar = () => onCambiarAbierto(false);

  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar catálogo</DialogTitle>
          <DialogDescription>
            ¿Seguro que querés eliminar el catálogo{" "}
            <strong>{catalogo.nombre}</strong>? No se puede eliminar si tiene
            libros u ofertas: hay que eliminarlos o reasignarlos antes.
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
            // Si falla (ej. tiene libros) el toast global explica por qué y el diálogo queda abierto
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
