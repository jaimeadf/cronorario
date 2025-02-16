"use client";

import { createContext, useContext, type ReactNode } from "react";
import { Icon } from "react-feather";

import { cn } from "@/lib/utils";

interface TabBarContextProps {
  selectedTabId?: string | number;
  onTabSelect?: (id: string | number) => void;
}

interface TabBarProps {
  children?: ReactNode;
  selectedTabId?: string | number;
  onTabSelect?: (id: string | number) => void;
}

interface TabProps {
  id: string | number;
  icon: Icon;
  badge?: ReactNode;
}

const TabBarContext = createContext({} as TabBarContextProps);

export function TabBar({ children, selectedTabId, onTabSelect }: TabBarProps) {
  return (
    <TabBarContext.Provider value={{ selectedTabId, onTabSelect }}>
      <div className="ml-auto flex gap-2 rounded-lg bg-tertiary">
        {children}
      </div>
    </TabBarContext.Provider>
  );
}

export function Tab({ id, icon, badge }: TabProps) {
  const { selectedTabId, onTabSelect } = useContext(TabBarContext);
  const Icon = icon;

  const selected = selectedTabId == id;

  return (
    <button
      className={cn(
        "relative rounded-lg bg-tertiary text-primary",
        "hover:bg-tertiary-hover",
        {
          "bg-brand text-onbrand hover:bg-brand": selected,
        },
      )}
      onClick={onTabSelect?.bind(null, id)}
    >
      <Icon className="size-10 p-2" strokeWidth={2} />
      {badge !== undefined && badge !== null && (
        <div
          className={cn(
            "absolute right-0 top-0",
            "flex h-4 min-w-4 items-center justify-center",
            "rounded-full bg-brand px-1",
            "border border-ontertiary",
            "text-xs font-medium leading-none text-onbrand",
            { "border-onbrand": selected },
          )}
        >
          {badge}
        </div>
      )}
    </button>
  );
}
