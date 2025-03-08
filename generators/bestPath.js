import fs from "fs";

const solutions = JSON.parse(
  fs.readFileSync(new URL("../generated/allSolutions.json", import.meta.url))
);

const validDates = JSON.parse(
  fs.readFileSync(new URL("../generated/validDates.json", import.meta.url))
);

const scoredPairs = {};

let lowestScore = Infinity;

function getScoredPairs(firstDateIndex) {
  const firstDate = validDates[firstDateIndex];
  const secondDate = validDates[firstDateIndex + 1];
  const dateKey = `${firstDate}-${secondDate}`;
  if (scoredPairs[dateKey]) {
    return scoredPairs[dateKey];
  }
  scoredPairs[dateKey] = [];
  solutions[firstDate].forEach((firstDateSolution, firstDateSolutionIndex) => {
    solutions[secondDate].forEach(
      (secondDateSolution, secondDateSolutionIndex) => {
        let score = 0;
        for (let i = 0; i < 43; i++) {
          if (firstDateSolution[i] !== secondDateSolution[i]) {
            score++;
          }
        }
        scoredPairs[dateKey].push([
          firstDateSolutionIndex,
          secondDateSolutionIndex,
          score,
        ]);
      }
    );
  });
  scoredPairs[dateKey] = scoredPairs[dateKey].sort((a, b) => a[2] - b[2]);
  return scoredPairs[dateKey];
}

function findBestPath(path = [], score = 0, dayPairIndex = 0) {
  const dayPairScores = getScoredPairs(path.length);
  if (dayPairIndex >= dayPairScores.length) {
    return;
  }
  const newScore = score + dayPairScores[dayPairIndex];
  if (newScore > lowestScore) {
    return;
  }
  const newPath = [...path, dayPairIndex];
  if (newPath.length === validDates.length) {
    if (newScore < lowestScore) {
      lowestScore = newScore;
      const bestPathStr = newPath.join("");
      fs.writeFileSync(
        "./generated/bestPath.json",
        JSON.stringify({ bestPath: bestPathStr }),
        {
          encoding: "utf8",
        }
      );
      console.log(`Found a new best path, saved it to generated/bestPath.json`);
    }
    return;
  }
  const nextDayPairScores = getScoredPairs(path.length + 1);

  // TODO: finish adapting this to the new hotness
  const lastB = b;
  if (lastB < nextDayPairScores.length) {
    for (let nextB = 0; nextB < nextDayPairScores[lastB].length; nextB++) {
      findBestPath(newPath, newScore, lastB, nextB);
    }
  }
}

findBestPath();
