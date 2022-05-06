#!/usr/bin/env node
import { argv } from "process";
import { InvalidArgError, displayHelp, parseArgs } from "./cmd/index.js";
import StripeHandlerFactory from "./handlers/Factory.js";

try {
  const showHelp = argv
    .slice(2)
    .map((arg) => arg.split("=")[0].replace("--", ""))
    .includes("help");

  if (showHelp) {
    displayHelp();
    process.exit(0);
  }
  const parsedArgs = parseArgs();

  const handler = await new StripeHandlerFactory().makeStripeHandler(
    parsedArgs
  );
  await handler.handleRequest();
} catch (error: any) {
  if (error instanceof InvalidArgError) {
    console.error(error.message);
    process.exit(error.code);
  }

  console.error(error);
  process.exit(2);
}
