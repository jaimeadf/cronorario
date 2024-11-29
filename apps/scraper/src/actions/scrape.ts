import path from "path";

import { UniversityTerm } from "@cronorario/core";

import {
  discoverCourseIds,
  fetchCourseCurrentPeriod,
  fetchCourseSubjectsByPeriod,
} from "../services/ufsm";

import {
  UniversityTermArgumentKind,
  UniversityTermArgument,
} from "../arguments";

import { writeJsonFile } from "../io";

export interface ScrapingArtifact {
  timestamp: number;
  term: UniversityTerm;
  courseId: number;
  result: any;
}

export async function scrape(
  termArguments: UniversityTermArgument[],
  filePathTemplate: string,
) {
  console.info("[INFO] Discovering course IDs...");
  const rawCourseIds = await discoverCourseIds();
  const courseIds = rawCourseIds.map((id) => parseInt(id));

  for (let i = 0; i < termArguments.length; i++) {
    const termArgument = termArguments[i];

    console.info(
      `[INFO] Scraping courses for term argument of kind ` +
        `${UniversityTermArgumentKind[termArgument.kind]}... ` +
        `(${i + 1}/${termArguments.length})`,
    );

    for (let j = 0; j < courseIds.length; j++) {
      const courseId = courseIds[j];
      const term = await resolveTermArgument(termArgument, courseId);

      console.info(
        `[INFO] Scraping course ${courseId} for term ` +
          `${term.year}.${term.period}... (${j + 1}/${courseIds.length})`,
      );

      const payload = await fetchCourseSubjectsByPeriod(
        courseId.toString(),
        term.year,
        term.period,
      );

      const artifact: ScrapingArtifact = {
        timestamp: Math.floor(Date.now() / 1000),
        term,
        courseId,
        result: payload,
      };

      let filePath = filePathTemplate;
      filePath = filePath.replace("{YEAR}", term.year.toString());
      filePath = filePath.replace("{PERIOD}", term.period.toString());
      filePath = filePath.replace("{COURSE_ID}", courseId.toString());

      console.info(`[INFO] Writing artifact to ${path.basename(filePath)}...`);
      await writeJsonFile(filePath, artifact);
    }
  }
}

async function resolveTermArgument(
  argument: UniversityTermArgument,
  courseId: number,
) {
  switch (argument.kind) {
    case UniversityTermArgumentKind.Current:
      const data = await fetchCourseCurrentPeriod(courseId.toString());

      return {
        year: data.itens.oferta.ano,
        period: data.itens.oferta.periodo.item,
      } as UniversityTerm;
    case UniversityTermArgumentKind.Exact:
      return argument.term;
  }
}
