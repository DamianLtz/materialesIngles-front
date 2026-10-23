import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  notFound,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { EncabezadoPagina } from "@/components/encabezado-pagina";
import { Button } from "@/components/ui/button";
import { pedidosEscuelaQuery } from "@/features/pedidos/api";
import { GestorLibros } from "@/features/pedidos/gestor-libros/gestor-libros";
import { ApiError } from "@/lib/api";
import { tieneRol } from "@/lib/sesion";

const VOLVER_POR_DEFECTO = "/back/escuelas";

/** Solo se vuelve a rutas internas del backoffice (el valor viene de la URL). */
function rutaInterna(valor: unknown): string {
  return typeof valor === "string" &&
    valor.startsWith("/back/") &&
    !valor.startsWith("//")
    ? valor
    : VOLVER_POR_DEFECTO;
}

function validarVolver(search: Record<string, unknown>) {
  return { returnTo: rutaInterna(search.returnTo) };
}

export const Route = createFileRoute("/back/escuelas/$escuelaId/libros")({
  // Gestionan pedidos super_admin y admin (el back también lo exige con 403)
  beforeLoad: ({ context: { sesion } }) => {
    if (!tieneRol(sesion, ["admin"])) throw redirect({ to: "/back/dashboard" });
  },
  validateSearch: validarVolver,
  loader: async ({ context: { queryClient }, params }) => {
    try {
      await queryClient.query({
        ...pedidosEscuelaQuery(Number(params.escuelaId)),
        staleTime: "static",
      });
    } catch (error) {
      // Una escuela que no existe vuelve al listado en vez de mostrar un error técnico
      if (error instanceof ApiError && error.status === 404) throw notFound();
      throw error;
    }
  },
  notFoundComponent: () => (
    <p className="text-muted-foreground">La escuela no existe.</p>
  ),
  component: Pagina,
});

function Pagina() {
  const { escuelaId } = Route.useParams();
  const { returnTo } = Route.useSearch();
  const router = useRouter();
  const { data } = useQuery(pedidosEscuelaQuery(Number(escuelaId)));
  if (!data) return null;

  return (
    <div className="space-y-4">
      <Button
        type="button"
        color="ghost"
        size="sm"
        onClick={() => router.history.push(returnTo)}
      >
        <ArrowLeftIcon />
        Volver a escuelas
      </Button>
      <EncabezadoPagina
        titulo="Gestión de libros"
        descripcion={`${data.escuela.nombre} — CUE/Anexo ${data.escuela.cueanexo}`}
      />
      <GestorLibros
        key={data.etapa?.id ?? "sin-etapa"}
        datos={data}
        onTerminar={() => router.history.push(returnTo)}
      />
    </div>
  );
}
