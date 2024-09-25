"use client";

import { createContext, useContext, type ReactNode } from "react"
import { Icon } from "react-feather";

import { cn } from "@/lib/utils";

interface TabBarContextProps {
  selectedTabId?: string | number;
  onTabSelect?: (id: string | number) => void;
};

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

const TabBarContext = createContext<TabBarContextProps | null>(null);

export function TabBar({ children, selectedTabId, onTabSelect }: TabBarProps) {
  return (
    <TabBarContext.Provider value={{ selectedTabId, onTabSelect }}>
      <div className="flex gap-2 ml-auto rounded-lg bg-tertiary">
        {children}
      </div>
    </TabBarContext.Provider>
  );
}

export function Tab({ id, icon, badge }: TabProps) {
  const { selectedTabId, onTabSelect } = useContext(TabBarContext)!;
  const Icon = icon;

  const selected = selectedTabId == id;

  return (
    <button
      className={cn(
        "relative rounded-lg text-primary bg-tertiary hover:bg-tertiary-hover",
        { "text-onbrand bg-brand hover:bg-brand": selected }
      )}
      onClick={onTabSelect?.bind(null, id)}
    >
      <Icon className="size-10 p-2" strokeWidth={2} />
      {badge !== undefined && badge !== null && (
        <div
          className={cn(
            "absolute top-0 right-0 flex items-center justify-center h-4 min-w-4 px-1 rounded-full border",
            "font-medium text-xs leading-none",
            "text-onbrand bg-brand border-ontertiary",
            { "border-onbrand": selected }
          )}
        >
          {badge}
        </div>
      )}
    </button>
  );
}