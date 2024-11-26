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

import { useFilters } from "@/app/_contexts/filters-context";
import { useClasses } from "@/app/_contexts/classes-context";

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
  isExpanded: boolean;
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
  const { term, isExpanded, open, close } = useContext(SearchContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current != null) {
      if (isExpanded) {
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [isExpanded]);

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
          value={isExpanded ? term : searchQuery}
          onFocus={open}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
      <button
        type="button"
        className={cn(
          "max-w-0 overflow-hidden text-brand",
          "transition-all duration-300 ease-in-out",
          { "max-w-20": isExpanded },
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
      <div className={cn("flex gap-2 rounded-lg bg-primary p-2",
      "group-hover:bg-primary-hover")}>
        <Icon className="size-6 text-brand" />
        <div className="text-left text-primary">{label}</div>
      </div>
    </button>
  );
}

export function SearchSuggestions() {
  const { suggestions, isExpanded } = useContext(SearchContext);

  function renderItem(item: SearchSuggestionItem) {
    switch (item.kind) {
      case SearchSuggestionKind.Query:
        return (
          <SearchSuggestionButton
            key={item.label}
            icon={Search}
            label={item.label}
            onClick={item.onSelect}
          />
        );
      case SearchSuggestionKind.Course:
        return (
          <SearchSuggestionButton
            key={item.label}
            icon={Book}
            label={item.label}
            onClick={item.onSelect}
          />
        );
      case SearchSuggestionKind.Teacher:
        return (
          <SearchSuggestionButton
            key={item.label}
            icon={User}
            label={item.label}
            onClick={item.onSelect}
          />
        );
      case SearchSuggestionKind.Divider:
        return <SearchSuggestionDivider key={item.label} label={item.label} />;
    }
  }

  if (!isExpanded) {
    return null;
  }

  return (
    <div className="flex flex-col border-t border-secondary p-2">
      {suggestions.map(renderItem)}
    </div>
  );
}

export function SearchBar() {
  const { teachers, courses } = useClasses();
  const { selectedSiteId, setSearchQuery, addCourseFilter, addTeacherFilter } =
    useFilters();

  const [topOffset, setTopOffset] = useState(0);

  const [isExpanded, setIsExpanded] = useState(false);
  const [term, setTerm] = useState("");

  const containerRef = useRef<HTMLDivElement | null>(null);

  function open() {
    const rect = containerRef?.current?.getBoundingClientRect();

    setTopOffset(rect?.top ?? 0);
    setIsExpanded(true);
    setTerm("");
  }

  function close() {
    setTopOffset(0);
    setIsExpanded(false);
  }

  function handleTermChange(value: string) {
    setTerm(value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchQuery(term);
    close();
  }

  const suggestions = useMemo(() => {
    function handleQuerySuggestionSelect() {
      setSearchQuery(term);
      close();
    }

    function handleTeacherSuggestionSelect(teacherId: number) {
      addTeacherFilter(teacherId);
      close();
    }

    function handleCourseSuggestionSelect(courseId: number) {
      addCourseFilter(courseId);
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
    addCourseFilter,
    addTeacherFilter,
  ]);

  return (
    <SearchContext.Provider
      value={{
        term,
        suggestions,
        isExpanded,
        open,
        close,
      }}
    >
      <div ref={containerRef} className="h-14">
        <form
          className={cn(
            "h-14 overflow-y-auto bg-primary",
            "transition-[transform,height] duration-300 ease-in-out",
            {
              "fixed h-[calc(var(--vvh)*100)] w-[calc(var(--vvw)*100)]":
                isExpanded,
            },
          )}
          style={{
            top: topOffset,
            transform: `translateY(-${topOffset}px)`,
          }}
          onSubmit={handleSubmit}
        >
          <SearchInput onChange={handleTermChange} />
          <SearchSuggestions />
        </form>
      </div>
    </SearchContext.Provider>
  );
}
