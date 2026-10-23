import { Link, useLocation, useRouteContext } from "@tanstack/react-router";
import {
  BookOpenIcon,
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
import { tieneRol } from "@/lib/sesion";
import type { Escuela } from "./api";
import { EliminarEscuelaDialog } from "./eliminar-escuela-dialog";
import { EscuelaFormDialog } from "./escuela-form-dialog";

/** Menú de la fila: asignar libros, editar o eliminar. */
export function AccionesEscuela({ escuela }: { escuela: Escuela }) {
  const [editando, setEditando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const { sesion } = useRouteContext({ from: "/back" });
  // Para volver al mismo punto del listado (página y búsqueda) al terminar
  const volverA = useLocation({ select: (l) => l.href });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              color="ghost"
              size="icon-sm"
              aria-label={`Acciones de ${escuela.nombre}`}
            />
          }
        >
          <MoreVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* Asignan libros super_admin y admin, y solo si la escuela está en una etapa publicada */}
          {tieneRol(sesion, ["admin"]) &&
            (escuela.participaEnEtapaActiva ? (
              <DropdownMenuItem
                render={
                  <Link
                    to="/back/escuelas/$escuelaId/libros"
                    params={{ escuelaId: String(escuela.id) }}
                    search={{ returnTo: volverA }}
                  />
                }
              >
                <BookOpenIcon />
                Asignar libros
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem disabled>
                <BookOpenIcon />
                Asignar libros
              </DropdownMenuItem>
            ))}
          {tieneRol(sesion, ["admin"]) && <DropdownMenuSeparator />}
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

      <EscuelaFormDialog
        escuela={escuela}
        abierto={editando}
        onCambiarAbierto={setEditando}
      />
      <EliminarEscuelaDialog
        escuela={escuela}
        abierto={eliminando}
        onCambiarAbierto={setEliminando}
      />
    </>
  );
}
