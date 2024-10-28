export interface UniversityTerm {
  year: number;
  period: number;
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
  status: string;
  courseId: number;
}

export interface UniversitySubject {
  id: number;
  code: string;
  description: string;
  status: string;
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
  teacherIds: number[];
  schedule: UniversityTimeSlot[];
}

export interface UniversityDataSet {
  courses: UniversityCourse[];
  courseVersions: UniversityCourseVersion[];
  subjects: UniversitySubject[];
  curricula: UniversityCurriculum[];
  teachers: UniversityTeacher[];
  classes: UniversityClass[];
}