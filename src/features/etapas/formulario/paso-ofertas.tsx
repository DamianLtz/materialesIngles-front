import { useQuery } from "@tanstack/react-query";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import {
  useController,
  type FieldErrors,
  type UseFormReturn,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { catalogosQuery } from "@/features/catalogos/api";
import { gradosOpcionesQuery } from "@/features/grados/api";
import { CANTIDAD_MAXIMA_POR_DEFECTO, type DatosEtapa } from "../api";

interface Props {
  form: UseFormReturn<DatosEtapa>;
  /** Errores del formulario, leídos por el padre (ver PasoInformacion). */
  errors: FieldErrors<DatosEtapa>;
  /** Pedidos por oferta ("gradoId-catalogoId"): con pedidos no se puede quitar. */
  pedidosPorOferta: Map<string, number>;
}

/** Paso 3: qué grados y de qué catálogo se ofrecen, con la cantidad máxima por pedido. */
export function PasoOfertas({ form, errors, pedidosPorOferta }: Props) {
  const { data: grados = [] } = useQuery(gradosOpcionesQuery);
  const { data: catalogos = [] } = useQuery(catalogosQuery);
  const { field } = useController({ control: form.control, name: "ofertas" });
  const errores = errors.ofertas;

  const [gradoId, setGradoId] = useState("");
  const [catalogoId, setCatalogoId] = useState("");
  const [cantidad, setCantidad] = useState(String(CANTIDAD_MAXIMA_POR_DEFECTO));
  const [errorAlta, setErrorAlta] = useState("");

  const nombreGrado = Object.fromEntries(
    grados.map((g) => [String(g.id), g.nombre]),
  );
  const nombreCatalogo = Object.fromEntries(
    catalogos.map((c) => [String(c.id), c.nombre]),
  );

  function agregar() {
    const cant = Number(cantidad);
    if (!gradoId || !catalogoId) {
      setErrorAlta("Seleccioná un grado y un catálogo.");
    } else if (!Number.isInteger(cant) || cant < 1 || cant > 1000) {
      setErrorAlta("La cantidad máxima debe ser un número entre 1 y 1000.");
    } else if (
      field.value.some(
        (o) =>
          o.gradoId === Number(gradoId) && o.catalogoId === Number(catalogoId),
      )
    ) {
      setErrorAlta("Esa combinación de grado y catálogo ya está agregada.");
    } else {
      field.onChange([
        ...field.value,
        {
          gradoId: Number(gradoId),
          catalogoId: Number(catalogoId),
          cantidadMaxima: cant,
        },
      ]);
      setGradoId("");
      setCatalogoId("");
      setCantidad(String(CANTIDAD_MAXIMA_POR_DEFECTO));
      setErrorAlta("");
    }
  }

  function cambiarCantidad(indice: number, texto: string) {
    field.onChange(
      field.value.map((o, i) =>
        i === indice ? { ...o, cantidadMaxima: Number(texto) || 0 } : o,
      ),
    );
  }

  function quitar(indice: number) {
    field.onChange(field.value.filter((_, i) => i !== indice));
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Grados y catálogos</h2>
        <p className="text-sm text-muted-foreground">
          Definí qué grados se ofrecen, de qué catálogo y cuántos ejemplares
          como máximo puede pedir cada escuela.
        </p>
      </div>

      <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_1fr_8rem_auto] sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="oferta-grado">Grado</Label>
          <Select
            items={nombreGrado}
            value={gradoId}
            onValueChange={(v) => setGradoId(v ?? "")}
          >
            <SelectTrigger id="oferta-grado" className="w-full">
              <SelectValue placeholder="Seleccionar grado" />
            </SelectTrigger>
            <SelectContent>
              {grados.map((g) => (
                <SelectItem key={g.id} value={String(g.id)}>
                  {g.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="oferta-catalogo">Catálogo</Label>
          <Select
            items={nombreCatalogo}
            value={catalogoId}
            onValueChange={(v) => setCatalogoId(v ?? "")}
          >
            <SelectTrigger id="oferta-catalogo" className="w-full">
              <SelectValue placeholder="Seleccionar catálogo" />
            </SelectTrigger>
            <SelectContent>
              {catalogos.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="oferta-cantidad">Cantidad máxima</Label>
          <Input
            id="oferta-cantidad"
            type="number"
            min={1}
            max={1000}
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>
        <Button type="button" onClick={agregar}>
          <PlusIcon />
          Agregar
        </Button>
        {errorAlta && (
          <p className="text-xs text-destructive sm:col-span-4">{errorAlta}</p>
        )}
      </div>

      {field.value.length === 0 ? (
        <p className="rounded-md border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
          Todavía no agregaste ningún grado.
        </p>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Grado</TableHead>
                <TableHead className="px-4">Catálogo</TableHead>
                <TableHead className="w-40 px-4">Cantidad máxima</TableHead>
                <TableHead className="px-4">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {field.value.map((o, i) => {
                const nombre = `${nombreGrado[String(o.gradoId)] ?? `Grado ${o.gradoId}`} – ${nombreCatalogo[String(o.catalogoId)] ?? `Catálogo ${o.catalogoId}`}`;
                const pedidos =
                  pedidosPorOferta.get(`${o.gradoId}-${o.catalogoId}`) ?? 0;
                const errorCantidad = Array.isArray(errores)
                  ? errores[i]?.cantidadMaxima
                  : undefined;
                return (
                  <TableRow key={`${o.gradoId}-${o.catalogoId}`}>
                    <TableCell className="px-4">
                      {nombreGrado[String(o.gradoId)] ?? `Grado ${o.gradoId}`}
                    </TableCell>
                    <TableCell className="px-4">
                      {nombreCatalogo[String(o.catalogoId)] ??
                        `Catálogo ${o.catalogoId}`}
                    </TableCell>
                    <TableCell className="px-4">
                      <Input
                        type="number"
                        min={1}
                        max={1000}
                        aria-label={`Cantidad máxima de ${nombre}`}
                        aria-invalid={Boolean(errorCantidad)}
                        value={o.cantidadMaxima || ""}
                        onChange={(e) => cambiarCantidad(i, e.target.value)}
                      />
                      {errorCantidad && (
                        <p className="mt-1 text-xs text-destructive">
                          {errorCantidad.message}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="px-4 text-right">
                      {pedidos > 0 ? (
                        <span className="text-xs text-muted-foreground">
                          {pedidos} {pedidos === 1 ? "pedido" : "pedidos"}
                        </span>
                      ) : (
                        <Button
                          type="button"
                          color="ghost"
                          size="icon-sm"
                          aria-label={`Quitar ${nombre}`}
                          onClick={() => quitar(i)}
                        >
                          <Trash2Icon />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {errores?.message && (
        <p className="text-xs text-destructive">{errores.message}</p>
      )}
      {errores?.root?.message && (
        <p className="text-xs text-destructive">{errores.root.message}</p>
      )}
    </div>
  );
}
