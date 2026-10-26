import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { etiquetaComuna } from "@/features/escuelas/api";
import { escuelasDeEtapaQuery, type Etapa } from "./api";
import { textoPeriodo } from "./formato";

interface Props {
  etapa: Etapa;
  abierto: boolean;
  onCambiarAbierto: (abierto: boolean) => void;
}

export function DetalleEtapaDialog({
  etapa,
  abierto,
  onCambiarAbierto,
}: Props) {
  return (
    <Dialog open={abierto} onOpenChange={onCambiarAbierto}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        {/* El contenido (y el pedido de escuelas) existe solo mientras el diálogo está abierto */}
        <Contenido etapa={etapa} />
      </DialogContent>
    </Dialog>
  );
}

/** Cuántas escuelas se dibujan antes de pedir "Mostrar todas" (pueden ser miles). */
const ESCUELAS_INICIALES = 100;

function Contenido({ etapa }: { etapa: Etapa }) {
  const { data: escuelas, isPending } = useQuery(
    escuelasDeEtapaQuery(etapa.id),
  );
  const [todas, setTodas] = useState(false);
  const visibles = todas ? escuelas : escuelas?.slice(0, ESCUELAS_INICIALES);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{etapa.nombre}</DialogTitle>
        <DialogDescription>
          Detalles completos de la etapa y configuraciones asignadas.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5 text-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Dato titulo="Período de selección">
            {textoPeriodo(etapa.fechaInicio, etapa.fechaFin)}
          </Dato>
          <Dato titulo="Período de reclamo">
            {textoPeriodo(etapa.reclamoInicio, etapa.reclamoFin)}
          </Dato>
        </div>

        {etapa.leyenda && (
          <Dato titulo="Leyenda de selección">{etapa.leyenda}</Dato>
        )}
        {etapa.reclamoLeyenda && (
          <Dato titulo="Leyenda de reclamos">{etapa.reclamoLeyenda}</Dato>
        )}

        <Dato titulo={`Grados y catálogos (${etapa.ofertas.length})`}>
          <ul className="mt-1 space-y-1">
            {etapa.ofertas.map((o) => (
              <li
                key={o.id}
                className="flex justify-between gap-4 rounded-md border px-3 py-1.5"
              >
                <span>
                  {o.gradoNombre} – {o.catalogoNombre}
                </span>
                <span className="text-muted-foreground">
                  Máximo {o.cantidadMaxima}
                </span>
              </li>
            ))}
          </ul>
        </Dato>

        <Dato titulo={`Escuelas (${etapa.cantidadEscuelas})`}>
          {isPending ? (
            <Loader2Icon
              className="mt-2 size-5 animate-spin text-muted-foreground"
              aria-label="Cargando escuelas"
            />
          ) : (
            <>
              <ul className="mt-1 flex max-h-64 flex-col gap-1 overflow-y-auto">
                {visibles?.map((e) => (
                  <li key={e.id} className="rounded-md border px-3 py-1.5">
                    {e.nombre}{" "}
                    <span className="text-muted-foreground">
                      · CUE/Anexo {e.cueanexo} · {etiquetaComuna(e.comuna)}
                    </span>
                  </li>
                ))}
              </ul>
              {!todas && (escuelas?.length ?? 0) > ESCUELAS_INICIALES && (
                <Button
                  type="button"
                  color="link"
                  size="sm"
                  onClick={() => setTodas(true)}
                >
                  Mostrar las {escuelas?.length} escuelas
                </Button>
              )}
            </>
          )}
        </Dato>
      </div>
    </>
  );
}

function Dato({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-muted-foreground uppercase">
        {titulo}
      </p>
      <div>{children}</div>
    </div>
  );
}
