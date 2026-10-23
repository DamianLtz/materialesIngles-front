import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "cn";
import { MinusIcon, PlusIcon } from "lucide-react";

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          // Base UI escribe "data-panel-open" como atributo.
          "group/accordion-trigger relative flex flex-1 items-start justify-between gap-3 rounded-2xl border-0 bg-white px-4 py-2.5 text-left text-sm font-medium text-foreground outline-2 outline-gray-300 transition-colors duration-200 ease-out hover:outline-azul-700 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:shrink-0 data-panel-open:bg-azul-700 data-panel-open:text-white data-panel-open:outline-4 data-panel-open:outline-cian-800",
          className,
        )}
        {...props}
      >
        {children}
        <span
          data-slot="accordion-trigger-icon"
          aria-hidden
          // Sin color propio en el estado abierto: hereda currentColor del
          // Trigger, así cada instancia lo controla con su propio className
          // (ej. data-panel-open:text-azul-700 en agenda-config-item.tsx)
          // sin competir por especificidad con una clase hardcodeada acá.
          // El hover sí queda fijo acá (afecta solo al ícono, no al título,
          // que vive en otro span sin heredar de este).
          className="relative flex size-4 items-center justify-center group-hover/accordion-trigger:text-azul-700"
        >
          <PlusIcon className="absolute inset-0 size-5 transition-all duration-200 ease-out group-data-panel-open/accordion-trigger:rotate-90 group-data-panel-open/accordion-trigger:scale-50 group-data-panel-open/accordion-trigger:opacity-0" />
          <MinusIcon className="absolute inset-0 size-5 scale-50 opacity-0 transition-all duration-200 ease-out group-data-panel-open/accordion-trigger:scale-100 group-data-panel-open/accordion-trigger:opacity-100" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-300 ease-in-out data-starting-style:h-0 data-ending-style:h-0 bg-white"
      {...props}
    >
      <div
        className={cn(
          "border-x-2 border-b-2 border-gray-300 p-4 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4 rounded-b-xl",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
