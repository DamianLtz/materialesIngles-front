import { cn } from "@/lib/utils";

/**
 * Ícono de carpeta que se abre al pasar el mouse (o con el foco) por la tarjeta que
 * la contiene: la tapa se inclina y asoma una hoja. Es la carpeta de FolderFloat de
 * React Bits sin las notas flotantes ni matter-js; ángulos, curvas y tiempos son los
 * del original, a escala de ícono. El contenedor tiene que tener `group/carpeta`.
 *
 * Con "reducir movimiento" (como el original) la tapa no se mueve y la hoja solo
 * aparece con un fundido: por eso los movimientos van con `motion-safe:`.
 */

// Familias del tema con buen contraste contra la hoja blanca (amarillo y grises no).
// Las clases van escritas enteras a propósito: Tailwind solo genera las que encuentra
// literales en el código, y solo incluye las variables de color que alguna clase usa.
// Armarlas en tiempo de ejecución (`bg-${familia}-800` o `var(--color-${familia}-800)`)
// deja carpetas sin color.
const COLORES = [
  { fondo: "bg-azul-800", tapa: "from-azul-600 to-azul-700" },
  { fondo: "bg-celeste-800", tapa: "from-celeste-600 to-celeste-700" },
  { fondo: "bg-cian-800", tapa: "from-cian-600 to-cian-700" },
  { fondo: "bg-verde-800", tapa: "from-verde-600 to-verde-700" },
  { fondo: "bg-naranja-800", tapa: "from-naranja-600 to-naranja-700" },
  { fondo: "bg-rojo-800", tapa: "from-rojo-600 to-rojo-700" },
  { fondo: "bg-purpura-800", tapa: "from-purpura-600 to-purpura-700" },
  { fondo: "bg-rosa-800", tapa: "from-rosa-600 to-rosa-700" },
];

/**
 * `semilla` elige el color (ej. el id del catálogo): así cada carpeta tiene siempre
 * el mismo y no cambia en cada render, que es lo que pasaría con Math.random().
 */
export function Carpeta({ semilla }: { semilla: number }) {
  const { fondo, tapa } = COLORES[Math.abs(semilla) % COLORES.length];

  return (
    <div aria-hidden className="relative h-[42px] w-14 shrink-0 pt-[5px]">
      <div className="relative size-full">
        {/* Fondo, levemente inclinado hacia atrás, con la pestaña arriba a la izquierda */}
        <div
          className={cn(
            "absolute inset-0 origin-bottom rounded-md transform-[perspective(600px)_rotateX(8deg)]",
            fondo,
          )}
        >
          <span className="absolute -top-[5px] left-0 h-[11px] w-[42%] rounded-t-md bg-inherit" />
        </div>

        {/* Hoja: escondida, sube y aparece al abrir */}
        <div className="absolute inset-x-[8%] top-[10%] h-1/2 rounded-[3px] bg-white opacity-0 transition-[translate,opacity] duration-[312ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/carpeta:opacity-100 group-hover/carpeta:duration-[520ms] group-focus-within/carpeta:opacity-100 motion-safe:translate-y-[4px] motion-safe:group-hover/carpeta:translate-y-0 motion-safe:group-focus-within/carpeta:translate-y-0" />

        {/* Tapa: en reposo a 16°, abierta a 34° */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 h-[76%] origin-bottom rounded-md bg-linear-to-b to-60% shadow-[0_-3px_8px_rgba(0,0,0,0.25)] transition-transform duration-[520ms] ease-[cubic-bezier(0.23,1,0.32,1)] transform-[perspective(600px)_rotateX(-16deg)] motion-safe:group-hover/carpeta:transform-[perspective(600px)_rotateX(-34deg)] motion-safe:group-focus-within/carpeta:transform-[perspective(600px)_rotateX(-34deg)]",
            tapa,
          )}
        />
      </div>
    </div>
  );
}
