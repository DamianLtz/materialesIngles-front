import { Link } from "@tanstack/react-router";
import {
  EyeIcon,
  MoreVerticalIcon,
  PencilIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
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
import type { Etapa } from "./api";
import { DetalleEtapaDialog } from "./detalle-etapa-dialog";
import { EliminarEtapaDialog } from "./eliminar-etapa-dialog";
import { VisibleEtapaDialog } from "./visible-etapa-dialog";

/** Menú de la fila: editar, ver detalle, publicar/ocultar o eliminar. */
export function AccionesEtapa({ etapa }: { etapa: Etapa }) {
  const [viendo, setViendo] = useState(false);
  const [cambiandoVisible, setCambiandoVisible] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              color="ghost"
              size="icon-sm"
              aria-label={`Acciones de ${etapa.nombre}`}
            />
          }
        >
          <MoreVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            render={
              <Link
                to="/back/etapas/$etapaId/editar"
                params={{ etapaId: String(etapa.id) }}
              />
            }
          >
            <PencilIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setViendo(true)}>
            <EyeIcon />
            Ver detalle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCambiandoVisible(true)}>
            {etapa.visible ? <ToggleRightIcon /> : <ToggleLeftIcon />}
            {etapa.visible ? "Ocultar" : "Publicar"}
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

      <DetalleEtapaDialog
        etapa={etapa}
        abierto={viendo}
        onCambiarAbierto={setViendo}
      />
      <VisibleEtapaDialog
        etapa={etapa}
        abierto={cambiandoVisible}
        onCambiarAbierto={setCambiandoVisible}
      />
      <EliminarEtapaDialog
        etapa={etapa}
        abierto={eliminando}
        onCambiarAbierto={setEliminando}
      />
    </>
  );
}
