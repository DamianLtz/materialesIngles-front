import { MoreVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Libro } from "./api";
import { EliminarLibroDialog } from "./eliminar-libro-dialog";
import { LibroFormDialog } from "./libro-form-dialog";

/** Menú de la fila: editar o eliminar. */
export function AccionesLibro({ libro }: { libro: Libro }) {
  const [editando, setEditando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              color="ghost"
              size="icon-sm"
              aria-label={`Acciones de ${libro.titulo}`}
            />
          }
        >
          <MoreVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditando(true)}>
            <PencilIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setEliminando(true)}
          >
            <Trash2Icon />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LibroFormDialog
        libro={libro}
        catalogoId={libro.catalogoId}
        abierto={editando}
        onCambiarAbierto={setEditando}
      />
      <EliminarLibroDialog
        libro={libro}
        abierto={eliminando}
        onCambiarAbierto={setEliminando}
      />
    </>
  );
}
