#!/usr/bin/env node
import { InvalidArgError, displayHelp, parseArgs } from "./cmd/index.js";
import { RenewSuccessHandler } from "./handlers/index.js";
import { argv } from "process";

try {
  const showHelp = argv
    .slice(2)
    .map((arg) => arg.split("=")[0].replace("--", ""))
    .includes("help");
  if (showHelp) {
    displayHelp();
    process.exit(0);
  }
  const { apiKey, ...parsedArgs } = parseArgs();

  const handler = new RenewSuccessHandler(parsedArgs, apiKey);
} catch (error) {
  if (error instanceof InvalidArgError) {
    console.error(error.message);
    process.exit(error.code);
  }
}
