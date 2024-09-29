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
    <div className="sticky inset-0 flex p-2 bg-primary">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 flex items-center pl-2 pointer-events-none">
          <Search className="size-6 text-primary" />
        </div>
        <input
          type="text"
          placeholder="Cursos, disciplinas, docentes..."
          className="block w-full h-10 p-2 pl-10 rounded-lg text-base text-primary bg-tertiary placeholder:text-tertiary focus:outline-none"
          onFocus={onFocus}
          onBlurCapture={onBlur}
        />
      </div>
      <button
        className={cn(
          "text-brand max-w-0 overflow-hidden transition-all duration-100 ease-linear",
          { "max-w-20": expand }
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
        className={cn(
          "transition-transform duration-100 ease-linear",
          { "absolute w-[calc(var(--vvw)*100)] h-[calc(var(--vvh)*100)]": expand }
        )}
        style={{ "transform": `translateY(-${containerOffset}px)` }}
      >
        <div
          className={cn(
            "relative z-50 h-full max-h-14 overflow-hidden overscroll-contain bg-primary transition-all duration-100 ease-linear",
            { "max-h-[calc(var(--vvh)*100)] overflow-scroll": expand }
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