import { useCallback, useState, type ReactNode } from "react";
import { ChevronLeft } from "react-feather";
import { useTransition, animated, easings } from "react-spring";

import { UniversityClass } from "@cronorario/core";

import { cn } from "@/lib/utils";

import { ClassCard } from "./class-card";

interface ClassAccordionProps {
  title: ReactNode;
  subtitle: ReactNode;
  classes: UniversityClass[];
  expanded: boolean;
  onToggle?: () => void;
}

export function ClassAccordion({
  title,
  subtitle,
  classes,
  expanded,
  onToggle,
}: ClassAccordionProps) {
  const [wasExpanded, setWasExpanded] = useState(expanded);
  const [bodyHeight, setBodyHeight] = useState(0);

  const bodyRef = useCallback((node: HTMLDivElement) => {
    const observer = new ResizeObserver(() => {
      setBodyHeight(node.offsetHeight);
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const transitions = useTransition(expanded, {
    from: { opacity: 0, height: 0 },
    enter: { opacity: 1, height: bodyHeight },
    leave: { height: 0, opacity: 0 },
    update: { height: bodyHeight },
    config: {
      duration: 200,
      easing: easings.easeInOutQuad,
    },
    immediate: wasExpanded === expanded,
    onRest: () => setWasExpanded(expanded),
  });

  return (
    <div className="border-b border-secondary px-2">
      <button
        className="group flex w-full gap-2 py-4 text-left"
        onClick={onToggle}
      >
        <div className="flex flex-1 flex-col gap-0.5 group-hover:underline">
          <h2 className="font-medium text-primary">{title}</h2>
          <h3 className="text-sm text-secondary">{subtitle}</h3>
        </div>
        <ChevronLeft
          className={cn(
            "size-10 rounded-lg p-2 transition-transform duration-300 ease-in-out",
            {
              "-rotate-90": expanded,
            },
          )}
        />
      </button>
      {transitions(
        (style, item) =>
          item && (
            <animated.div className="overflow-hidden" style={style}>
              <div
                ref={bodyRef}
                className="grid grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-8 pb-8 pt-4"
              >
                {classes.map((classs) => (
                  <ClassCard key={classs.id} classs={classs} />
                ))}
              </div>
            </animated.div>
          ),
      )}
    </div>
  );
}
