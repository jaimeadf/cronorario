import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";

import { UniversityClass, UniversitySubject } from "@cronorario/core";

import { useUniversity } from "@/app/_contexts/university-context";
import { useClasses } from "@/app/_contexts/classes-context";
import { EntityTargetKind, useFilters } from "@/app/_contexts/filters-context";

import { ClassAccordion } from "./class-accordion";

export interface SubjectGroup {
  expanded: boolean;
  subject: UniversitySubject;
  classes: UniversityClass[];
}

export function ClassList() {
  const { getSubject, getCourse } = useUniversity();
  const { classes } = useClasses();

  const {
    searchQuery,
    selectedSiteId,
    selectedEntityTargets,
    getSelectedEntityTargetsOfKind,
  } = useFilters();

  const [groups, setGroups] = useState<SubjectGroup[]>([]);

  useEffect(() => {
    const map = new Map<number, UniversityClass[]>();

    const selectedCourses = getSelectedEntityTargetsOfKind(
      EntityTargetKind.Course,
    );

    const selectedTeachers = getSelectedEntityTargetsOfKind(
      EntityTargetKind.Teacher,
    );

    function matchesSite(classs: UniversityClass) {
      const course = getCourse(classs.courseId)!;

      return course.siteId === selectedSiteId;
    }

    function matchesQuery(classs: UniversityClass) {
      const subject = getSubject(classs.subjectId)!;

      return subject.description
        .toLocaleLowerCase()
        .includes(searchQuery.toLowerCase());
    }

    function matchesCourses(classs: UniversityClass) {
      return (
        selectedCourses.length === 0 ||
        selectedCourses.includes(classs.courseId)
      );
    }

    function matchesTeachers(classs: UniversityClass) {
      return (
        selectedTeachers.length === 0 ||
        classs.teacherIds.some((id) => selectedTeachers.includes(id))
      );
    }

    function matchesCriteria(classs: UniversityClass) {
      return (
        matchesSite(classs) &&
        matchesQuery(classs) &&
        matchesCourses(classs) &&
        matchesTeachers(classs)
      );
    }

    for (const classs of classes.values()) {
      if (matchesCriteria(classs)) {
        if (!map.has(classs.subjectId)) {
          map.set(classs.subjectId, []);
        }

        map.get(classs.subjectId)!.push(classs);
      }
    }

    const groups = Array.from(map.entries()).map(([subjectId, classes]) => ({
      expanded: false,
      subject: getSubject(subjectId)!,
      classes,
    }));

    setGroups(groups);
  }, [classes, searchQuery, selectedSiteId, selectedEntityTargets, getSelectedEntityTargetsOfKind, getCourse, getSubject]);

  function handleAccordionToggle(index: number) {
    setGroups((prev) =>
      prev.map((group, i) =>
        i === index ? { ...group, expanded: !group.expanded } : group,
      ),
    );
  }

  return (
    <Virtuoso
      useWindowScroll
      data={groups}
      itemContent={(index, group) => (
        <ClassAccordion
          title={group.subject.description}
          subtitle={`${group.subject.code} • ${group.subject.workload}h • ${group.classes.length} turmas`}
          classes={group.classes}
          expanded={group.expanded}
          onToggle={() => handleAccordionToggle(index)}
        />
      )}
    />
  );
}
