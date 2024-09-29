import { useEffect, useState } from "react";

import { CourseClass, useClasses } from "../../_contexts/classes-context";

import { Toolbar } from "./toolbar";
import { ClassAccordion } from "./class-accordion";

export function ClassCatalog() {
  const [groups, setGroups] = useState<Record<string, CourseClass[]>>({});

  const { classes } = useClasses();

  useEffect(() => {
    const groups = {} as Record<string, CourseClass[]>;

    for (const c of classes.slice(0, 1000)) {
      if (!Object.hasOwn(groups, c.subject.id)) {
        groups[c.subject.id] = [];
      }

      groups[c.subject.id].push(c);
    }

    console.log(groups);

    setGroups(groups);
  }, [classes]);

  return (
    <div>
      <Toolbar />
      <div className="p-2">
        <div className="w-full border-t border-secondary">
          {Object.entries(groups).map(([subjectId, group = []]) => (
            <ClassAccordion
              key={subjectId}
              title={group[0].subject.description}
              subtitle={`${group[0].subject.code} • ${group[0].subject.workload}h • ${group.length} turmas`}
              classes={group}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
