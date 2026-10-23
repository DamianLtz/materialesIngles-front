import { Link, useMatchRoute, type LinkProps } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { ItemMenu } from "@/constants/menu";

export function NavMain({ items }: { items: ItemMenu[] }) {
  const matchRoute = useMatchRoute();
  const { state, isMobile, setOpen, setOpenMobile } = useSidebar();
  const enIconos = state === "collapsed" && !isMobile;

  const estaActivo = (to: LinkProps["to"]) =>
    Boolean(matchRoute({ to, fuzzy: true }));

  // Como en el original: al elegir una sección el sidebar se cierra
  const alNavegar = () => {
    if (isMobile) setOpenMobile(false);
    else setOpen(false);
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          if ("to" in item) {
            return (
              <SidebarMenuItem key={item.titulo}>
                <SidebarMenuButton
                  tooltip={item.titulo}
                  isActive={estaActivo(item.to)}
                  render={<Link to={item.to} onClick={alNavegar} />}
                >
                  {item.icono}
                  <span>{item.titulo}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          const grupoActivo = item.subitems.some((sub) => estaActivo(sub.to));

          // Con el sidebar en modo íconos el grupo no puede desplegarse:
          // se muestra como menú flotante al costado
          if (enIconos) {
            return (
              <SidebarMenuItem key={item.titulo}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <SidebarMenuButton
                        tooltip={item.titulo}
                        isActive={grupoActivo}
                      />
                    }
                  >
                    {item.icono}
                    <span>{item.titulo}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start" className="w-48">
                    {item.subitems.map((sub) => (
                      <DropdownMenuItem
                        key={sub.titulo}
                        render={<Link to={sub.to} onClick={alNavegar} />}
                      >
                        {sub.titulo}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.titulo}
              defaultOpen={grupoActivo}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={<SidebarMenuButton tooltip={item.titulo} />}
              >
                {item.icono}
                {/* El chevron es el último hijo, así que el truncate del botón no
                    alcanza a este span: sin él el texto se reacomoda al animar */}
                <span className="truncate">{item.titulo}</span>
                <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.subitems.map((sub) => (
                    <SidebarMenuSubItem key={sub.titulo}>
                      <SidebarMenuSubButton
                        isActive={estaActivo(sub.to)}
                        render={<Link to={sub.to} onClick={alNavegar} />}
                      >
                        <span>{sub.titulo}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
