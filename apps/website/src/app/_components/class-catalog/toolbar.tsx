import { Database, MapPin, Sliders } from "react-feather";

import { cn } from "@/lib/utils";

import { SearchBar } from "./search-bar";
import { FilterBar, FilterButton, FilterDropdown } from "./filter-bar";

export function Toolbar() {
  return (
    <div className={cn("sticky inset-0 z-10 bg-primary pb-2")}>
      <SearchBar />
      <FilterBar>
        <FilterButton icon={Sliders} value="Filtros" />
        <FilterDropdown icon={Database} value="2024 - 2" />
        <FilterDropdown icon={MapPin} value="Campus Camobi - Santa Maria" />
      </FilterBar>
    </div>
  );
}
