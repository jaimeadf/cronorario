"use client";

import { useState } from "react";
import { Search, Calendar, CheckCircle, GitHub, Sun } from "react-feather";

import { Header } from "./_components/header";

import { ClassCatalog } from "./_components/class-catalog";
import { MyClasses } from "./_components/my-classes";
import { MySchedule } from "./_components/my-schedule";

import { ClassesProvider } from "./_contexts/classes-context";
import { FiltersProvider } from "./_contexts/filters-context";

enum TabId {
  Catalog,
  MySchedule,
  MyClasses,
}

const tabs = {
  [TabId.Catalog]: ClassCatalog,
  [TabId.MyClasses]: MyClasses,
  [TabId.MySchedule]: MySchedule,
};

export default function Home() {
  const [selectedTabId, setSelectedTabId] = useState(TabId.Catalog);

  const SelectedTab = tabs[selectedTabId];

  function handleTabSelect(id: string | number) {
    setSelectedTabId(id as TabId);
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-auto">
      <Header>
        <Header.Menu>
          <Header.Menu.LinkItem
            icon={GitHub}
            label="GitHub"
            href="https://github.com/jaimeadf/cronorario"
            target="_blank"
          />
          <Header.Menu.ButtonItem icon={Sun} label="Modo Escuro" />
        </Header.Menu>
        <Header.Logo />
        <Header.TabBar
          selectedTabId={selectedTabId}
          onTabSelect={handleTabSelect}
        >
          <Header.Tab icon={Search} id={TabId.Catalog} />
          <Header.Tab icon={Calendar} id={TabId.MySchedule} />
          <Header.Tab icon={CheckCircle} id={TabId.MyClasses} badge={4} />
        </Header.TabBar>
      </Header>
      <ClassesProvider>
        <FiltersProvider>
          <SelectedTab />
        </FiltersProvider>
      </ClassesProvider>
    </div>
  );
}
