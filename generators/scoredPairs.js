import fs from "fs";

const solutions = JSON.parse(
  fs.readFileSync(new URL("../generated/allSolutions.json", import.meta.url))
);

const validDates = JSON.parse(
  fs.readFileSync(new URL("../generated/validDates.json", import.meta.url))
);

const scoredPairs = {};

validDates.slice(0, -1).forEach((firstDate, firstDateIndex) => {
  const secondDate = validDates[firstDateIndex + 1];
  const dateKey = `${firstDate}-${secondDate}`;
  scoredPairs[dateKey] = [];
  console.log(`Processing day pair: ${dateKey}`);
  solutions[firstDate].forEach((firstDateSolution, firstDateSolutionIndex) => {
    scoredPairs[dateKey].push([]);
    solutions[secondDate].forEach((secondDateSolution) => {
      let score = 0;
      for (let i = 0; i < 43; i++) {
        if (firstDateSolution[i] !== secondDateSolution[i]) {
          score++;
        }
      }
      scoredPairs[dateKey][firstDateSolutionIndex].push(score);
    });
  });
});

fs.writeFile(
  "./generated/scoredPairs.json",
  JSON.stringify(scoredPairs, null, 2),
  (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("Saved pairs to scoredPairs.json");
  }
);
