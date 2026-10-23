import escudo from "@/assets/img/footer/escudo_caba_corto.svg";

const LINKS = [
  {
    titulo: "Boletín oficial",
    href: "https://boletinoficial.buenosaires.gob.ar/",
  },
  {
    titulo: "Términos y condiciones",
    href: "https://buenosaires.gob.ar/inicio/terminos-y-condiciones",
  },
  {
    titulo: "Política de privacidad",
    href: "https://buenosaires.gob.ar/inicio/privacidad",
  },
  {
    titulo: "Oficios judiciales",
    href: "https://buenosaires.gob.ar/gcaba_historico/legalytecnica/normativa/boletin-oficial-y-registro/oficios-judiciales",
  },
  {
    titulo: "Transparencia",
    href: "https://buenosaires.gob.ar/gcaba_historico/legalytecnica/transparencia-activa",
  },
];

/** Pie institucional de las páginas públicas (mismo que el original). */
export function Footer() {
  return (
    <footer className="border-t-4 border-[#3a535d] bg-cielo-900 text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="flex items-center gap-4">
          <p className="text-xl font-semibold sm:text-[28px] lg:text-[32px]">
            Ministerio de Educación
          </p>
          <span className="h-12 border-l-2 border-white" />
          <img
            src={escudo}
            alt="Escudo de la Ciudad Autónoma de Buenos Aires"
          />
        </div>
        <ul className="my-10 flex flex-col gap-8 sm:flex-row sm:flex-wrap lg:items-center lg:gap-6">
          {LINKS.map((link) => (
            <li key={link.titulo}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-light underline underline-offset-4 hover:decoration-2"
              >
                {link.titulo}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm font-extralight">
          Los contenidos de buenosaires.gob.ar están licenciados bajo Creative
          Commons Reconocimiento 2.5 Argentina License.
        </p>
      </div>
    </footer>
  );
}
