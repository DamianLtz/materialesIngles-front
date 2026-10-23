import { useQuery } from "@tanstack/react-query";
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
import { archivablesQuery, useArchivar } from "./api";

interface Props {
  etapaId: number;
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
}

/** Aviso antes de archivar: dice cuántos reclamos pasan a histórico (no se puede deshacer). */
export function ArchivarDialog({ etapaId, abierto, onCambiarAbierto }: Props) {
  const { data, isPending } = useQuery({
    ...archivablesQuery(etapaId),
    enabled: abierto,
  });
  const archivar = useArchivar(etapaId);
  const cerrar = () => onCambiarAbierto(false);
  const cantidad = data?.archivables ?? 0;

  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archivar reclamos</DialogTitle>
          <DialogDescription>
            {isPending ? (
              "Calculando…"
            ) : cantidad === 0 ? (
              "No hay reclamos para archivar en esta etapa."
            ) : (
              <>
                Se van a archivar <strong>{cantidad}</strong>{" "}
                {cantidad === 1 ? "reclamo" : "reclamos"} de{" "}
                <strong>{data?.etapa.nombre}</strong>. Pasan a "Histórico" y ya
                no se podrá cambiar su estado.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            color="ghost"
            onClick={cerrar}
            disabled={archivar.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            color="destructive"
            disabled={isPending || cantidad === 0 || archivar.isPending}
            onClick={() => archivar.mutate(undefined, { onSuccess: cerrar })}
          >
            {archivar.isPending && <Loader2Icon className="animate-spin" />}
            Archivar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
