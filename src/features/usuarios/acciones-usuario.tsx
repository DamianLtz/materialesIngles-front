import {
  LogOutIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Usuario } from "./api";
import { CerrarSesionesDialog } from "./cerrar-sesiones-dialog";
import { EliminarUsuarioDialog } from "./eliminar-usuario-dialog";
import { UsuarioFormDialog } from "./usuario-form-dialog";

/** Menú de la fila: editar, cerrar sesiones o dar de baja. */
export function AccionesUsuario({ usuario }: { usuario: Usuario }) {
  const [editando, setEditando] = useState(false);
  const [cerrandoSesiones, setCerrandoSesiones] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              color="ghost"
              size="icon-lg"
              aria-label={`Acciones de ${usuario.nombre}`}
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
          <DropdownMenuItem onClick={() => setCerrandoSesiones(true)}>
            <LogOutIcon />
            Cerrar sesiones
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setEliminando(true)}
          >
            <Trash2Icon />
            Dar de baja
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UsuarioFormDialog
        usuario={usuario}
        abierto={editando}
        onCambiarAbierto={setEditando}
      />
      <CerrarSesionesDialog
        usuario={usuario}
        abierto={cerrandoSesiones}
        onCambiarAbierto={setCerrandoSesiones}
      />
      <EliminarUsuarioDialog
        usuario={usuario}
        abierto={eliminando}
        onCambiarAbierto={setEliminando}
      />
    </>
  );
}
