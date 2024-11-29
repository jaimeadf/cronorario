import { Command } from "commander";

import { UniversityTermArgument, parseTermArgument } from "./arguments";

import { scrape } from "./actions/scrape";
import { compile } from "./actions/compile";

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
      await scrape(terms, options.output);
    },
  );

program
  .command("compile")
  .description(
    "Convert raw class from the UFSM website data into structured data.",
  )
  .requiredOption(
    "-o, --output <path>",
    "The output file path for the structured class data.",
  )
  .argument("<input>", "The directory containing the scraping artifacts.")
  .action(async (input: string, options: { output: string }) => {
    await compile(input, options.output);
  });

program.parse(process.argv);
