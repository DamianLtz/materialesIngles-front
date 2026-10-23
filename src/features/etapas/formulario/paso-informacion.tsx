import {
  Controller,
  type FieldErrors,
  type UseFormReturn,
} from "react-hook-form";
import { SelectorFecha } from "@/components/selector-fecha";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { DatosEtapa } from "../api";

type Campo = "fechaInicio" | "fechaFin" | "reclamoInicio" | "reclamoFin";
const CAMPOS_FECHA: Campo[] = [
  "fechaInicio",
  "fechaFin",
  "reclamoInicio",
  "reclamoFin",
];

function CampoFecha({
  form: { control, trigger },
  errors,
  campo,
  titulo,
}: {
  form: UseFormReturn<DatosEtapa>;
  errors: FieldErrors<DatosEtapa>;
  campo: Campo;
  titulo: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={`etapa-${campo}`} className="text-muted-foreground">
        {titulo}
      </Label>
      <Controller
        control={control}
        name={campo}
        render={({ field }) => (
          <SelectorFecha
            id={`etapa-${campo}`}
            valor={field.value}
            onCambiar={(valor) => {
              field.onChange(valor);
              // Las reglas de fechas se cruzan entre los cuatro campos y el selector nunca
              // "se toca" (blur): si ya hay un error de fechas, se revalidan todas al cambiar una
              if (CAMPOS_FECHA.some((c) => errors[c]))
                void trigger(CAMPOS_FECHA);
            }}
            invalido={Boolean(errors[campo])}
          />
        )}
      />
      {errors[campo] && (
        <p className="text-xs text-destructive">{errors[campo].message}</p>
      )}
    </div>
  );
}

/** Paso 1: nombre, períodos de selección y de reclamo, leyendas y publicación. */
export function PasoInformacion({
  form,
  errors,
}: {
  form: UseFormReturn<DatosEtapa>;
  /**
   * Los errores llegan por prop (los lee el formulario padre): si cada paso leyera
   * `form.formState` por su cuenta, el React Compiler no lo volvería a dibujar.
   */
  errors: FieldErrors<DatosEtapa>;
}) {
  const { register, control } = form;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Información general</h2>
        <p className="text-sm text-muted-foreground">
          Definí el nombre de la etapa y los períodos de selección y reclamo.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="etapa-nombre">Nombre de la etapa *</Label>
        <Input
          id="etapa-nombre"
          autoFocus
          autoComplete="off"
          placeholder="Ej: Distribución Materiales 2026"
          aria-invalid={Boolean(errors.nombre)}
          {...register("nombre")}
        />
        {errors.nombre && (
          <p className="text-xs text-destructive">{errors.nombre.message}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Período de selección</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <CampoFecha
              form={form}
              errors={errors}
              campo="fechaInicio"
              titulo="Fecha de inicio"
            />
            <CampoFecha
              form={form}
              errors={errors}
              campo="fechaFin"
              titulo="Fecha de fin"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="etapa-leyenda">Leyenda de selección</Label>
            <Textarea
              id="etapa-leyenda"
              rows={3}
              placeholder="Ingresá el comentario para los establecimientos."
              aria-invalid={Boolean(errors.leyenda)}
              {...register("leyenda")}
            />
            {errors.leyenda && (
              <p className="text-xs text-destructive">
                {errors.leyenda.message}
              </p>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold">Período de reclamo</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <CampoFecha
              form={form}
              errors={errors}
              campo="reclamoInicio"
              titulo="Fecha de inicio"
            />
            <CampoFecha
              form={form}
              errors={errors}
              campo="reclamoFin"
              titulo="Fecha de fin"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="etapa-reclamo-leyenda">Leyenda de reclamos</Label>
            <Textarea
              id="etapa-reclamo-leyenda"
              rows={3}
              placeholder="Ingresá el comentario para los establecimientos."
              aria-invalid={Boolean(errors.reclamoLeyenda)}
              {...register("reclamoLeyenda")}
            />
            {errors.reclamoLeyenda && (
              <p className="text-xs text-destructive">
                {errors.reclamoLeyenda.message}
              </p>
            )}
          </div>
        </section>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
        <div className="space-y-1">
          <Label htmlFor="etapa-visible">Publicar etapa</Label>
          <p className="text-sm text-muted-foreground">
            Define si esta es la etapa que ven los establecimientos.
          </p>
          <p className="text-xs font-medium text-primary italic">
            Publicar esta etapa oculta las demás automáticamente al guardar los
            cambios.
          </p>
        </div>
        <Controller
          control={control}
          name="visible"
          render={({ field }) => (
            <Switch
              id="etapa-visible"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
    </div>
  );
}
