import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  esquemaTipoReclamo,
  useGuardarTipoReclamo,
  type DatosTipoReclamo,
  type TipoReclamo,
} from "./api";

interface Props {
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
  /** Si viene, el diálogo edita ese tipo; si no, crea uno nuevo. */
  tipo?: TipoReclamo;
}

export function TipoReclamoFormDialog({
  abierto,
  onCambiarAbierto,
  tipo,
}: Props) {
  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent>
        {/* El formulario vive solo mientras el diálogo está abierto: al reabrir arranca limpio */}
        <Formulario tipo={tipo} onCerrar={() => onCambiarAbierto(false)} />
      </DialogContent>
    </Dialog>
  );
}

function Formulario({
  tipo,
  onCerrar,
}: {
  tipo?: TipoReclamo;
  onCerrar: () => void;
}) {
  const guardar = useGuardarTipoReclamo(tipo?.id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosTipoReclamo>({
    resolver: zodResolver(esquemaTipoReclamo),
    defaultValues: { nombre: tipo?.nombre ?? "", leyenda: tipo?.leyenda ?? "" },
  });

  const enviar = handleSubmit((datos) =>
    guardar.mutate(datos, { onSuccess: onCerrar }),
  );

  return (
    <form onSubmit={enviar} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {tipo ? "Editar tipo de reclamo" : "Nuevo tipo de reclamo"}
        </DialogTitle>
        <DialogDescription>
          {tipo
            ? "Modificá la información del tipo de reclamo."
            : "El tipo de reclamo sirve para categorizar los reclamos de las escuelas."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-1.5">
        <Label htmlFor="tipo-reclamo-nombre">Nombre *</Label>
        <Input
          id="tipo-reclamo-nombre"
          autoFocus
          autoComplete="off"
          placeholder="Ej: Faltan libros"
          disabled={guardar.isPending}
          aria-invalid={Boolean(errors.nombre)}
          {...register("nombre")}
        />
        {errors.nombre && (
          <p className="text-xs text-destructive">{errors.nombre.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tipo-reclamo-leyenda">Leyenda</Label>
        <Textarea
          id="tipo-reclamo-leyenda"
          rows={5}
          className="resize-none"
          placeholder="Texto que explica a la escuela cuándo usar este tipo de reclamo (opcional)…"
          disabled={guardar.isPending}
          aria-invalid={Boolean(errors.leyenda)}
          {...register("leyenda")}
        />
        {errors.leyenda && (
          <p className="text-xs text-destructive">{errors.leyenda.message}</p>
        )}
      </div>

      <DialogFooter>
        <Button
          type="button"
          color="ghost"
          onClick={onCerrar}
          disabled={guardar.isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={guardar.isPending}>
          {guardar.isPending && <Loader2Icon className="animate-spin" />}
          {tipo ? "Guardar" : "Crear"}
        </Button>
      </DialogFooter>
    </form>
  );
}
