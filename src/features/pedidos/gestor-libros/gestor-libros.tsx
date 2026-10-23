import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useSincronizarPedidos,
  type CambioPedido,
  type OfertaDeEscuela,
  type PedidosDeEscuela,
} from "../api";
import { TarjetaOferta, type Seleccion } from "./tarjeta-oferta";

interface Props {
  datos: PedidosDeEscuela;
  /** Se llama al guardar con éxito (vuelve a la pantalla de origen). */
  onTerminar: () => void;
}

const desdeServidor = (o: OfertaDeEscuela): Seleccion => ({
  libro: o.pedido?.libro ?? null,
  cantidad: o.pedido?.cantidad ?? 1,
});

/** Una oferta cambió si el libro o la cantidad ya no son los guardados. */
function cambio(oferta: OfertaDeEscuela, sel: Seleccion): CambioPedido | null {
  const original = oferta.pedido;
  if (sel.libro === null) {
    return original ? { ofertaId: oferta.id, libroId: null } : null;
  }
  if (
    original &&
    original.libro.id === sel.libro.id &&
    original.cantidad === sel.cantidad
  ) {
    return null;
  }
  return { ofertaId: oferta.id, libroId: sel.libro.id, cantidad: sel.cantidad };
}

/**
 * Asignación de libros de una escuela en la etapa publicada. Los cambios se acumulan
 * en pantalla y se guardan todos juntos (todo o nada).
 */
export function GestorLibros({ datos, onTerminar }: Props) {
  const guardar = useSincronizarPedidos(datos.escuela.id);
  const [selecciones, setSelecciones] = useState<Record<number, Seleccion>>(
    () =>
      Object.fromEntries(datos.ofertas.map((o) => [o.id, desdeServidor(o)])),
  );

  const cambios = datos.ofertas.flatMap((o) => {
    const c = cambio(o, selecciones[o.id]);
    return c ? [c] : [];
  });

  const deshacer = () =>
    setSelecciones(
      Object.fromEntries(datos.ofertas.map((o) => [o.id, desdeServidor(o)])),
    );

  if (!datos.etapa) {
    return (
      <p className="rounded-lg border p-6 text-center text-muted-foreground">
        Esta escuela no tiene una etapa activa en este momento.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Etapa: <strong className="text-foreground">{datos.etapa.nombre}</strong>
      </p>

      {datos.ofertas.length === 0 ? (
        <p className="rounded-lg border p-6 text-center text-muted-foreground">
          No hay grados disponibles en esta etapa.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {datos.ofertas.map((oferta) => (
            <TarjetaOferta
              key={oferta.id}
              oferta={oferta}
              seleccion={selecciones[oferta.id]}
              guardando={guardar.isPending}
              onCambiar={(sel) =>
                setSelecciones((prev) => ({ ...prev, [oferta.id]: sel }))
              }
            />
          ))}
        </div>
      )}

      <div className="sticky bottom-0 flex flex-col gap-3 border-t bg-background py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {cambios.length === 0
            ? "Sin cambios pendientes"
            : `${cambios.length} ${cambios.length === 1 ? "cambio" : "cambios"} sin guardar`}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            color="ghost"
            disabled={cambios.length === 0 || guardar.isPending}
            onClick={deshacer}
          >
            Deshacer
          </Button>
          <Button
            type="button"
            disabled={cambios.length === 0 || guardar.isPending}
            // Si falla (validación o reclamos) el toast global muestra el mensaje real y queda todo como estaba
            onClick={() => guardar.mutate(cambios, { onSuccess: onTerminar })}
          >
            {guardar.isPending && <Loader2Icon className="animate-spin" />}
            Guardar cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
