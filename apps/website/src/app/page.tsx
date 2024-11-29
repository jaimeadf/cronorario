"use client";

import { useState } from "react";
import { Search, Calendar, CheckCircle } from "react-feather";

import { Header } from "./_components/header";

import { ClassCatalog } from "./_components/class-catalog";
import { MyClasses } from "./_components/my-classes";
import { MySchedule } from "./_components/my-schedule";

import { BodyScrollLatchProvider } from "./_contexts/body-scroll-context";
import { UniversityProvider } from "./_contexts/university-context";
import { FiltersProvider } from "./_contexts/filters-context";
import { UserProvider, useUser } from "./_contexts/user-context";
import { ClassesProvider, useClasses } from "./_contexts/classes-context";

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

function App() {
  const { activeTerm } = useClasses();
  const { getSelectedClassIds } = useUser();

  const [selectedTabId, setSelectedTabId] = useState(TabId.Catalog);

  const SelectedTab = tabs[selectedTabId];
  const selectedClassIds = getSelectedClassIds(activeTerm);

  function handleTabSelect(id: string | number) {
    setSelectedTabId(id as TabId);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header>
        {/* <Header.Menu>
          <Header.Menu.LinkItem
            icon={GitHub}
            label="GitHub"
            href="https://github.com/jaimeadf/cronorario"
            target="_blank"
          />
          <Header.Menu.ButtonItem icon={Sun} label="Modo Escuro" />
        </Header.Menu> */}
        <Header.Logo />
        <Header.TabBar
          selectedTabId={selectedTabId}
          onTabSelect={handleTabSelect}
        >
          <Header.Tab icon={Search} id={TabId.Catalog} />
          <Header.Tab icon={Calendar} id={TabId.MySchedule} />
          <Header.Tab
            icon={CheckCircle}
            id={TabId.MyClasses}
            badge={selectedClassIds.length > 0 ? selectedClassIds.length : null}
          />
        </Header.TabBar>
      </Header>
      <SelectedTab />
    </div>
  );
}

export default function Home() {
  return (
    <BodyScrollLatchProvider>
      <UniversityProvider>
        <ClassesProvider>
          <FiltersProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </FiltersProvider>
        </ClassesProvider>
      </UniversityProvider>
    </BodyScrollLatchProvider>
  );
}
