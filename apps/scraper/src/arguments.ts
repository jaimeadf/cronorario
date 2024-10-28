import { UniversityTerm } from "@cronorario/core";

export enum UniversityTermArgumentKind {
  Current,
  Exact,
}

export type UniversityTermArgument =
  | { kind: UniversityTermArgumentKind.Current }
  | { kind: UniversityTermArgumentKind.Exact; term: UniversityTerm };

export function parseTermArgument(term: string) {
  const re = /^(?<year>\d+)-(?<period>\d+)$/;

  const match = re.exec(term);

  if (match) {
    return {
      kind: UniversityTermArgumentKind.Exact,
      term: {
        year: parseInt(match.groups!.year),
        period: parseInt(match.groups!.period),
      },
    };
  }

  if (term === "current") {
    return { kind: UniversityTermArgumentKind.Current };
  }

  throw new Error(`Invalid term: ${term}`);
}
