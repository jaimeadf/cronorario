import { ReactNode } from "react";
import { ChevronDown, Icon } from "react-feather";

interface FilterPillProps {
  children?: ReactNode;
}

interface FilterButtonProps {
  icon: Icon;
  value: string;
}

interface FilterDropdownProps {
  icon: Icon;
  value: string;
}

interface FilterBarProps {
  children?: ReactNode;
}

function FilterPill({ children }: FilterPillProps) {
  return (
    <button className="shrink-0 flex items-center gap-2 w-fit h-8 px-2 rounded-lg bg-tertiary hover:bg-tertiary-hover">
      {children}
    </button>
  );
}

export function FilterButton({ icon, value }: FilterButtonProps) {
  const Icon = icon;

  return (
    <FilterPill>
      <Icon className="size-4 text-secondary" />
      <div className="font-medium text-sm text-secondary">
        {value}
      </div>
    </FilterPill>
  );
}

export function FilterDropdown({ icon, value }: FilterDropdownProps) {
  const Icon = icon;

  return (
    <FilterPill>
      <Icon className="size-4 text-secondary" />
      <div className="font-medium text-sm text-secondary">
        {value}
      </div>
      <ChevronDown className="size-4 text-tertiary" />
    </FilterPill>
  );
}

export function FilterBar({ children }: FilterBarProps) {
  return (
    <div className="flex gap-2 px-2 overflow-x-scroll">
      {children}
    </div>
  );
}