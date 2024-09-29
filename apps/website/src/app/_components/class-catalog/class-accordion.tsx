import {
  CSSProperties,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft } from "react-feather";

import { cn } from "@/lib/utils";

import { ClassCard } from "./class-card";

import { CourseClass } from "../../_contexts/classes-context";

interface ClassAccordionProps {
  title: ReactNode;
  subtitle: ReactNode;
  classes: CourseClass[];
}

export function ClassAccordion({
  title,
  subtitle,
  classes,
}: ClassAccordionProps) {
  const [expand, setExpand] = useState(false);
  const [bodyHeight, setBodyHeight] = useState(0);

  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(refreshBodyHeight, []);

  function toggle() {
    setExpand(!expand);
  }

  function refreshBodyHeight() {
    setBodyHeight(bodyRef?.current?.offsetHeight ?? 0);
  }

  return (
    <div className="border-b border-secondary px-2">
      <button
        className="group flex w-full gap-2 py-4 text-left"
        onClick={toggle}
      >
        <div className="flex flex-1 flex-col gap-0.5 group-hover:underline">
          <h2 className="font-medium text-primary">{title}</h2>
          <h3 className="text-sm text-secondary">{subtitle}</h3>
        </div>
        <ChevronLeft
          className={cn(
            "size-10 rounded-lg p-2 transition-transform duration-300 ease-in-out",
            { "-rotate-90": expand },
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-y-hidden opacity-0 transition-all duration-300 ease-in-out",
          { "opacity-100": expand },
        )}
        style={{ height: `${expand ? bodyHeight : 0}px` } as CSSProperties}
      >
        <div
          ref={bodyRef}
          className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-8 pb-8 pt-4"
          onResize={refreshBodyHeight}
        >
          {classes.map((c) => (
            <ClassCard key={c.id} information={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
