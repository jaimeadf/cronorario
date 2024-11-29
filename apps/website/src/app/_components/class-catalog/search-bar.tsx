import {
  createContext,
  HTMLAttributes,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Book, Icon, Search, User } from "react-feather";

import { cn } from "@/lib/utils";

import { EntityTargetKind, useFilters } from "@/app/_contexts/filters-context";
import { useUniversity } from "@/app/_contexts/university-context";

import { useBodyScrollBlock } from "@/app/_contexts/body-scroll-context";

const MAXIMUM_SUGGESTIONS = 5;

enum SearchSuggestionKind {
  Query,
  Course,
  Teacher,
  Divider,
}

interface SearchSuggestionItem {
  kind: SearchSuggestionKind;
  label: string;
  onSelect?: () => void;
}

interface SearchContextProps {
  term: string;
  suggestions: SearchSuggestionItem[];
  expanded: boolean;
  open(): void;
  close(): void;
}

interface SearchInputProps {
  onChange(value: string): void;
}

interface SearchSuggestionDividerProps {
  label: string;
  children?: ReactNode;
}

interface SearchSuggestionButtonProps
  extends HTMLAttributes<HTMLButtonElement> {
  icon: Icon;
  label: string;
}

const SearchContext = createContext<SearchContextProps>(
  {} as SearchContextProps,
);

function SearchInput({ onChange }: SearchInputProps) {
  const { searchQuery } = useFilters();
  const { term, expanded, open, close } = useContext(SearchContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current != null) {
      if (expanded) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [expanded]);

  return (
    <div className="sticky top-0 flex bg-primary p-2">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 flex items-center pl-2">
          <Search className="size-6 text-primary" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Cursos, disciplinas, docentes..."
          className={cn(
            "block h-10 w-full rounded-lg bg-tertiary p-2 pl-10",
            "text-base text-primary placeholder:text-tertiary",
            "focus:outline-none",
          )}
          value={expanded ? term : searchQuery}
          onFocus={open}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
      <button
        type="button"
        className={cn(
          "max-w-0 overflow-hidden text-brand",
          "transition-all duration-300 ease-in-out",
          { "max-w-20": expanded },
        )}
        onClick={close}
      >
        <span className="pl-2">Cancelar</span>
      </button>
    </div>
  );
}

function SearchSuggestionDivider({ label }: SearchSuggestionDividerProps) {
  return (
    <div className="border-b border-secondary px-2 pb-2 pt-6 font-medium text-primary">
      {label}
    </div>
  );
}

function SearchSuggestionButton({
  className,
  icon,
  label,
  ...props
}: SearchSuggestionButtonProps) {
  const Icon = icon;

  return (
    <button
      {...props}
      type="button"
      className={cn(
        "group border-b border-secondary hover:border-transparent",
        "hover:outline hover:outline-bg-primary",
        className,
      )}
    >
      <div
        className={cn(
          "flex gap-2 rounded-lg bg-primary p-2",
          "group-hover:bg-primary-hover",
        )}
      >
        <Icon className="size-6 text-brand" />
        <div className="text-left text-primary">{label}</div>
      </div>
    </button>
  );
}

export function SearchSuggestions() {
  const { suggestions, expanded } = useContext(SearchContext);

  function renderItem(item: SearchSuggestionItem, index: number) {
    switch (item.kind) {
      case SearchSuggestionKind.Query:
        return (
          <SearchSuggestionButton
            key={index}
            icon={Search}
            label={item.label}
            onClick={item.onSelect}
          />
        );
      case SearchSuggestionKind.Course:
        return (
          <SearchSuggestionButton
            key={index}
            icon={Book}
            label={item.label}
            onClick={item.onSelect}
          />
        );
      case SearchSuggestionKind.Teacher:
        return (
          <SearchSuggestionButton
            key={index}
            icon={User}
            label={item.label}
            onClick={item.onSelect}
          />
        );
      case SearchSuggestionKind.Divider:
        return <SearchSuggestionDivider key={item.label} label={item.label} />;
    }
  }

  if (!expanded) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-col border-t border-secondary">
      {suggestions.map(renderItem)}
    </div>
  );
}

export function SearchBar() {
  const { teachers, courses } = useUniversity();
  const { selectedSiteId, setSearchQuery, addEntityTarget } = useFilters();

  const [offsetTop, setOffsetTop] = useState(0);

  const [expanded, setExpanded] = useState(false);
  const [term, setTerm] = useState("");

  const containerRef = useRef<HTMLDivElement | null>(null);

  const suggestions = useMemo(() => {
    function handleQuerySuggestionSelect() {
      setSearchQuery(term);
      close();
    }

    function handleCourseSuggestionSelect(courseId: number) {
      addEntityTarget({ kind: EntityTargetKind.Course, id: courseId });
      close();
    }

    function handleTeacherSuggestionSelect(teacherId: number) {
      addEntityTarget({ kind: EntityTargetKind.Teacher, id: teacherId });
      close();
    }

    const courseItems = Array.from(courses.values())
      .filter((course) => course.siteId === selectedSiteId)
      .filter((course) =>
        course.name.toLowerCase().includes(term.toLowerCase()),
      )
      .slice(0, MAXIMUM_SUGGESTIONS)
      .map((course) => ({
        kind: SearchSuggestionKind.Course,
        label: course.name,
        onSelect: () => handleCourseSuggestionSelect(course.id),
      }));

    const teacherItems = Array.from(teachers.values())
      .filter((teacher) =>
        teacher.name.toLowerCase().includes(term.toLowerCase()),
      )
      .slice(0, MAXIMUM_SUGGESTIONS)
      .map((teacher) => ({
        kind: SearchSuggestionKind.Teacher,
        label: teacher.name,
        onSelect: () => handleTeacherSuggestionSelect(teacher.id),
      }));

    return [
      {
        kind: SearchSuggestionKind.Query,
        label: term,
        onSelect: handleQuerySuggestionSelect,
      },
      { kind: SearchSuggestionKind.Divider, label: "Cursos" },
      ...courseItems,
      { kind: SearchSuggestionKind.Divider, label: "Docentes" },
      ...teacherItems,
    ];
  }, [
    term,
    courses,
    teachers,
    selectedSiteId,
    setSearchQuery,
    addEntityTarget,
  ]);

  useBodyScrollBlock(expanded);

  function open() {
    const rect = containerRef?.current?.getBoundingClientRect();

    setOffsetTop(rect?.top ?? 0);
    setExpanded(true);
    setTerm("");
  }

  function close() {
    setOffsetTop(0);
    setExpanded(false);
  }

  function handleTermChange(value: string) {
    setTerm(value);
  }

  function handleTermSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchQuery(term);
    close();
  }

  return (
    <SearchContext.Provider
      value={{
        term,
        suggestions,
        expanded,
        open,
        close,
      }}
    >
      <div ref={containerRef} className="h-14">
        <form
          className={cn(
            "h-14 bg-primary",
            "transition-[transform,height] duration-200 ease-in-out",
            {
              "fixed h-[calc(var(--vvh)*100)] w-[calc(var(--vvw)*100)] overflow-y-scroll overscroll-contain":
                expanded,
            },
          )}
          style={{
            top: offsetTop,
            transform: `translateY(-${offsetTop}px)`,
          }}
          onSubmit={handleTermSubmit}
        >
          <SearchInput onChange={handleTermChange} />
          <SearchSuggestions />
        </form>
      </div>
    </SearchContext.Provider>
  );
}
