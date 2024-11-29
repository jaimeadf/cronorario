import { useState } from "react";
import { Database, MapPin, Book, User } from "react-feather";

import { UniversitySite, UniversityTerm } from "@cronorario/core";

import { cn } from "@/lib/utils";

import {
  EntityTarget,
  EntityTargetKind,
  useFilters,
} from "@/app/_contexts/filters-context";
import { useUniversity } from "@/app/_contexts/university-context";
import { useClasses } from "@/app/_contexts/classes-context";

import { SearchBar } from "./search-bar";
import { FilterBar, FilterDropdown, FilterTag } from "./filter-bar";

export function Toolbar() {
  const { terms, sites, getSite, getCourse, getTeacher } = useUniversity();
  const { activeTerm, setActiveTerm } = useClasses();
  const {
    selectedSiteId,
    setSelectedSiteId,
    selectedEntityTargets,
    removeEntityTarget,
  } = useFilters();

  const [siteOpen, setSiteOpen] = useState(false);
  const [termOpen, setTermOpen] = useState(false);

  const selectedSite = getSite(selectedSiteId);

  function handleTermOpen() {
    setTermOpen(true);
  }

  function handleTermClose() {
    setTermOpen(false);
  }

  function handleSiteOpen() {
    setSiteOpen(true);
  }

  function handleSiteClose() {
    setSiteOpen(false);
  }

  function handleTermSelect(term: UniversityTerm) {
    setTermOpen(false);
    setActiveTerm(term);
  }

  function handleSiteSelect(site: UniversitySite) {
    setSiteOpen(false);
    setSelectedSiteId(site.id);
  }

  function renderEntityTarget(target: EntityTarget) {
    switch (target.kind) {
      case EntityTargetKind.Course:
        return (
          <FilterTag
            key={target.id}
            icon={Book}
            label={getCourse(target.id)?.name}
            onRemove={() => removeEntityTarget(target)}
          />
        );
      case EntityTargetKind.Teacher:
        return (
          <FilterTag
            key={target.id}
            icon={User}
            label={getTeacher(target.id)?.name}
            onRemove={() => removeEntityTarget(target)}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className={cn("sticky inset-0 z-10 bg-primary pb-2")}>
      <SearchBar />
      <FilterBar>
        {/* <FilterAction icon={Sliders} label="Filtros" /> */}
        <FilterDropdown
          icon={Database}
          label={`${activeTerm.year} - ${activeTerm.period}`}
          open={termOpen}
          onOpen={handleTermOpen}
          onClose={handleTermClose}
        >
          {terms.map((term) => (
            <FilterDropdown.Item
              key={`${term.year}-${term.period}`}
              selected={
                term.year == activeTerm.year && term.period == activeTerm.period
              }
              onSelect={() => handleTermSelect(term)}
            >
              {`${term.year} - ${term.period}`}
            </FilterDropdown.Item>
          ))}
        </FilterDropdown>
        <FilterDropdown
          icon={MapPin}
          label={selectedSite?.name}
          open={siteOpen}
          onOpen={handleSiteOpen}
          onClose={handleSiteClose}
        >
          {Array.from(sites.values()).map((site) => (
            <FilterDropdown.Item
              key={site.id}
              selected={site.id == selectedSiteId}
              onSelect={() => handleSiteSelect(site)}
            >
              {site.name}
            </FilterDropdown.Item>
          ))}
        </FilterDropdown>
        {selectedEntityTargets.map(renderEntityTarget)}
      </FilterBar>
    </div>
  );
}
