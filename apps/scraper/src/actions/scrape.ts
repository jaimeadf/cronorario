import { UniversityTerm } from "@cronorario/core";

import {
  UniversityTermArgumentKind,
  UniversityTermArgument,
} from "../arguments";
import {
  discoverCourseIds,
  fetchCourseCurrentPeriod,
  fetchCourseSubjectsByPeriod,
} from "../services/ufsm";

export interface ScrapingArtifact {
  timestamp: number;
  term: UniversityTerm;
  courseId: number;
  result: any;
}

export async function scrape(termArguments: UniversityTermArgument[]) {
  const artifacts: ScrapingArtifact[] = [];

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

      artifacts.push(artifact);
    }
  }

  return artifacts;
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
