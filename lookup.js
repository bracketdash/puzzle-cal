import chalk from "chalk";
import fs from "fs";

const prettyBestPath = JSON.parse(
  fs.readFileSync(new URL("generated/prettyBestPath.json", import.meta.url))
);

const args = process.argv.slice(2);
let TARGET_MONTH, TARGET_DAY;
if (args.length >= 2) {
  TARGET_MONTH = args[0].toUpperCase();
  TARGET_DAY = args[1];
} else {
  TARGET_MONTH = "JAN";
  TARGET_DAY = "1";
  console.log(`Usage: node lookup <month> <day>`);
  console.log(`Example: node lookup mar 2`);
  console.log("Defaulting to JAN 1 for this run...");
}

const dateKey = TARGET_MONTH + TARGET_DAY;
const solution = prettyBestPath.find((entry) => entry[0] === dateKey)[1];

const pieceColors = {
  A: chalk.bgRed,
  B: chalk.bgGreen,
  C: chalk.bgBlue,
  D: chalk.bgYellow,
  E: chalk.bgMagenta,
  F: chalk.bgCyan,
  G: chalk.bgWhite,
  H: chalk.bgGray,
};

console.log("");
solution.forEach((row) => {
  console.log(
    row
      .split("")
      .map((cell) =>
        pieceColors[cell] ? pieceColors[cell]("   ") : ` ${cell} `
      )
      .join("")
  );
});
