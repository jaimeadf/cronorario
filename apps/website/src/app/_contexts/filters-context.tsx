import { createContext, useContext, useState, useEffect } from "react";
import { UniversityTerm } from "@cronorario/core";

import { useUniversity } from "./university-context";

export enum EntityTargetKind {
  Course,
  Teacher,
}

export interface EntityTarget {
  kind: EntityTargetKind;
  id: number;
}

interface FiltersContextProps {
  searchQuery: string;
  selectedTerm: UniversityTerm;
  selectedSiteId: number;
  selectedEntityTargets: EntityTarget[];

  setSearchQuery(query: string): void;
  setSelectedTerm(term: UniversityTerm): void;
  setSelectedSiteId(siteId: number): void;

  addEntityTarget(target: EntityTarget): void;
  removeEntityTarget(target: EntityTarget): void;

  isEntityTargetSelected(target: EntityTarget): boolean;

  getSelectedEntityTargetsOfKind(kind: EntityTargetKind): number[];

  clearFilters(): void;
}

interface FiltersProviderProps {
  children?: React.ReactNode;
}

const FiltersContext = createContext({} as FiltersContextProps);

export function FiltersProvider({ children }: FiltersProviderProps) {
  const { sites } = useUniversity();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<UniversityTerm>({
    year: 2024,
    period: 102,
  });
  const [selectedSiteId, setSelectedSiteId] = useState(0);
  const [selectedEntityTargets, setSelectedEntityTargets] = useState<
    EntityTarget[]
  >([]);

  function addEntityTarget(target: EntityTarget) {
    setSelectedEntityTargets((prev) => {
      if (prev.some((t) => t.id === target.id)) {
        return prev;
      }

      return [...prev, target];
    });
  }

  function removeEntityTarget(target: EntityTarget) {
    setSelectedEntityTargets((prev) => prev.filter((t) => t.id !== target.id));
  }

  function isEntityTargetSelected(target: EntityTarget) {
    return selectedEntityTargets.some((t) => t.id === target.id);
  }

  function getSelectedEntityTargetsOfKind(kind: EntityTargetKind) {
    return selectedEntityTargets
      .filter((t) => t.kind === kind)
      .map((t) => t.id);
  }

  function clearFilters() {
    setSearchQuery("");
    setSelectedTerm({ year: 0, period: 0 });
    setSelectedSiteId(0);
    setSelectedEntityTargets([]);
  }

  useEffect(() => {
    if (sites.size > 0) {
      setSelectedSiteId(sites.keys().next().value!);
    }
  }, [sites]);

  return (
    <FiltersContext.Provider
      value={{
        searchQuery,
        selectedTerm,
        selectedSiteId,
        selectedEntityTargets,
        setSearchQuery,
        setSelectedTerm,
        setSelectedSiteId,
        addEntityTarget,
        removeEntityTarget,
        isEntityTargetSelected,
        getSelectedEntityTargetsOfKind,
        clearFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
