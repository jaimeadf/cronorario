import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  UniversityTerm,
  UniversitySite,
  UniversityCourse,
  UniversityCourseVersion,
  UniversitySubject,
  UniversityCurriculum,
  UniversityTeacher,
  getTermsPath,
  getSitesPath,
  getCoursesPath,
  getCourseVersionsPath,
  getSubjectsPath,
  getCurriculaPath,
  getTeachersPath,
} from "@cronorario/core";

import { RESOURCE_BASE_URL } from "@/lib/environment";

interface UniversityContextProps {
  terms: UniversityTerm[];
  sites: Map<number, UniversitySite>;
  courses: Map<number, UniversityCourse>;
  courseVersions: Map<number, UniversityCourseVersion>;
  subjects: Map<number, UniversitySubject>;
  curricula: Map<number, UniversityCurriculum>;
  teachers: Map<number, UniversityTeacher>;

  isUniversityLoading: boolean;

  getSite(siteId: number): UniversitySite | undefined;
  getCourse(courseId: number): UniversityCourse | undefined;
  getCourseVersion(
    courseVersionId: number,
  ): UniversityCourseVersion | undefined;
  getSubject(subjectId: number): UniversitySubject | undefined;
  getTeacher(teacherId: number): UniversityTeacher | undefined;
  getCurriculum(curriculumId: number): UniversityCurriculum | undefined;
}

interface UniversityProviderProps {
  children?: ReactNode;
}

const UniversityContext = createContext({} as UniversityContextProps);

export function UniversityProvider({ children }: UniversityProviderProps) {
  const [terms, setTerms] = useState<UniversityTerm[]>([]);
  const [sites, setSites] = useState<Map<number, UniversitySite>>(new Map());
  const [courses, setCourses] = useState<Map<number, UniversityCourse>>(
    new Map(),
  );
  const [courseVersions, setCourseVersions] = useState<
    Map<number, UniversityCourseVersion>
  >(new Map());
  const [subjects, setSubjects] = useState<Map<number, UniversitySubject>>(
    new Map(),
  );
  const [curricula, setCurricula] = useState<Map<number, UniversityCurriculum>>(
    new Map(),
  );
  const [teachers, setTeachers] = useState<Map<number, UniversityTeacher>>(
    new Map(),
  );
  const [isUniversityLoading, setIsUniversityLoading] = useState(true);

  function getSite(siteId: number) {
    return sites.get(siteId);
  }

  function getCourse(courseId: number) {
    return courses.get(courseId);
  }

  function getCourseVersion(courseVersionId: number) {
    return courseVersions.get(courseVersionId);
  }

  function getSubject(subjectId: number) {
    return subjects.get(subjectId);
  }

  function getTeacher(teacherId: number) {
    return teachers.get(teacherId);
  }

  function getCurriculum(curriculumId: number) {
    return curricula.get(curriculumId);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadResource<T>(path: string) {
      const response = await fetch(`${RESOURCE_BASE_URL}/${path}`, {
        signal: controller.signal,
      });
      const data = await response.json();

      return data as T;
    }

    async function loadDataSet() {
      const [
        terms,
        sites,
        courses,
        courseVersions,
        subjects,
        curricula,
        teachers,
      ] = await Promise.all([
        loadResource<UniversityTerm[]>(getTermsPath()),
        loadResource<UniversitySite[]>(getSitesPath()),
        loadResource<UniversityCourse[]>(getCoursesPath()),
        loadResource<UniversityCourseVersion[]>(getCourseVersionsPath()),
        loadResource<UniversitySubject[]>(getSubjectsPath()),
        loadResource<UniversityCurriculum[]>(getCurriculaPath()),
        loadResource<UniversityTeacher[]>(getTeachersPath()),
      ]);

      setTerms(terms.sort((a, b) => {
        if (a.year !== b.year) {
          return b.year - a.year;
        }

        return b.period - a.period;
      }));
      setSites(new Map(sites.map((site) => [site.id, site])));
      setCourses(new Map(courses.map((course) => [course.id, course])));
      setCourseVersions(
        new Map(courseVersions.map((version) => [version.id, version])),
      );
      setSubjects(new Map(subjects.map((subject) => [subject.id, subject])));
      setCurricula(
        new Map(curricula.map((curriculum) => [curriculum.id, curriculum])),
      );
      setTeachers(new Map(teachers.map((teacher) => [teacher.id, teacher])));

      setIsUniversityLoading(false);

      console.log("here");
    }

    loadDataSet();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <UniversityContext.Provider
      value={{
        terms,
        sites,
        courses,
        courseVersions,
        subjects,
        teachers,
        curricula,
        isUniversityLoading,
        getSite,
        getCourse,
        getCourseVersion,
        getSubject,
        getTeacher,
        getCurriculum,
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
}

export function useUniversity() {
  return useContext(UniversityContext);
}
