import fs from "fs/promises";
import path from "path";

import {
  UniversitySite,
  UniversityTerm,
  UniversityCourse,
  UniversityCourseVersion,
  UniversitySubject,
  UniversityCurriculum,
  UniversityTeacher,
  UniversityClass,
  getSitesPath,
  getTermsPath,
  getCoursesPath,
  getCourseVersionsPath,
  getCurriculaPath,
  getTeachersPath,
  getSubjectsPath,
  getFramePath,
} from "@cronorario/core";

import { readJsonFile, writeJsonFile } from "../io";
import { discoverSiteNames } from "../services/ufsm";

import { ScrapingArtifact } from "./scrape";

export async function compile(inputDirPath: string, outputDirPath: string) {
  console.info("[INFO] Discovering site names...");
  const siteNames = await discoverSiteNames();

  console.info("[INFO] Discovering scraping artifacts...");
  const artifactFilenames = await fs.readdir(inputDirPath);

  const sites = new Array<UniversitySite>();
  const terms = new Cache<string, UniversityTerm>();
  const courses = new Cache<number, UniversityCourse>();
  const courseVersions = new Cache<number, UniversityCourseVersion>();
  const subjects = new Cache<number, UniversitySubject>();
  const curricula = new Cache<number, UniversityCurriculum>();
  const teachers = new Cache<number, UniversityTeacher>();
  const frames = new Map<string, Cache<number, UniversityClass>>();

  for (const [siteId, siteName] of Object.entries(siteNames)) {
    sites.push({ id: parseInt(siteId), name: siteName });
  }

  for (const artifactFilename of artifactFilenames) {
    console.info(`[INFO] Compiling artifact from ${artifactFilename}...`);

    const artifactPath = path.join(inputDirPath, artifactFilename);
    const artifact = await readJsonFile<ScrapingArtifact>(artifactPath);

    if (artifact.result.error) {
      continue;
    }

    const timestamp = artifact.timestamp;
    const term = artifact.term;

    const termKey = `${term.year}-${term.period}`;

    const classes = frames.get(termKey) ?? new Cache<number, UniversityClass>();

    terms.set(termKey, term, timestamp);
    frames.set(termKey, classes);

    for (const item of artifact.result.itens) {
      for (const rawSubjectClasses of item.disciplinaTurmas) {
        for (const rawClass of rawSubjectClasses.turmas) {
          const rawClassCourse = rawClass.curso;
          const rawClassSubject = rawClass.disciplina;
          const rawClassCurriculum = rawClass.disciplinaCurriculo;

          const rawClassCurriculumCourseVersion =
            rawClassCurriculum.estrutura.versaoCurso;
          const rawClassCurriculumCourse =
            rawClassCurriculumCourseVersion.curso;
          const rawClassTeachers = rawClass.docentes;

          const classs = formatClass(rawClass, artifact.term);
          const classCourse = formatCourse(rawClassCourse);
          const classSubject = formatSubject(rawClassSubject);
          const classCurriculum = formatCurriculum(rawClassCurriculum);
          const classCurriculumCourseVersion = formatCourseVersion(
            rawClassCurriculumCourseVersion,
          );
          const classCurriculumCourse = formatCourse(rawClassCurriculumCourse);
          const classTeachers: UniversityTeacher[] = rawClassTeachers.map(
            (rawTeacher: any) => formatTeacher(rawTeacher),
          );

          classes.set(classs.id, classs, timestamp);

          courses.set(classCourse.id, classCourse, timestamp);
          courses.set(
            classCurriculumCourse.id,
            classCurriculumCourse,
            timestamp,
          );

          subjects.set(classSubject.id, classSubject, timestamp);

          curricula.set(classCurriculum.id, classCurriculum, timestamp);
          courseVersions.set(
            classCurriculumCourseVersion.id,
            classCurriculumCourseVersion,
            timestamp,
          );

          for (const teacher of classTeachers) {
            teachers.set(teacher.id, teacher, timestamp);
          }
        }
      }
    }
  }

  console.info(`[INFO] Writing compiled data...`);
  const sitesPath = path.join(outputDirPath, getSitesPath());
  const termsPath = path.join(outputDirPath, getTermsPath());
  const coursesPath = path.join(outputDirPath, getCoursesPath());
  const courseVersionsPath = path.join(outputDirPath, getCourseVersionsPath());
  const subjectsPath = path.join(outputDirPath, getSubjectsPath());
  const curriculaPath = path.join(outputDirPath, getCurriculaPath());
  const teachersPath = path.join(outputDirPath, getTeachersPath());

  await writeJsonFile(sitesPath, sites);
  await writeJsonFile(termsPath, terms.all());
  await writeJsonFile(coursesPath, courses.all());
  await writeJsonFile(courseVersionsPath, courseVersions.all());
  await writeJsonFile(curriculaPath, curricula.all());
  await writeJsonFile(teachersPath, teachers.all());
  await writeJsonFile(subjectsPath, subjects.all());

  for (const [termKey, classes] of frames.entries()) {
    const term = terms.get(termKey)!;
    const frame = { term, classes: classes.all() };

    const framePath = path.join(outputDirPath, getFramePath(term));

    await writeJsonFile(framePath, frame);
  }
}

function formatCourse(rawCourse: any): UniversityCourse {
  return {
    id: rawCourse.id,
    code: rawCourse.codigo ?? "",
    name: rawCourse.nomeEmec ?? rawCourse.nome ?? "",
    levelId: rawCourse.nivel?.item ?? 0,
    siteId: rawCourse.local?.item ?? 0,
  };
}

function formatCourseVersion(rawCourseVersion: any): UniversityCourseVersion {
  return {
    id: rawCourseVersion.id,
    number: rawCourseVersion.numero,
    description: rawCourseVersion.descricao,
    // status: rawCourseVesion.situacao.codigo,
    courseId: rawCourseVersion.curso.id,
  };
}

function formatSubject(rawSubject: any): UniversitySubject {
  return {
    id: rawSubject.id,
    code: rawSubject.codigo,
    description: rawSubject.descricao,
    // status: rawSubject.situacao.codigo,
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
      type: rawTimeSlot.tipo?.descricao,
      dayOfWeek: rawTimeSlot.diaSemana.descricao,
    })),
  };
}

interface CacheEntry<V> {
  timestamp: number;
  value: V;
}

class Cache<K, V> {
  private map: Map<K, CacheEntry<V>> = new Map();

  public get(key: K) {
    return this.map.get(key)?.value;
  }

  public set(key: K, value: V, timestamp: number) {
    const item = this.map.get(key);

    if (!item || item.timestamp < timestamp) {
      this.map.set(key, { timestamp, value });
    }
  }

  public all() {
    return Array.from(this.map.values()).map((entry) => entry.value);
  }
}
