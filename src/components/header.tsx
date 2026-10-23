import { Link } from "@tanstack/react-router";
import logo from "@/assets/img/header/logo_navbar_nuevo_dark.svg";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header({ conSidebar = true }: { conSidebar?: boolean }) {
  return (
    <header className="shadow-caba_css bg-background">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-2 px-6 py-3">
          <Link to={conSidebar ? "/back/dashboard" : "/"}>
            <img
              src={logo}
              alt="Logo de la Ciudad de Buenos Aires"
              className="h-auto w-28 shrink-0"
            />
          </Link>
          {conSidebar && <SidebarTrigger className="md:hidden" />}
        </div>
      </div>
    </header>
  );
}
