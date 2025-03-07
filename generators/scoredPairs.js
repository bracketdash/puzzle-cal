import fs from "fs";

const solutions = JSON.parse(
  fs.readFileSync(new URL("../generated/allSolutions.json", import.meta.url))
);

const validDates = JSON.parse(
  fs.readFileSync(new URL("../generated/validDates.json", import.meta.url))
);

const scoredPairs = {};

validDates.slice(0, -1).forEach((firstDate, firstDateIndex) => {
  solutions[firstDate].forEach((firstDateSolution, firstDateSolutionIndex) => {
    const secondDate = validDates[firstDateIndex + 1];
    solutions[secondDate].forEach(
      (secondDateSolution, secondDateSolutionIndex) => {
        const dateKey = `${firstDate}-${secondDate}`;
        const pairKey = `${firstDateSolutionIndex}-${secondDateSolutionIndex}`;
        if (!scoredPairs[dateKey]) {
          scoredPairs[dateKey] = {};
        }
        let score = 0;
        // TODO: Create a difference score between `firstDateSolution` and `secondDateSolution`
        scoredPairs[dateKey][pairKey] = score;
      }
    );
  });
});
