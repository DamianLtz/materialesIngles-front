import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_front/$cueanexo/")({
  component: Pagina,
});

function Pagina() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Hola mundo!</h1>
      <p>{Route.fullPath}</p>
    </main>
  );
}
