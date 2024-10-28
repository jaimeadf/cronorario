import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  UniversityClass,
  UniversityCourse,
  UniversityCourseVersion,
  UniversityCurriculum,
  UniversityDataSet,
  UniversitySubject,
  UniversityTeacher,
} from "@cronorario/core";

import unknownDataSet from "@/assets/data-set.json";

interface ClassesContextProps {
  courses: Map<number, UniversityCourse>;
  courseVersions: Map<number, UniversityCourseVersion>;
  subjects: Map<number, UniversitySubject>;
  teachers: Map<number, UniversityTeacher>;
  curriculums: Map<number, UniversityCurriculum>;
  classes: Map<number, UniversityClass>;

  getCourse(courseId: number): UniversityCourse | undefined;
  getCourseVersion(
    courseVersionId: number,
  ): UniversityCourseVersion | undefined;
  getSubject(subjectId: number): UniversitySubject | undefined;
  getTeacher(teacherId: number): UniversityTeacher | undefined;
  getCurriculum(curriculumId: number): UniversityCurriculum | undefined;
  getClass(classId: number): UniversityClass | undefined;
}

interface ClassesProviderProps {
  children?: ReactNode;
}

const ClassesContext = createContext({} as ClassesContextProps);

export function ClassesProvider({ children }: ClassesProviderProps) {
  const [courses, setCourses] = useState(new Map<number, UniversityCourse>());
  const [courseVersions, setCourseVersions] = useState(
    new Map<number, UniversityCourseVersion>(),
  );
  const [subjects, setSubjects] = useState(
    new Map<number, UniversitySubject>(),
  );
  const [teachers, setTeachers] = useState(
    new Map<number, UniversityTeacher>(),
  );
  const [curriculums, setCurriculums] = useState(
    new Map<number, UniversityCurriculum>(),
  );
  const [classes, setClasses] = useState(new Map<number, UniversityClass>());

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
    return curriculums.get(curriculumId);
  }

  function getClass(classId: number) {
    return classes.get(classId);
  }

  useEffect(() => {
    const universityDataSet = unknownDataSet as UniversityDataSet;

    const newCourses = new Map<number, UniversityCourse>();
    const newCourseVersions = new Map<number, UniversityCourseVersion>();
    const newSubjects = new Map<number, UniversitySubject>();
    const newTeachers = new Map<number, UniversityTeacher>();
    const newCurriculums = new Map<number, UniversityCurriculum>();
    const newClasses = new Map<number, UniversityClass>();

    for (const course of universityDataSet.courses) {
      newCourses.set(course.id, course);
    }

    for (const courseVersion of universityDataSet.courseVersions) {
      newCourseVersions.set(courseVersion.id, courseVersion);
    }

    for (const subject of universityDataSet.subjects) {
      newSubjects.set(subject.id, subject);
    }

    for (const teacher of universityDataSet.teachers) {
      newTeachers.set(teacher.id, teacher);
    }

    for (const curriculum of universityDataSet.curricula) {
      newCurriculums.set(curriculum.id, curriculum);
    }

    for (const classs of universityDataSet.classes) {
      newClasses.set(classs.id, classs);
    }

    setCourses(newCourses);
    setCourseVersions(newCourseVersions);
    setSubjects(newSubjects);
    setTeachers(newTeachers);
    setCurriculums(newCurriculums);
    setClasses(newClasses);
  }, []);

  return (
    <ClassesContext.Provider
      value={{
        courses,
        courseVersions,
        subjects,
        teachers,
        curriculums,
        classes,
        getCourse,
        getCourseVersion,
        getSubject,
        getTeacher,
        getCurriculum,
        getClass,
      }}
    >
      {children}
    </ClassesContext.Provider>
  );
}

export function useClasses() {
  return useContext(ClassesContext);
}
