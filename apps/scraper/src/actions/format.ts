import {
  UniversityCourse,
  UniversityCourseVersion,
  UniversitySubject,
  UniversityCurriculum,
  UniversityTeacher,
  UniversityClass,
  UniversityTerm,
  UniversityDataSet,
} from "@cronorario/core";

import { ScrapingArtifact } from "./scrape";

export function format(artifacts: ScrapingArtifact[]) {
  const courses = new Map<number, UniversityCourse>();
  const courseVersions = new Map<number, UniversityCourseVersion>();
  const subjects = new Map<number, UniversitySubject>();
  const curricula = new Map<number, UniversityCurriculum>();
  const teachers = new Map<number, UniversityTeacher>();
  const classes = new Map<number, UniversityClass>();

  for (const artifact of artifacts) {
    if (artifact.result.error) {
      continue;
    }

    for (const item of artifact.result.itens) {
      for (const rawSubjectClasses of item.disciplinaTurmas) {
        for (const rawClass of rawSubjectClasses.turmas) {
          const rawClassCourse = rawClass.curso;
          const rawClassSubject = rawClass.disciplina;
          const rawClassCurriculum = rawClass.disciplinaCurriculo;

          const rawClassCurriculumCourseVersion = rawClassCurriculum.estrutura.versaoCurso;
          const rawClassCurriculumCourse = rawClassCurriculumCourseVersion.curso;
          const rawClassTeachers = rawClass.docentes;

          const classs = formatClass(rawClass, artifact.term);
          const classCourse = formatCourse(rawClassCourse);
          const classSubject = formatSubject(rawClassSubject);
          const classCurriculum = formatCurriculum(rawClassCurriculum);
          const classCurriculumCourseVersion = formatCourseVersion(
            rawClassCurriculumCourseVersion
          );
          const classCurriculumCourse = formatCourse(rawClassCurriculumCourse);
          const classTeachers: UniversityTeacher[] = rawClassTeachers.map(
            (rawTeacher: any) => formatTeacher(rawTeacher)
          );

          classes.set(classs.id, classs);

          courses.set(classCourse.id, classCourse);
          courses.set(classCurriculumCourse.id, classCurriculumCourse);

          subjects.set(classSubject.id, classSubject);

          curricula.set(classCurriculum.id, classCurriculum);
          courseVersions.set(classCurriculumCourseVersion.id, classCurriculumCourseVersion);

          for (const teacher of classTeachers) {
            teachers.set(teacher.id, teacher);
          }
        }
      }
    }
  }

  const dataset: UniversityDataSet = {
    courses: Array.from(courses.values()),
    courseVersions: Array.from(courseVersions.values()),
    subjects: Array.from(subjects.values()),
    curricula: Array.from(curricula.values()),
    teachers: Array.from(teachers.values()),
    classes: Array.from(classes.values()),
  };

  return dataset;
}

function formatCourse(rawCourse: any): UniversityCourse {
  return {
    id: rawCourse.id,
    code: rawCourse.codigo ?? "",
    name: rawCourse.nome ?? "",
    levelId: rawCourse.nivel?.item ?? 0,
    siteId: rawCourse.local?.item ?? 0,
  };
}

function formatCourseVersion(rawCourseVersion: any): UniversityCourseVersion {
  return {
    id: rawCourseVersion.id,
    number: rawCourseVersion.numero,
    description: rawCourseVersion.descricao,
    status: rawCourseVersion.situacao.codigo,
    courseId: rawCourseVersion.curso.id,
  };
}

function formatSubject(rawSubject: any): UniversitySubject {
  return {
    id: rawSubject.id,
    code: rawSubject.codigo,
    description: rawSubject.descricao,
    status: rawSubject.situacao.codigo,
    credits: rawSubject.creditos,
    workload: rawSubject.cargaHoraria,
  };
}

function formatCurriculum(rawSubjectCurriculum: any): UniversityCurriculum {
  return {
    id: rawSubjectCurriculum.id,
    idealPeriod: rawSubjectCurriculum.periodoIdeal,
    subjectId: rawSubjectCurriculum.disciplina.id,
    courseVersionId: rawSubjectCurriculum.estrutura.versaoCurso.id,
  };
}

function formatTeacher(rawTeacher: any): UniversityTeacher {
  return {
    id: rawTeacher.id,
    name: rawTeacher.pessoa.nome,
  };
}

function formatClass(rawClass: any, term: UniversityTerm): UniversityClass {
  return {
    id: rawClass.id,
    code: rawClass.codigo,
    term: term,
    offeredSeats: rawClass.vagasOferecidas,
    occupiedSeats: rawClass.vagasOcupadas,
    curriculumId: rawClass.disciplinaCurriculo.id,
    courseId: rawClass.curso.id,
    subjectId: rawClass.disciplina.id,
    teacherIds: rawClass.docentes.map((rawTeacher: any) => rawTeacher.id),
    schedule: rawClass.horariosTurma.map((rawTimeSlot: any) => ({
      startTime: rawTimeSlot.horarioInicio,
      endTime: rawTimeSlot.horarioFim,
      type: rawTimeSlot.tipo.descricao,
      dayOfWeek: rawTimeSlot.diaSemana.descricao,
    })),
  };
}
