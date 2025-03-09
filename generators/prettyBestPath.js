import fs from "fs";

const bestPath = JSON.parse(
  fs.readFileSync(new URL("../generated/bestPath.json", import.meta.url))
);

const solutions = JSON.parse(
  fs.readFileSync(new URL("../generated/allSolutions.json", import.meta.url))
);

const validDates = JSON.parse(
  fs.readFileSync(new URL("../generated/validDates.json", import.meta.url))
);

const prettyBestPath = bestPath.map((solutionIndex, pathIndex) => {
  const key = validDates[pathIndex];
  const solutionStr = solutions[key][solutionIndex];
  const solution = [
    solutionStr.substring(0, 6),
    solutionStr.substring(6, 12),
    solutionStr.substring(12, 19),
    solutionStr.substring(19, 26),
    solutionStr.substring(26, 33),
    solutionStr.substring(33, 40),
    solutionStr.substring(40, 43),
  ];
  return [key, solution];
});

fs.writeFile(
  "./generated/prettyBestPath.json",
  JSON.stringify(prettyBestPath, null, 2),
  (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("Saved path to prettyBestPath.json");
  }
);
