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
  esquemaEscuela,
  useGuardarEscuela,
  type DatosEscuela,
  type Escuela,
} from "./api";

interface Props {
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
  /** Si viene, el diálogo edita esa escuela; si no, crea una nueva. */
  escuela?: Escuela;
}

export function EscuelaFormDialog({
  abierto,
  onCambiarAbierto,
  escuela,
}: Props) {
  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent className="sm:max-w-xl">
        {/* El formulario vive solo mientras el diálogo está abierto: al reabrir arranca limpio */}
        <Formulario
          escuela={escuela}
          onCerrar={() => onCambiarAbierto(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function Campo({
  id,
  etiqueta,
  error,
  children,
}: {
  id: string;
  etiqueta: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{etiqueta}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Formulario({
  escuela,
  onCerrar,
}: {
  escuela?: Escuela;
  onCerrar: () => void;
}) {
  const guardar = useGuardarEscuela(escuela?.id);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosEscuela>({
    resolver: zodResolver(esquemaEscuela),
    defaultValues: {
      cueanexo: escuela?.cueanexo ?? "",
      nombre: escuela?.nombre ?? "",
      // Las migradas no tienen comuna: el campo arranca vacío y hay que cargarla para guardar
      comuna: escuela?.comuna != null ? String(escuela.comuna) : "",
      descripcion: escuela?.descripcion ?? "",
      calle: escuela?.calle ?? "",
      altura: escuela ? String(escuela.altura) : "",
      codigoPostal: escuela?.codigoPostal ?? "",
    },
  });

  const enviar = handleSubmit((datos) =>
    guardar.mutate(datos, { onSuccess: onCerrar }),
  );
  const deshabilitado = guardar.isPending;

  return (
    <form onSubmit={enviar} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {escuela ? "Editar escuela" : "Nueva escuela"}
        </DialogTitle>
        <DialogDescription>
          Completá los datos de la escuela. Los campos con{" "}
          <span className="text-destructive">*</span> son obligatorios.
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Campo
          id="escuela-cue"
          etiqueta="CUE/Anexo *"
          error={errors.cueanexo?.message}
        >
          <Input
            id="escuela-cue"
            autoFocus
            autoComplete="off"
            inputMode="numeric"
            placeholder="Ej: 200002"
            disabled={deshabilitado}
            aria-invalid={Boolean(errors.cueanexo)}
            {...register("cueanexo")}
          />
        </Campo>
        <Campo
          id="escuela-comuna"
          etiqueta="Comuna *"
          error={errors.comuna?.message}
        >
          <Input
            id="escuela-comuna"
            autoComplete="off"
            inputMode="numeric"
            placeholder="Ej: 4"
            disabled={deshabilitado}
            aria-invalid={Boolean(errors.comuna)}
            {...register("comuna")}
          />
        </Campo>
      </div>

      <Campo
        id="escuela-nombre"
        etiqueta="Nombre *"
        error={errors.nombre?.message}
      >
        <Input
          id="escuela-nombre"
          autoComplete="off"
          placeholder="Ej: Escuela Primaria N° 2"
          disabled={deshabilitado}
          aria-invalid={Boolean(errors.nombre)}
          {...register("nombre")}
        />
      </Campo>

      <Campo
        id="escuela-descripcion"
        etiqueta="Descripción"
        error={errors.descripcion?.message}
      >
        <Textarea
          id="escuela-descripcion"
          rows={2}
          className="resize-none"
          disabled={deshabilitado}
          aria-invalid={Boolean(errors.descripcion)}
          {...register("descripcion")}
        />
      </Campo>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Campo
            id="escuela-calle"
            etiqueta="Calle *"
            error={errors.calle?.message}
          >
            <Input
              id="escuela-calle"
              autoComplete="off"
              disabled={deshabilitado}
              aria-invalid={Boolean(errors.calle)}
              {...register("calle")}
            />
          </Campo>
        </div>
        <Campo
          id="escuela-altura"
          etiqueta="Número *"
          error={errors.altura?.message}
        >
          <Input
            id="escuela-altura"
            autoComplete="off"
            inputMode="numeric"
            placeholder="0 si no tiene"
            disabled={deshabilitado}
            aria-invalid={Boolean(errors.altura)}
            {...register("altura")}
          />
        </Campo>
      </div>

      <Campo
        id="escuela-cp"
        etiqueta="Código postal *"
        error={errors.codigoPostal?.message}
      >
        <Input
          id="escuela-cp"
          autoComplete="off"
          placeholder="Ej: C1033"
          disabled={deshabilitado}
          aria-invalid={Boolean(errors.codigoPostal)}
          {...register("codigoPostal")}
        />
      </Campo>

      <DialogFooter>
        <Button
          type="button"
          color="ghost"
          onClick={onCerrar}
          disabled={deshabilitado}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={deshabilitado}>
          {deshabilitado && <Loader2Icon className="animate-spin" />}
          {escuela ? "Guardar" : "Crear escuela"}
        </Button>
      </DialogFooter>
    </form>
  );
}
