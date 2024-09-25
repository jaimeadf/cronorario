import { Database, MapPin, Sliders } from "react-feather";

import { cn } from "@/lib/utils";

import { SearchBar } from "./search-bar";
import { FilterBar, FilterButton, FilterDropdown } from "./filter-bar";

export function Toolbar() {
  return (
      <div className={cn("z-10 sticky inset-0 pb-2 bg-primary")}>
        <SearchBar />
        <FilterBar>
          <FilterButton icon={Sliders} value="Filtros" />
          <FilterDropdown icon={Database} value="2023 - 2" />
          <FilterDropdown icon={MapPin} value="Campus Camobi - Santa Maria" />
        </FilterBar>
      </div>
  );
}