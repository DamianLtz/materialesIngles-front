import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { OfertaDeEscuela, LibroAsignado } from "../api";
import { BuscadorLibros } from "./buscador-libros";

/** Lo que se va a dejar en la oferta: un libro con su cantidad, o ningún libro. */
export interface Seleccion {
  libro: LibroAsignado | null;
  cantidad: number;
}

interface Props {
  oferta: OfertaDeEscuela;
  seleccion: Seleccion;
  onCambiar: (seleccion: Seleccion) => void;
  guardando: boolean;
}

/** Una oferta (grado – catálogo) de la etapa: el libro elegido y su cantidad. */
export function TarjetaOferta({
  oferta,
  seleccion,
  onCambiar,
  guardando,
}: Props) {
  const [buscando, setBuscando] = useState(false);
  const { libro, cantidad } = seleccion;
  const reclamos = oferta.pedido?.reclamos ?? 0;
  // Con reclamos solo se puede cambiar la cantidad (el back también lo rechaza con 409)
  const bloqueada = reclamos > 0;
  const max = oferta.cantidadMaxima;

  const fijarCantidad = (n: number) =>
    onCambiar({
      libro,
      cantidad: Math.min(max, Math.max(1, Number.isFinite(n) ? n : 1)),
    });

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div>
        <h3 className="font-semibold">{oferta.gradoNombre}</h3>
        <p className="text-sm text-muted-foreground">
          {oferta.catalogoNombre} · máximo {max}{" "}
          {max === 1 ? "ejemplar" : "ejemplares"}
        </p>
      </div>

      {libro ? (
        <>
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm">
              <p className="font-medium">
                {libro.titulo}
                {libro.borrado && (
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    (deshabilitado)
                  </span>
                )}
              </p>
              <p className="text-muted-foreground">ISBN {libro.isbn}</p>
              <p className="text-muted-foreground">Ed: {libro.editorial}</p>
            </div>
            <Button
              type="button"
              color="ghost"
              size="icon-sm"
              aria-label={`Quitar el libro de ${oferta.gradoNombre} – ${oferta.catalogoNombre}`}
              disabled={bloqueada || guardando}
              onClick={() => onCambiar({ libro: null, cantidad: 1 })}
            >
              <Trash2Icon />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Cantidad:</span>
            <Button
              type="button"
              color="outline"
              size="icon-sm"
              aria-label="Disminuir cantidad"
              disabled={cantidad <= 1 || guardando}
              onClick={() => fijarCantidad(cantidad - 1)}
            >
              <MinusIcon />
            </Button>
            <Input
              type="number"
              min={1}
              max={max}
              value={cantidad}
              aria-label={`Cantidad de ${oferta.gradoNombre} – ${oferta.catalogoNombre}`}
              disabled={guardando}
              className="w-20 text-center"
              onChange={(e) =>
                fijarCantidad(
                  e.target.value === "" ? 1 : Number(e.target.value),
                )
              }
            />
            <Button
              type="button"
              color="outline"
              size="icon-sm"
              aria-label="Aumentar cantidad"
              disabled={cantidad >= max || guardando}
              onClick={() => fijarCantidad(cantidad + 1)}
            >
              <PlusIcon />
            </Button>
          </div>

          {bloqueada && (
            <p className="text-xs text-muted-foreground">
              Tiene {reclamos} {reclamos === 1 ? "reclamo" : "reclamos"}: no se
              puede quitar ni cambiar el libro, solo la cantidad.
            </p>
          )}
          {!bloqueada && !buscando && (
            <Button
              type="button"
              color="link"
              size="sm"
              className="px-0"
              disabled={guardando}
              onClick={() => setBuscando(true)}
            >
              Cambiar libro
            </Button>
          )}
        </>
      ) : (
        !buscando && (
          <Button
            type="button"
            color="outline"
            className="w-full border-dashed"
            disabled={guardando}
            onClick={() => setBuscando(true)}
          >
            Asignar libro
          </Button>
        )
      )}

      {buscando && (
        <BuscadorLibros
          ofertaId={oferta.id}
          onCancelar={() => setBuscando(false)}
          onElegir={(elegido) => {
            onCambiar({
              libro: { ...elegido, borrado: false },
              // Si cambia de libro conserva la cantidad que ya había elegido
              cantidad: libro ? cantidad : 1,
            });
            setBuscando(false);
          }}
        />
      )}
    </div>
  );
}
