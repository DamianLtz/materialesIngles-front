import type { ComponentProps } from "react";
// Con el sidebar oscuro del original va logo_app_nuevo_blanco.svg
import logo from "@/assets/img/header/logo_navbar_nuevo_dark.svg";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { menuBack, type ItemMenu } from "@/constants/menu";
import { tieneRol, type Rol, type Sesion } from "@/lib/sesion";

/** Ítems y subitems que el rol puede ver; un grupo sin subitems visibles se oculta. */
function menuParaRol(sesion: Sesion): ItemMenu[] {
  const puede = (roles?: Rol[]) => !roles || tieneRol(sesion, roles);
  return menuBack.flatMap((item): ItemMenu[] => {
    if (!puede(item.roles)) return [];
    if (!("subitems" in item)) return [item];
    const subitems = item.subitems.filter((sub) => puede(sub.roles));
    return subitems.length ? [{ ...item, subitems }] : [];
  });
}

export function AppSidebar({
  sesion,
  ...props
}: ComponentProps<typeof Sidebar> & { sesion: Sesion }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex-row items-center justify-between group-data-[collapsible=icon]:justify-center">
        <img
          src={logo}
          alt="Logo de Buenos Aires Ciudad"
          className="h-8 shrink-0 group-data-[collapsible=icon]:hidden"
        />
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuParaRol(sesion)} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser sesion={sesion} />
      </SidebarFooter>
    </Sidebar>
  );
}
