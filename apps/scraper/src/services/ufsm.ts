const UFSM_HOME_BASE_URL = "https://www.ufsm.br";
const UFSM_PORTAL_BASE_URL = "https://portal.ufsm.br";

export async function discoverCourseIds() {
  const response = await fetch(`${UFSM_HOME_BASE_URL}/disciplinas/`);
  const html = await response.text();

  const re = /<script>ufsmSitesCursos = (?<json>{.+});<\/script>/g;
  const match = re.exec(html);

  if (!match) {
    return [];
  }

  const courseURLs = JSON.parse(match.groups!.json);

  return Object.keys(courseURLs);
}

export async function fetchCourseCurrentPeriod(courseId: string) {
  const response = await fetch(
    `${UFSM_PORTAL_BASE_URL}/webservice/ws/site/turma/anoPeriodoAtual.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Ufsm-Application-Id": "SiteWS",
      },
      body: new URLSearchParams({
        curso: courseId,
      }),
    },
  );

  return (await response.json()) as any;
}

export async function fetchCourseSubjectsByPeriod(
  courseId: string,
  year: number,
  period: number,
) {
  const response = await fetch(
    `${UFSM_PORTAL_BASE_URL}/webservice/ws/site/turma/disciplinasPorPeriodo.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Ufsm-Application-Id": "SiteWS",
      },
      body: new URLSearchParams({
        curso: courseId,
        ano: year.toString(),
        periodo: period.toString(),
      }),
    },
  );

  return (await response.json()) as any;
}
