import { type HTMLAttributes, type ReactNode } from "react";
import { X, ChevronDown, Check, Icon } from "react-feather";

import { cn } from "@/lib/utils";
import { Popover } from "@/lib/atoms/popover";

interface FilterPillProps extends HTMLAttributes<HTMLButtonElement> {}

interface FilterActionProps {
  icon: Icon;
  label?: string;
}

interface FilterTagProps {
  icon: Icon;
  label?: string;
  onRemove?(): void;
}

interface FilterDropdownProps {
  icon: Icon;
  label?: string;
  open: boolean;
  onOpen?(): void;
  onClose?(): void;
  children?: ReactNode;
}

interface FilterDropdownItemProps {
  selected: boolean;
  onSelect?(): void;
  children?: ReactNode;
}

interface FilterBarProps {
  children?: ReactNode;
}

function FilterPill({ className, children, ...props }: FilterPillProps) {
  return (
    <button
      {...props}
      className={cn(
        "flex h-8 w-fit shrink-0 items-center gap-2 rounded-lg px-2",
        "bg-tertiary hover:bg-tertiary-hover",
        "whitespace-nowrap",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function FilterAction({ icon, label }: FilterActionProps) {
  const Icon = icon;

  return (
    <FilterPill>
      <Icon className="size-4 text-secondary" />
      <div className="text-sm font-medium text-secondary">{label}</div>
    </FilterPill>
  );
}

export function FilterTag({ icon, label, onRemove }: FilterTagProps) {
  const Icon = icon;

  return (
    <FilterPill onClick={onRemove}>
      <Icon className="size-4 text-secondary" />
      <div className="text-sm font-medium text-secondary">{label}</div>
      <X className="size-4 text-tertiary" />
    </FilterPill>
  );
}

export function FilterDropdown({
  icon,
  label,
  open,
  onOpen,
  onClose,
  children,
}: FilterDropdownProps) {
  const Icon = icon;

  function handlePopoverTrigger() {
    if (open) {
      onClose?.();
    } else {
      onOpen?.();
    }
  }

  function handlePopoverClose() {
    onClose?.();
  }

  return (
    <Popover open={open} onClickOutside={handlePopoverClose}>
      <Popover.Trigger>
        <FilterPill onClick={handlePopoverTrigger}>
          <Icon className="size-4 text-secondary" />
          <div className="text-sm font-medium text-secondary">{label}</div>
          <ChevronDown className="size-4 text-tertiary" />
        </FilterPill>
      </Popover.Trigger>
      <Popover.Content
        className={cn(
          "flex flex-col",
          "min-w-[var(--popover-trigger-width)]",
          "max-h-[calc(var(--popover-available-height)-0.5rem)]",
          "my-1 overflow-y-auto overscroll-contain rounded-lg p-0.5",
          "border border-primary bg-primary shadow-sm",
        )}
      >
        {children}
      </Popover.Content>
    </Popover>
  );
}

FilterDropdown.Item = function FilterDropdownItem({
  selected,
  onSelect,
  children,
}: FilterDropdownItemProps) {
  return (
    <button
      className={cn(
        "flex h-8 shrink-0 items-center gap-2 rounded-md px-1.5",
        "hover:bg-primary-hover",
      )}
      onClick={onSelect}
    >
      <Check
        className={cn("invisible size-4 text-secondary", { visible: selected })}
      />
      <div className="whitespace-nowrap text-nowrap text-sm font-medium text-secondary">
        {children}
      </div>
    </button>
  );
};

export function FilterBar({ children }: FilterBarProps) {
  return <div className="flex gap-2 overflow-x-scroll px-2">{children}</div>;
}
