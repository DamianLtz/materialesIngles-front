import { createFileRoute, redirect } from "@tanstack/react-router";

// /back no tiene pantalla propia: lleva al dashboard
export const Route = createFileRoute("/back/")({
  beforeLoad: () => {
    throw redirect({ to: "/back/dashboard" });
  },
});
