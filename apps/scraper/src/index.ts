import fs from "fs/promises";
import { Command } from "commander";

import { UniversityTermArgument, parseTermArgument } from "./arguments";

import { scrape } from "./actions/scrape";
import { format } from "./actions/format";

const program = new Command();

program
  .name("scraper")
  .description(
    "A command-line tool to scrape class data from the UFSM website.",
  );

program
  .command("scrape")
  .description("Extract raw class data from the UFSM website.")
  .requiredOption(
    "-o, --output <template>",
    "The template format for to generate paths for the scraping artifacts. {YEAR}, {PERIOD} and {COURSE_ID} are replaced with the respective values.",
  )
  .argument(
    "<terms...>",
    'One or more academic terms to scrape, specified as <year>.<period> (e.g. 2024-101). Use "current" to scrape the current academic term.',
    (term: string, previousTerms: UniversityTermArgument[] = []) => {
      return [...previousTerms, parseTermArgument(term)];
    },
  )
  .action(
    async (terms: UniversityTermArgument[], options: { output: string }) => {
      const artifacts = await scrape(terms);

      for (let i = 0; i < artifacts.length; i++) {
        const artifact = artifacts[i];
        const path = options.output
          .replace("{YEAR}", artifact.term.year.toString())
          .replace("{PERIOD}", artifact.term.period.toString())
          .replace("{COURSE_ID}", artifact.courseId.toString());

        console.info(
          `[INFO] Writing scraping artifact to ${path}... (${i + 1}/${artifacts.length})`,
        );
        await fs.writeFile(path, JSON.stringify(artifact));
      }
    },
  );

program
  .command("format")
  .description(
    "Convert raw class from the UFSM website data into structured data.",
  )
  .requiredOption(
    "-o, --output <path>",
    "The output file path for the structured class data.",
  )
  .argument("<inputs...>", "One or more raw class data artifacts to format.")
  .action(async (inputs: string[], options: { output: string }) => {
    console.info(`[INFO] Reading scraping artifacts...`);
    const artifacts = await Promise.all(
      inputs.map((input) => fs.readFile(input, "utf-8").then(JSON.parse)),
    );

    console.info(`[INFO] Formatting scraping artifacts...`);
    const dataset = format(artifacts);

    console.info(
      `[INFO] Writing structured class data to ${options.output}...`,
    );
    await fs.writeFile(options.output, JSON.stringify(dataset));
  });

program.parse(process.argv);
