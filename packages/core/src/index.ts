export interface UniversitySite {
  id: number;
  name: string;
}

export interface UniversityTerm {
  year: number;
  period: number;
}

export interface UniversityTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface UniversityCourse {
  id: number;
  code: string;
  name: string;
  levelId: string;
  siteId: number;
}

export interface UniversityCourseVersion {
  id: number;
  number: string;
  description: string;
  // status: string;
  courseId: number;
}

export interface UniversitySubject {
  id: number;
  code: string;
  description: string;
  // status: string;
  credits: number;
  workload: number;
}

export interface UniversityCurriculum {
  id: number;
  idealPeriod: number;
  subjectId: number;
  courseVersionId: number;
}

export interface UniversityTeacher {
  id: number;
  name: string;
}

export interface UniversityTimeSlot {
  startTime: string;
  endTime: string;
  type: string;
  dayOfWeek: string;
}

export interface UniversityClass {
  id: number;
  code: string;
  term: UniversityTerm;
  offeredSeats: number;
  occupiedSeats: number;
  curriculumId: number;
  courseId: number;
  subjectId: number;
  teacherIds: number[];
  schedule: UniversityTimeSlot[];
}

export interface UniversityClassFrame {
  term: UniversityTerm;
  classes: UniversityClass[];
}

export function parseUniversityTime(time: string): UniversityTime {
  const [hours, minutes, seconds] = time.split(":").map(Number);

  return { hours, minutes, seconds };
}

export function getTermsPath() {
  return "terms.json";
}

export function getSitesPath() {
  return "sites.json";
}

export function getCoursesPath() {
  return "courses.json";
}

export function getCourseVersionsPath() {
  return "course-versions.json";
}

export function getCurriculaPath() {
  return "curricula.json";
}

export function getTeachersPath() {
  return "teachers.json";
}

export function getSubjectsPath() {
  return "subjects.json";
}

export function getFramePath(term: UniversityTerm) {
  return `frames/${term.year}-${term.period}.json`;
}

