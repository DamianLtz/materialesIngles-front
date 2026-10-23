import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { gradosOpcionesQuery } from "@/features/grados/api";
import {
  esquemaLibro,
  useGuardarLibro,
  type DatosLibro,
  type Libro,
} from "./api";

interface Props {
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
  catalogoId: number;
  /** Si viene, el diálogo edita ese libro; si no, crea uno nuevo en el catálogo. */
  libro?: Libro;
}

export function LibroFormDialog({
  abierto,
  onCambiarAbierto,
  catalogoId,
  libro,
}: Props) {
  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent>
        {/* El formulario vive solo mientras el diálogo está abierto: al reabrir arranca limpio */}
        <Formulario
          catalogoId={catalogoId}
          libro={libro}
          onCerrar={() => onCambiarAbierto(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function Formulario({
  catalogoId,
  libro,
  onCerrar,
}: {
  catalogoId: number;
  libro?: Libro;
  onCerrar: () => void;
}) {
  const guardar = useGuardarLibro({ id: libro?.id, catalogoId });
  const { data: grados = [] } = useQuery(gradosOpcionesQuery);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosLibro>({
    resolver: zodResolver(esquemaLibro),
    defaultValues: {
      titulo: libro?.titulo ?? "",
      isbn: libro?.isbn ?? "",
      editorial: libro?.editorial ?? "",
      gradoId: libro ? String(libro.grado.id) : "",
    },
  });

  // El select muestra el nombre del grado a partir de su id
  const etiquetas = Object.fromEntries(
    grados.map((g) => [String(g.id), g.nombre]),
  );

  const enviar = handleSubmit((datos) =>
    guardar.mutate(datos, { onSuccess: onCerrar }),
  );

  return (
    <form onSubmit={enviar} className="space-y-4">
      <DialogHeader>
        <DialogTitle>{libro ? "Editar libro" : "Nuevo libro"}</DialogTitle>
        <DialogDescription>
          {libro
            ? "Modificá los datos del libro."
            : "Cargá un libro en este catálogo."}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-1.5">
        <Label htmlFor="libro-titulo">Título *</Label>
        <Input
          id="libro-titulo"
          autoFocus
          autoComplete="off"
          placeholder="Ej: Rainbow Bridge 1"
          disabled={guardar.isPending}
          aria-invalid={Boolean(errors.titulo)}
          {...register("titulo")}
        />
        {errors.titulo && (
          <p className="text-xs text-destructive">{errors.titulo.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="libro-isbn">ISBN *</Label>
        <Input
          id="libro-isbn"
          autoComplete="off"
          placeholder="Ej: 9789876543210"
          disabled={guardar.isPending}
          aria-invalid={Boolean(errors.isbn)}
          {...register("isbn")}
        />
        {errors.isbn && (
          <p className="text-xs text-destructive">{errors.isbn.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="libro-editorial">Editorial *</Label>
        <Input
          id="libro-editorial"
          autoComplete="off"
          placeholder="Ej: Oxford University Press"
          disabled={guardar.isPending}
          aria-invalid={Boolean(errors.editorial)}
          {...register("editorial")}
        />
        {errors.editorial && (
          <p className="text-xs text-destructive">{errors.editorial.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="libro-grado">Grado *</Label>
        <Controller
          control={control}
          name="gradoId"
          render={({ field }) => (
            <Select
              items={etiquetas}
              value={field.value}
              onValueChange={(valor) => field.onChange(valor ?? "")}
              disabled={guardar.isPending}
            >
              <SelectTrigger
                id="libro-grado"
                className="w-full"
                aria-invalid={Boolean(errors.gradoId)}
              >
                <SelectValue placeholder="Seleccionar grado…" />
              </SelectTrigger>
              <SelectContent>
                {grados.map((g) => (
                  <SelectItem key={g.id} value={String(g.id)}>
                    {g.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.gradoId && (
          <p className="text-xs text-destructive">{errors.gradoId.message}</p>
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
          {libro ? "Guardar" : "Crear"}
        </Button>
      </DialogFooter>
    </form>
  );
}
