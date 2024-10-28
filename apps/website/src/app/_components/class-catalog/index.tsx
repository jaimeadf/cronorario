import { useEffect, useState } from "react";

import { useClasses } from "../../_contexts/classes-context";

import { Toolbar } from "./toolbar";
import { ClassAccordion } from "./class-accordion";
import { UniversityClass, UniversitySubject } from "@cronorario/core";
import { useFilters } from "@/app/_contexts/filters-context";

export interface SubjectGroup {
  subject: UniversitySubject;
  classes: UniversityClass[];
}

export function ClassCatalog() {
  const { classes, getSubject } = useClasses();
  const { searchQuery } = useFilters();

  const [groups, setGroups] = useState<SubjectGroup[]>([]);

  useEffect(() => {
    const map = new Map<number, UniversityClass[]>();

    const filteredClasses = Array.from(classes.values()).filter((classs) => {
      const subject = getSubject(classs.subjectId)!;

      return subject.description.toLowerCase().startsWith(searchQuery.toLowerCase())
        || subject.code.toLowerCase().startsWith(searchQuery.toLowerCase());
    });

    for (const classs of filteredClasses) {
      if (!map.has(classs.subjectId)) {
        map.set(classs.subjectId, []);
      }

      map.get(classs.subjectId)!.push(classs);
    }

    const groups = Array.from(map.entries()).map(([subjectId, classes]) => ({
      subject: getSubject(subjectId)!,
      classes,
    }));

    setGroups(groups.slice(0, 100));
  }, [classes, searchQuery]);

  return (
    <div>
      <Toolbar />
      <div className="p-2">
        <div className="w-full border-t border-secondary">
          {groups.map((group, index) => (
            <ClassAccordion
              key={index}
              title={group.subject.description}
              subtitle={`${group.subject.code} • ${group.subject.workload}h • ${group.classes.length} turmas`}
              classes={group.classes}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
