import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSesion } from "@/lib/sesion";
import ImgIndex from "@/assets/img/main/index-img.svg";

export const Route = createFileRoute("/_front/")({
  beforeLoad: async () => {
    // Si ya hay sesión, no tiene sentido mostrar el login
    if (await getSesion()) throw redirect({ to: "/back/dashboard" });
  },
  component: Login,
});

function Login() {
  return (
    <main>
      <div className="container px-6 py-8 mx-auto">
        <div className="grid grid-cols-12 gap-6 h-full">
          <div className="col-span-12 justify-self-center self-center lg:col-span-6 sm:justify-self-start">
            <div className="flex flex-col">
              <div className="px-4 py-3 mb-5 rounded-md border-l-4 outline outline-cian-500 border-cian-500 bg-cian-50 text-grisulado-950">
                <div className="flex gap-2 items-center">
                  <svg
                    className="self-start shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="currentColor"
                  >
                    <path d="M508.5-291.5Q520-303 520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280q17 0 28.5-11.5Zm0-320Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                  </svg>
                  <p className="text-sm md:text-base">
                    No ha ingresado correctamente, por favor ingresá a través de{" "}
                    <a
                      href="https://miescuela.bue.edu.ar"
                      rel="noreferrer"
                      target="_self"
                      className="font-semibold underline"
                    >
                      Aprende BA
                    </a>
                    .
                  </p>
                </div>
              </div>

              <p className="2xl:text-lg">¡Te damos la bienvenida!</p>
              <h1 className="my-2 text-3xl font-bold sm:text-4xl 2xl:text-5xl">
                Materiales inglés BA
              </h1>
              <p className="my-4 text-lg 2xl:text-xl">
                Desde aca vas a poder acceder a los{" "}
                <strong>materiales de inglés</strong> de la Ciudad de Buenos
                Aires.
              </p>
              <a
                href="/api/auth/google"
                role="button"
                className="flex gap-3 justify-center items-center p-4 mb-3 bg-white rounded-sm transition-colors cursor-pointer box-shadow-google hover:bg-azul-50 sm:max-w-sm"
              >
                <svg
                  className="size-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 326667 333333"
                  shapeRendering="geometricPrecision"
                  textRendering="geometricPrecision"
                  imageRendering="optimizeQuality"
                  fillRule="evenodd"
                  clipRule="evenodd"
                >
                  <path
                    d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38329 3428 342c31481-29074 49630-71852 49630-122593m0 0z"
                    fill="#4285f4"
                  />
                  <path
                    d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z"
                    fill="#34a853"
                  />
                  <path
                    d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851m0 0z"
                    fill="#fbbc04"
                  />
                  <path
                    d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 50927-69260 95001-69260m0 0z"
                    fill="#ea4335"
                  />
                </svg>
                <p className="text-lg">Ingresa con tu cuenta</p>
              </a>
            </div>
          </div>
          <div className="hidden justify-self-center self-center lg:block sm:col-span-12 lg:col-span-6 lg:justify-self-end">
            <img
              src={ImgIndex}
              alt=""
              className="min-w-105 xl:min-w-lg 2xl:min-w-160 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
