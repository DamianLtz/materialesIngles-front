import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Buscador } from "@/components/data-table/buscador";
import { DataTable } from "@/components/data-table/data-table";
import { EncabezadoPagina } from "@/components/encabezado-pagina";
import { Button } from "@/components/ui/button";
import { columnasUsuarios } from "@/features/usuarios/columnas";
import { usuariosQuery } from "@/features/usuarios/api";
import { UsuarioFormDialog } from "@/features/usuarios/usuario-form-dialog";
import { useListado } from "@/hooks/use-listado";
import { validarListado } from "@/lib/paginacion";
import { tieneRol } from "@/lib/sesion";

export const Route = createFileRoute("/back/usuarios/")({
  // Solo super_admin gestiona usuarios (el back también lo exige con 403)
  beforeLoad: ({ context: { sesion } }) => {
    if (!tieneRol(sesion, ["super_admin"])) {
      throw redirect({ to: "/back/dashboard" });
    }
  },
  validateSearch: validarListado,
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.query({ ...usuariosQuery(deps), staleTime: "static" }),
  component: Pagina,
});

function Pagina() {
  const { params, irAPagina, cambiarFilas, buscar } = useListado();
  const { data, isFetching } = useQuery(usuariosQuery(params));
  const [creando, setCreando] = useState(false);

  return (
    <div className="space-y-4">
      <EncabezadoPagina
        titulo="Usuarios"
        descripcion="Gestioná quiénes pueden entrar al backoffice y con qué rol"
        acciones={
          <Button
            variant={"obelisco"}
            color={"primario"}
            onClick={() => setCreando(true)}
          >
            Nuevo usuario
          </Button>
        }
      />

      <Buscador
        valor={params.search}
        onBuscar={buscar}
        placeholder="Buscar por nombre o email…"
      />

      <DataTable
        columnas={columnasUsuarios}
        datos={data}
        cargando={isFetching}
        onPagina={irAPagina}
        onFilas={cambiarFilas}
      />

      <UsuarioFormDialog abierto={creando} onCambiarAbierto={setCreando} />
    </div>
  );
}
