import { createContext, useContext, useState } from "react";
import { UniversityTerm } from "@cronorario/core";

interface FiltersContextProps {
  searchQuery: string;
  selectedTerm: UniversityTerm;
  selectedSiteId: number;
  selectedCoursesIds: number[];
  selectedTeachersIds: number[];

  setSearchQuery(query: string): void;
  setSelectedTerm(term: UniversityTerm): void;
  setSelectedSiteId(siteId: number): void;
  setSelectedCourses(courseIds: number[]): void;
  setSelectedTeachers(teacherIds: number[]): void;

  addCourseFilter(courseId: number): void;
  removeCourseFilter(courseId: number): void;

  addTeacherFilter(teacherId: number): void;
  removeTeacherFilter(teacherId: number): void;

  clearFilters(): void;
}

interface FiltersProviderProps {
  children?: React.ReactNode;
}

const FiltersContext = createContext({} as FiltersContextProps);

export function FiltersProvider({ children }: FiltersProviderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<UniversityTerm>({
    year: 2024,
    period: 102,
  });
  const [selectedSiteId, setSelectedSiteId] = useState(1);
  const [selectedCoursesIds, setSelectedCourses] = useState<number[]>([]);
  const [selectedTeachersIds, setSelectedTeachers] = useState<number[]>([]);

  function addCourseFilter(courseId: number) {
    setSelectedCourses((previous) => [...previous, courseId]);
  }

  function removeCourseFilter(courseId: number) {
    setSelectedCourses((previous) => previous.filter((id) => id !== courseId));
  }

  function addTeacherFilter(teacherId: number) {
    setSelectedTeachers((previous) => [...previous, teacherId]);
  }

  function removeTeacherFilter(teacherId: number) {
    setSelectedTeachers((previous) =>
      previous.filter((id) => id !== teacherId),
    );
  }

  function clearFilters() {
    setSelectedTerm({ year: 0, period: 0 });
    setSelectedSiteId(0);
    setSelectedCourses([]);
    setSelectedTeachers([]);
    setSearchQuery("");
  }

  return (
    <FiltersContext.Provider
      value={{
        searchQuery,
        selectedTerm,
        selectedSiteId,
        selectedCoursesIds,
        selectedTeachersIds,
        setSearchQuery,
        setSelectedTerm,
        setSelectedSiteId,
        setSelectedCourses,
        setSelectedTeachers,
        addCourseFilter,
        removeCourseFilter,
        addTeacherFilter,
        removeTeacherFilter,
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
