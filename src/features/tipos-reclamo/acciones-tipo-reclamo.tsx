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
import type { TipoReclamo } from "./api";
import { EliminarTipoReclamoDialog } from "./eliminar-tipo-reclamo-dialog";
import { TipoReclamoFormDialog } from "./tipo-reclamo-form-dialog";

/** Menú de la fila: editar o eliminar. */
export function AccionesTipoReclamo({ tipo }: { tipo: TipoReclamo }) {
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
              aria-label={`Acciones de ${tipo.nombre}`}
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

      <TipoReclamoFormDialog
        tipo={tipo}
        abierto={editando}
        onCambiarAbierto={setEditando}
      />
      <EliminarTipoReclamoDialog
        tipo={tipo}
        abierto={eliminando}
        onCambiarAbierto={setEliminando}
      />
    </>
  );
}
