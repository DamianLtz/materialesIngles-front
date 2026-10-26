import { Link } from "@tanstack/react-router";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Catalogo } from "./api";
import { Carpeta } from "./carpeta";
import { CatalogoFormDialog } from "./catalogo-form-dialog";
import { EliminarCatalogoDialog } from "./eliminar-catalogo-dialog";

export function TarjetaCatalogo({ catalogo }: { catalogo: Catalogo }) {
  const [editando, setEditando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const { id, nombre, cantidadLibros } = catalogo;

  return (
    // group/carpeta: la carpeta se abre al pasar por cualquier parte de la tarjeta
    <Card className="group/carpeta flex flex-col">
      <CardHeader className="flex-1">
        <div className="mb-2 flex items-center justify-between">
          <Carpeta semilla={id} />
          <div className="flex items-center gap-1">
            <Button
              color="ghost"
              size="icon-sm"
              title="Editar nombre"
              aria-label={`Editar ${nombre}`}
              onClick={() => setEditando(true)}
            >
              <PencilIcon />
            </Button>
            <Button
              color="ghost"
              size="icon-sm"
              title="Eliminar catálogo"
              aria-label={`Eliminar ${nombre}`}
              onClick={() => setEliminando(true)}
            >
              <Trash2Icon />
            </Button>
          </div>
        </div>
        <CardTitle className="text-xl leading-tight">
          <Link
            to="/back/catalogos/$catalogoId/libros"
            params={{ catalogoId: String(id) }}
            className="hover:underline"
          >
            {nombre}
          </Link>
        </CardTitle>
        <CardDescription>Catálogo</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto flex items-center justify-between border-t pt-3">
        <span className="text-sm font-medium text-muted-foreground">
          {cantidadLibros}{" "}
          {cantidadLibros === 1 ? "libro cargado" : "libros cargados"}
        </span>
        <Link
          to="/back/catalogos/$catalogoId/libros"
          params={{ catalogoId: String(id) }}
          className={buttonVariants({ color: "secondary", size: "sm" })}
        >
          Ver libros
        </Link>
      </CardFooter>

      <CatalogoFormDialog
        catalogo={catalogo}
        abierto={editando}
        onCambiarAbierto={setEditando}
      />
      <EliminarCatalogoDialog
        catalogo={catalogo}
        abierto={eliminando}
        onCambiarAbierto={setEliminando}
      />
    </Card>
  );
}
