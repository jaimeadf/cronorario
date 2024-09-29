import { CSSProperties, useRef, useState } from "react";
import { Search } from "react-feather";

import { cn } from "@/lib/utils";

import { SearchSuggestions } from "./search-suggestions";

interface SearchInputProps {
  expand?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

function SearchInput({ expand, onFocus, onBlur }: SearchInputProps) {
  return (
    <div className="sticky inset-0 flex bg-primary p-2">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 flex items-center pl-2">
          <Search className="size-6 text-primary" />
        </div>
        <input
          type="text"
          placeholder="Cursos, disciplinas, docentes..."
          className="block h-10 w-full rounded-lg bg-tertiary p-2 pl-10 text-base text-primary placeholder:text-tertiary focus:outline-none"
          onFocus={onFocus}
          onBlurCapture={onBlur}
        />
      </div>
      <button
        className={cn(
          "max-w-0 overflow-hidden text-brand transition-all duration-100 ease-linear",
          { "max-w-20": expand },
        )}
      >
        <span className="pl-2">Cancelar</span>
      </button>
    </div>
  );
}

export function SearchBar() {
  const [expand, setExpand] = useState(false);
  const [containerOffset, setContainerOffset] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);

  function open() {
    const rect = containerRef?.current?.getBoundingClientRect();

    setExpand(true);
    setContainerOffset(rect?.top ?? 0);
  }

  function close() {
    setExpand(false);
    setContainerOffset(0);
  }

  return (
    <div ref={containerRef} className="relative h-14">
      <div
        className={cn("transition-transform duration-100 ease-linear", {
          "absolute h-[calc(var(--vvh)*100)] w-[calc(var(--vvw)*100)]": expand,
        })}
        style={{ transform: `translateY(-${containerOffset}px)` }}
      >
        <div
          className={cn(
            "relative z-50 h-full max-h-14 overflow-hidden overscroll-contain bg-primary",
            "transition-all duration-100 ease-linear",
            { "max-h-[calc(var(--vvh)*100)] overflow-scroll": expand },
          )}
        >
          <SearchInput expand={expand} onFocus={open} onBlur={close} />
          <div className="p-2">
            <SearchSuggestions input="hello" />
          </div>
        </div>
      </div>
    </div>
  );
}
