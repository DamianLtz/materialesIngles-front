import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
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
import {
  esquemaUsuario,
  ROLES,
  useGuardarUsuario,
  type DatosUsuario,
  type Usuario,
} from "./api";

interface Props {
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
  /** Si viene, el diálogo edita ese usuario; si no, crea uno nuevo. */
  usuario?: Usuario;
}

const ETIQUETAS_ROL = Object.fromEntries(
  ROLES.map((r) => [r.valor, r.etiqueta]),
);
const ETIQUETAS_ESTADO = { si: "Activo", no: "Sin acceso" };

export function UsuarioFormDialog({
  abierto,
  onCambiarAbierto,
  usuario,
}: Props) {
  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent className="max-w-md">
        {/* El formulario vive solo mientras el diálogo está abierto: al reabrir arranca limpio */}
        <Formulario
          usuario={usuario}
          onCerrar={() => onCambiarAbierto(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function Formulario({
  usuario,
  onCerrar,
}: {
  usuario?: Usuario;
  onCerrar: () => void;
}) {
  const guardar = useGuardarUsuario(usuario?.id);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosUsuario>({
    resolver: zodResolver(esquemaUsuario),
    defaultValues: {
      nombre: usuario?.nombre ?? "",
      email: usuario?.email ?? "",
      rol: usuario?.rol ?? "operador",
      activo: usuario?.activo ?? true,
    },
  });

  const enviar = handleSubmit((datos) =>
    guardar.mutate(datos, { onSuccess: onCerrar }),
  );

  return (
    <form onSubmit={enviar} className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {usuario ? "Editar usuario" : "Nuevo usuario"}
        </DialogTitle>
        {/* <DialogDescription>
          {usuario
            ? "Si cambiás el email, se cierran sus sesiones y vuelve a vincular su cuenta de Google en el próximo ingreso."
            : "Entra con su cuenta de Google del mismo email; no hay contraseña."}
        </DialogDescription> */}
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="usuario-nombre">Nombre completo *</Label>
          <Input
            id="usuario-nombre"
            autoFocus
            autoComplete="off"
            placeholder="Ej: Juan Pérez"
            disabled={guardar.isPending}
            aria-invalid={Boolean(errors.nombre)}
            {...register("nombre")}
          />
          {errors.nombre && (
            <p className="text-sm text-destructive">{errors.nombre.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="usuario-email">Email *</Label>
          <Input
            id="usuario-email"
            type="email"
            autoComplete="off"
            placeholder="juanperez@bue.edu.ar"
            disabled={guardar.isPending}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="usuario-rol">Rol *</Label>
          <Controller
            control={control}
            name="rol"
            render={({ field }) => (
              <Select
                items={ETIQUETAS_ROL}
                value={field.value}
                onValueChange={(valor) => field.onChange(valor ?? "")}
                disabled={guardar.isPending}
              >
                <SelectTrigger
                  id="usuario-rol"
                  className="w-full"
                  aria-invalid={Boolean(errors.rol)}
                >
                  <SelectValue placeholder="Seleccionar rol…" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.valor} value={r.valor}>
                      {r.etiqueta}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.rol && (
            <p className="text-sm text-destructive">{errors.rol.message}</p>
          )}
        </div>
      </div>

      {/* Al crear, el usuario nace activo: el estado solo se elige al editar */}
      {usuario && (
        <div className="space-y-1.5">
          <Label htmlFor="usuario-estado">Estado</Label>
          <Controller
            control={control}
            name="activo"
            render={({ field }) => (
              <Select
                items={ETIQUETAS_ESTADO}
                value={field.value ? "si" : "no"}
                onValueChange={(valor) => field.onChange(valor === "si")}
                disabled={guardar.isPending}
              >
                <SelectTrigger id="usuario-estado" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Activo</SelectItem>
                  <SelectItem value="no">Sin acceso</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

      <DialogFooter>
        <Button
          type="button"
          variant="obelisco"
          color={"ghost"}
          onClick={onCerrar}
          disabled={guardar.isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={guardar.isPending}>
          {guardar.isPending && <Loader2Icon className="animate-spin" />}
          {usuario ? "Guardar" : "Crear usuario"}
        </Button>
      </DialogFooter>
    </form>
  );
}
