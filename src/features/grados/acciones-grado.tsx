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
import type { Grado } from "./api";
import { EliminarGradoDialog } from "./eliminar-grado-dialog";
import { GradoFormDialog } from "./grado-form-dialog";

/** Menú de la fila: editar o eliminar. */
export function AccionesGrado({ grado }: { grado: Grado }) {
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
              aria-label={`Acciones de ${grado.nombre}`}
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

      <GradoFormDialog
        grado={grado}
        abierto={editando}
        onCambiarAbierto={setEditando}
      />
      <EliminarGradoDialog
        grado={grado}
        abierto={eliminando}
        onCambiarAbierto={setEliminando}
      />
    </>
  );
}
