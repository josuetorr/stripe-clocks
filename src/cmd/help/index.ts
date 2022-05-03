import chalk from "chalk";

export const displayHelp = () => {
  console.log(
    `the official unofficial ${chalk.magenta(
      "LEADHOUSE"
    )} stripe clock cli-tool.\n`
  );
  console.log("Usage:\nstripe-clocks [command]");
  process.exit(0);
};

export default displayHelp;
