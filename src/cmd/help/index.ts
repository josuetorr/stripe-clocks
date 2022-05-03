import chalk from "chalk";

export const displayHelp = () => {
  console.log(
    `the official unofficial ${chalk.magenta(
      "LEADHOUSE"
    )} stripe clock cli-tool.\n`
  );
  console.log(`${chalk.bold("Usage:")}:\nstripe-clocks [command]\n\n`);
  console.log(`${chalk.bold("Flags:")}`);
  console.log(`  --email\t\tcustomer email`);
  console.log(`  --customer-id\t\tcustomer id`);
  console.log(`  --payment-method\t\tstripe payment method`);
  console.log(`  --card-number\t\tcredit or debit card number`);
  console.log(`  --exp\t\t\tcard expiration (MM-YYYY)`);
  console.log(`  --cvc\t\t\tcard cvc number`);
  console.log(
    `  --frozen-time\t\tstarting date (DD-MM-YYYY) (defaults to today)`
  );
  console.log(`  --name\t\tname of test`);
  console.log(
    `  --advance-by\t\tthe time by with the clock will be advanced (defaults to 1M). Y=year, M=month, H=hour, m=minute, s=second, ms=millisecond`
  );
};

export default displayHelp;
