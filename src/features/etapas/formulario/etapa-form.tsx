import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  esquemaEtapa,
  useGuardarEtapa,
  type DatosEtapa,
  type EtapaDetalle,
} from "../api";
import { PasoEscuelas } from "./paso-escuelas";
import { PasoInformacion } from "./paso-informacion";
import { PasoOfertas } from "./paso-ofertas";

/** Cada paso del asistente y los campos que valida antes de dejar avanzar. */
const PASOS: { titulo: string; campos: (keyof DatosEtapa)[] }[] = [
  {
    titulo: "Información",
    campos: [
      "nombre",
      "fechaInicio",
      "fechaFin",
      "leyenda",
      "reclamoInicio",
      "reclamoFin",
      "reclamoLeyenda",
      "visible",
    ],
  },
  { titulo: "Escuelas", campos: ["escuelaIds"] },
  { titulo: "Grados y catálogos", campos: ["ofertas"] },
];
const ULTIMO_PASO = PASOS.length - 1;

/** Alta (sin `etapa`) o edición de una etapa, en tres pasos con un solo formulario. */
export function EtapaForm({ etapa }: { etapa?: EtapaDetalle }) {
  const [paso, setPaso] = useState(0);
  const guardar = useGuardarEtapa(etapa?.id);
  const form = useForm<DatosEtapa>({
    resolver: zodResolver(esquemaEtapa),
    // Tras el primer error, revalida al corregir el campo (el mensaje no queda pegado)
    mode: "onTouched",
    defaultValues: {
      nombre: etapa?.nombre ?? "",
      fechaInicio: etapa?.fechaInicio ?? "",
      fechaFin: etapa?.fechaFin ?? "",
      leyenda: etapa?.leyenda ?? "",
      reclamoInicio: etapa?.reclamoInicio ?? "",
      reclamoFin: etapa?.reclamoFin ?? "",
      reclamoLeyenda: etapa?.reclamoLeyenda ?? "",
      visible: etapa?.visible ?? false,
      escuelaIds: etapa?.escuelaIds ?? [],
      ofertas:
        etapa?.ofertas.map(({ gradoId, catalogoId, cantidadMaxima }) => ({
          gradoId,
          catalogoId,
          cantidadMaxima,
        })) ?? [],
    },
  });

  // Se leen acá (y se pasan a los pasos) para que el formulario se redibuje al cambiar
  const { errors } = form.formState;

  // Lo que ya tiene pedidos no se puede quitar (el back también lo rechaza con 409)
  const escuelasConPedidos = etapa?.escuelasConPedidos ?? [];
  const pedidosPorOferta = new Map(
    (etapa?.ofertas ?? []).map((o) => [
      `${o.gradoId}-${o.catalogoId}`,
      o.pedidos,
    ]),
  );

  async function siguiente() {
    if (await form.trigger(PASOS[paso].campos)) setPaso(paso + 1);
  }

  /** Si falla un campo de otro paso (ej. el back o el esquema cruzado), vuelve a ese paso. */
  function irAlPrimerError(errores: FieldErrors<DatosEtapa>) {
    const conError = PASOS.findIndex((p) => p.campos.some((c) => c in errores));
    if (conError >= 0) setPaso(conError);
  }

  const enviar = form.handleSubmit(
    (datos) => guardar.mutate(datos),
    irAlPrimerError,
  );

  function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    // Enter dentro de un campo no debe guardar la etapa a medio completar
    if (paso < ULTIMO_PASO) void siguiente();
    else void enviar();
  }

  return (
    <form onSubmit={alEnviar} className="space-y-6" noValidate>
      <div>
        <h1 className="text-4xl font-bold">
          {etapa ? "Editar etapa" : "Crear nueva etapa"}
        </h1>
        <p className="mt-1 text-lg text-muted-foreground">
          {etapa
            ? "Modificá la configuración de la etapa, las escuelas y los grados asignados"
            : "Configurá la información, las escuelas y los grados de esta etapa"}
        </p>
      </div>

      <IndicadorDePasos paso={paso} />

      <div className="rounded-xl border p-4 sm:p-6">
        {paso === 0 && <PasoInformacion form={form} errors={errors} />}
        {paso === 1 && (
          <PasoEscuelas form={form} bloqueadas={escuelasConPedidos} />
        )}
        {paso === 2 && (
          <PasoOfertas
            form={form}
            errors={errors}
            pedidosPorOferta={pedidosPorOferta}
          />
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Link
          to="/back/etapas"
          className={buttonVariants({ color: "ghost" })}
        >
          Cancelar
        </Link>
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          {paso > 0 && (
            <Button
              type="button"
              color="outline"
              disabled={guardar.isPending}
              onClick={() => setPaso(paso - 1)}
            >
              Anterior
            </Button>
          )}
          {paso < ULTIMO_PASO ? (
            <Button
              key="siguiente"
              type="button"
              onClick={() => void siguiente()}
            >
              Siguiente
            </Button>
          ) : (
            // key distinta: si React reutilizara el mismo botón, el clic en "Siguiente" que lo vuelve
            // type="submit" enviaría el formulario al llegar al último paso
            <Button key="guardar" type="submit" disabled={guardar.isPending}>
              {guardar.isPending && <Loader2Icon className="animate-spin" />}
              {etapa ? "Guardar cambios" : "Crear etapa"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

function IndicadorDePasos({ paso }: { paso: number }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-4" aria-label="Pasos">
      {PASOS.map((p, i) => (
        <li
          key={p.titulo}
          className="flex items-center gap-2"
          aria-current={i === paso ? "step" : undefined}
        >
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
              i < paso && "border-primary bg-primary text-primary-foreground",
              i === paso && "border-primary text-primary",
              i > paso && "text-muted-foreground",
            )}
          >
            {i < paso ? <CheckIcon className="size-4" /> : i + 1}
          </span>
          <span
            className={cn(
              "text-sm font-medium",
              i === paso ? "inline" : "hidden sm:inline",
              i > paso && "text-muted-foreground",
            )}
          >
            {p.titulo}
          </span>
          {i < PASOS.length - 1 && (
            <span className="hidden h-px w-8 bg-border sm:block" />
          )}
        </li>
      ))}
    </ol>
  );
}
