import chalk from "chalk";
import { VALID_FLAGS } from "../validation/index.js";

export const displayHelp = () => {
  console.log(
    `the official unofficial ${chalk.magenta(
      "LEADHOUSE"
    )} stripe clock cli-tool.\n`
  );
  console.log(`${chalk.bold("Usage:")}:\nstripe-clocks [command] [flags]\n\n`);

  console.log(`${chalk.bold("Flags:")}`);
  for (const [flag, { description }] of Object.entries(VALID_FLAGS)) {
    console.log(`  --${flag}${description}`);
  }
};

export default displayHelp;
