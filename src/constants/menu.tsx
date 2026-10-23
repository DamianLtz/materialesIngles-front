import type { LinkProps } from "@tanstack/react-router";
import {
  BookAlertIcon,
  BookOpenIcon,
  CalendarRangeIcon,
  PieChartIcon,
  SchoolIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Rol } from "@/lib/sesion";

/** Un ítem es un link directo o un grupo que despliega subitems. */
export type ItemMenu = {
  titulo: string;
  icono: ReactNode;
  /** Roles que ven el ítem (super_admin siempre). Sin esto lo ven todos. El back lo exige igual. */
  roles?: Rol[];
} & (
  | { to: LinkProps["to"] }
  | {
      subitems: { titulo: string; to: LinkProps["to"]; roles?: Rol[] }[];
    }
);

/** Menú del sidebar del backoffice. Misma agrupación que el original. */
export const menuBack: ItemMenu[] = [
  { titulo: "Tablero", icono: <PieChartIcon />, to: "/back/dashboard" },
  { titulo: "Escuelas", icono: <SchoolIcon />, to: "/back/escuelas" },
  {
    titulo: "Etapas",
    icono: <CalendarRangeIcon />,
    to: "/back/etapas",
    roles: ["super_admin", "admin"],
  },
  { titulo: "Reclamos", icono: <BookAlertIcon />, to: "/back/reclamos" },
  {
    titulo: "Pedidos y libros",
    icono: <BookOpenIcon />,
    subitems: [
      {
        titulo: "Solicitudes",
        to: "/back/pedidos",
        roles: ["super_admin", "admin"],
      },
      { titulo: "Gestión de catálogo", to: "/back/catalogos" },
      {
        titulo: "Asignación masiva",
        to: "/back/asignacion-masiva",
        roles: ["super_admin", "admin"],
      },
    ],
  },
  {
    titulo: "Usuarios",
    icono: <UsersIcon />,
    to: "/back/usuarios",
    roles: ["super_admin"],
  },
  {
    titulo: "Configuración",
    icono: <SettingsIcon />,
    subitems: [
      { titulo: "Tipos de grado", to: "/back/grados" },
      { titulo: "Tipos de reclamo", to: "/back/tipos-reclamo" },
    ],
  },
];
