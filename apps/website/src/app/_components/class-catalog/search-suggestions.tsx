import { HTMLAttributes, ReactNode, useMemo } from "react";
import { Book, Icon, Search, User } from "react-feather";

import { cn } from "@/lib/utils";

import { useClasses } from "../../_contexts/classes-context";
import { useFilters } from "@/app/_contexts/filters-context";

interface SearchSectionProps {
  title: string;
  children?: ReactNode;
}

interface SearchSuggestionProps extends HTMLAttributes<HTMLButtonElement> {
  icon: Icon;
  label: string;
}

interface SearchSuggestionsProps {
  query: string;
}

function SearchSection({ title, children }: SearchSectionProps) {
  return (
    <div className="flex flex-col">
      <div className="border-b border-secondary p-2 font-medium text-primary">
        {title}
      </div>
      {children}
    </div>
  );
}

function SearchSuggestion({ className, icon, label, ...props }: SearchSuggestionProps) {
  const Icon = icon;

  return (
    <button
      {...props}
      className={cn(
        "group border-b border-secondary hover:border-transparent hover:outline hover:outline-bg-primary",
        className,
      )}
    >
      <div className="flex gap-2 rounded-lg bg-primary p-2 group-hover:bg-primary-hover">
        <Icon className="size-6 text-brand" />
        <div className="text-primary text-left">{label}</div>
      </div>
    </button>
  );
}

export function SearchSuggestions({ query }: SearchSuggestionsProps) {
  const { courses, teachers } = useClasses();
  const { selectedSiteId, setSearchQuery, addCourseFilter, addTeacherFilter } = useFilters();

  const suggestedCourses = useMemo(
    () =>
      Array.from(courses.values())
        .filter((course) => course.siteId === selectedSiteId)
        .filter((course) =>
          course.name.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5),
    [query, courses],
  );

  const suggestedTeachers = useMemo(
    () =>
      Array.from(teachers.values())
        .filter((teacher) =>
          teacher.name.toLowerCase().includes(query.toLowerCase()),
        )
        .slice(0, 5),
    [query, teachers],
  );

  function handleQuerySuggestionClick() {
    console.log("query", query);
    setSearchQuery(query);
  }

  function handleCourseSuggestionClick(courseId: number) {
    addCourseFilter(courseId);
  }

  function handleTeacherSuggestionClick(teacherId: number) {
    addTeacherFilter(teacherId);
  }

  return (
    <div className="flex flex-col gap-4 border-t border-secondary">
      <SearchSuggestion
        icon={Search}
        label={query}
        onClick={handleQuerySuggestionClick}
      />
      <SearchSection title="Cursos">
        {suggestedCourses.map((course) => (
          <SearchSuggestion
            key={course.id}
            icon={Book}
            label={course.name}
            onClick={handleCourseSuggestionClick.bind(null, course.id)}
          />
        ))}
      </SearchSection>
      <SearchSection title="Professores">
        {suggestedTeachers.map((teacher) => (
          <SearchSuggestion
            key={teacher.id}
            icon={User}
            label={teacher.name}
            onClick={handleTeacherSuggestionClick.bind(null, teacher.id)}
          />
        ))}
      </SearchSection>
    </div>
  );
}
