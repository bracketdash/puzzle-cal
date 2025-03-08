import fs from "fs";

const solutions = JSON.parse(
  fs.readFileSync(new URL("../generated/allSolutions.json", import.meta.url))
);

const validDates = JSON.parse(
  fs.readFileSync(new URL("../generated/validDates.json", import.meta.url))
);

const scoredPairs = {};

let bestPath = [];
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

// TODO: adapt to use above function instead of relying on readymade scored pairs
function findBestPath(path = [], score = 0, a = 0, b = 0) {
  const dayPairKey = validDates[path.length];
  const dayPairScores = scoredPairs[dayPairKey];
  if (a >= dayPairScores.length || b >= dayPairScores[a].length) {
    return;
  }
  const newScore = score + dayPairScores[a][b];
  if (newScore > lowestScore) {
    return;
  }
  const newPath = [...path, [a, b]];
  if (newPath.length === validDates.length) {
    if (newScore < lowestScore) {
      lowestScore = newScore;
      bestPath = JSON.parse(JSON.stringify(newPath));
      console.log(`Found a new best path:`);
      console.log(JSON.stringify(bestPath));
      fs.writeFileSync("./generated/bestPath.json", JSON.stringify(bestPath), {
        encoding: "utf8",
      });
    }
    return;
  }
  const nextDayPairKey = validDates[newPath.length];
  const nextDayPairScores = scoredPairs[nextDayPairKey];
  const lastB = b;
  if (lastB < nextDayPairScores.length) {
    for (let nextB = 0; nextB < nextDayPairScores[lastB].length; nextB++) {
      findBestPath(newPath, newScore, lastB, nextB);
    }
  }
}

findBestPath();
