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
  esquemaCatalogo,
  useGuardarCatalogo,
  type Catalogo,
  type DatosCatalogo,
} from "./api";

interface Props {
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
  /** Si viene, el diálogo edita ese catálogo; si no, crea uno nuevo. */
  catalogo?: Catalogo;
}

export function CatalogoFormDialog({
  abierto,
  onCambiarAbierto,
  catalogo,
}: Props) {
  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent className="max-w-sm">
        {/* El formulario vive solo mientras el diálogo está abierto: al reabrir arranca limpio */}
        <Formulario
          catalogo={catalogo}
          onCerrar={() => onCambiarAbierto(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function Formulario({
  catalogo,
  onCerrar,
}: {
  catalogo?: Catalogo;
  onCerrar: () => void;
}) {
  const guardar = useGuardarCatalogo(catalogo?.id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosCatalogo>({
    resolver: zodResolver(esquemaCatalogo),
    defaultValues: { nombre: catalogo?.nombre ?? "" },
  });

  const enviar = handleSubmit((datos) =>
    guardar.mutate(datos, { onSuccess: onCerrar }),
  );

  return (
    <form onSubmit={enviar} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {catalogo ? "Editar catálogo" : "Nuevo catálogo"}
        </DialogTitle>
        <DialogDescription>
          {catalogo
            ? "Modificá el nombre del catálogo."
            : "Ingresá el nombre del nuevo catálogo, para luego cargar libros dentro de él."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-1.5">
        <Label htmlFor="catalogo-nombre">Nombre del catálogo *</Label>
        <Input
          id="catalogo-nombre"
          autoFocus
          autoComplete="off"
          placeholder="Ej: Inglés"
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
          {catalogo ? "Guardar" : "Crear"}
        </Button>
      </DialogFooter>
    </form>
  );
}
