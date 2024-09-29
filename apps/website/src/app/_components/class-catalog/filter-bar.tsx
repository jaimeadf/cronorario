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
    <button className="flex h-8 w-fit shrink-0 items-center gap-2 rounded-lg bg-tertiary px-2 hover:bg-tertiary-hover">
      {children}
    </button>
  );
}

export function FilterButton({ icon, value }: FilterButtonProps) {
  const Icon = icon;

  return (
    <FilterPill>
      <Icon className="size-4 text-secondary" />
      <div className="text-sm font-medium text-secondary">{value}</div>
    </FilterPill>
  );
}

export function FilterDropdown({ icon, value }: FilterDropdownProps) {
  const Icon = icon;

  return (
    <FilterPill>
      <Icon className="size-4 text-secondary" />
      <div className="text-sm font-medium text-secondary">{value}</div>
      <ChevronDown className="size-4 text-tertiary" />
    </FilterPill>
  );
}

export function FilterBar({ children }: FilterBarProps) {
  return <div className="flex gap-2 overflow-x-scroll px-2">{children}</div>;
}
