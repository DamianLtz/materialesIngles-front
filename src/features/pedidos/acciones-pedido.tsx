import { MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PedidoListado } from "./api";
import { EliminarPedidoDialog } from "./eliminar-pedido-dialog";

/** Menú de la fila: eliminar el pedido. */
export function AccionesPedido({ pedido }: { pedido: PedidoListado }) {
  const [eliminando, setEliminando] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              color="ghost"
              size="icon-sm"
              aria-label={`Acciones del pedido de ${pedido.escuela.nombre}`}
            />
          }
        >
          <MoreVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setEliminando(true)}
          >
            <Trash2Icon />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EliminarPedidoDialog
        pedido={pedido}
        abierto={eliminando}
        onCambiarAbierto={setEliminando}
      />
    </>
  );
}
