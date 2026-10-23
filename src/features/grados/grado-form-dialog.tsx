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
import {
  esquemaGrado,
  useGuardarGrado,
  type DatosGrado,
  type Grado,
} from "./api";

interface Props {
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
  /** Si viene, el diálogo edita ese grado; si no, crea uno nuevo. */
  grado?: Grado;
}

export function GradoFormDialog({ abierto, onCambiarAbierto, grado }: Props) {
  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent className="max-w-sm">
        {/* El formulario vive solo mientras el diálogo está abierto: al reabrir arranca limpio */}
        <Formulario grado={grado} onCerrar={() => onCambiarAbierto(false)} />
      </DialogContent>
    </Dialog>
  );
}

function Formulario({
  grado,
  onCerrar,
}: {
  grado?: Grado;
  onCerrar: () => void;
}) {
  const guardar = useGuardarGrado(grado?.id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosGrado>({
    resolver: zodResolver(esquemaGrado),
    defaultValues: { nombre: grado?.nombre ?? "" },
  });

  const enviar = handleSubmit((datos) =>
    guardar.mutate(datos, { onSuccess: onCerrar }),
  );

  return (
    <form onSubmit={enviar} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {grado ? "Editar tipo de grado" : "Nuevo tipo de grado"}
        </DialogTitle>
        <DialogDescription>
          {grado
            ? "Modificá el nombre del tipo de grado."
            : "Ingresá el nombre del nuevo tipo de grado (ej: 1° Grado, Sala de 4)."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-1.5">
        <Label htmlFor="grado-nombre">Nombre *</Label>
        <Input
          id="grado-nombre"
          autoFocus
          autoComplete="off"
          placeholder="Ej: 1° Grado"
          disabled={guardar.isPending}
          aria-invalid={Boolean(errors.nombre)}
          {...register("nombre")}
        />
        {errors.nombre && (
          <p className="text-xs text-destructive">{errors.nombre.message}</p>
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
          {grado ? "Guardar" : "Crear"}
        </Button>
      </DialogFooter>
    </form>
  );
}
