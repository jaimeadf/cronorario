import { useState, type ReactNode } from "react";
import { ChevronLeft } from "react-feather";

import { cn } from "@/lib/utils";

import { ClassCard } from "./class-card";

import { CourseClass } from "../../_contexts/classes-context";

interface ClassAccordionProps {
  title: ReactNode;
  subtitle: ReactNode;
  classes: CourseClass[];
};

export function ClassAccordion({ title, subtitle, classes }: ClassAccordionProps) {
  const [expand, setExpanded] = useState(false);

  function toggle() {
    setExpanded(!expand);
  }
  
  return (
    <div className="border-b border-secondary px-2">
      <button className="group flex gap-2 w-full py-4 text-left" onClick={toggle}>
        <div className="flex-1 flex flex-col gap-0.5 text-primary group-hover:underline">
          <h2 className="font-medium">{title}</h2>
          <h3 className="text-sm">{subtitle}</h3>
        </div>
        <ChevronLeft className={cn("size-10 p-2 rounded-lg transition-transform duration-300 ease-in-out", { "-rotate-90": expand })} />
      </button>
      <div className={cn("grid grid-rows-[0fr] overflow-hidden opacity-0 transition-all duration-300 ease-in-out", { "grid-rows-[1fr] opacity-100": expand })}>
        <div className="overflow-hidden">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-8 pb-8">
            {classes.map(c => <ClassCard information={c} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
