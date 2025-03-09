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

let runs = 0;

function findBestPath(path = [], score = 0, dayPairIndex = 0) {
  runs++;
  if (runs % 100000000 === 0) {
    console.log(
      `${runs / 100000000}00 million runs (current best score: ${lowestScore})`
    );
  }
  const dayPairScores = getScoredPairs(path.length);
  if (dayPairIndex >= dayPairScores.length) {
    return;
  }
  const newScore = score + dayPairScores[dayPairIndex][2];
  if (newScore > lowestScore) {
    return;
  }
  const newPath = [...path, dayPairScores[dayPairIndex][0]];
  if (newPath.length === validDates.length - 1) {
    if (newScore < lowestScore) {
      lowestScore = newScore;
      fs.writeFileSync("./generated/bestPath.json", JSON.stringify(newPath), {
        encoding: "utf8",
      });
      console.log(newPath.join(","));
    }
    return;
  }
  const nextDayPairScores = getScoredPairs(path.length + 1);
  const lastB = dayPairScores[dayPairIndex][1];
  const filtered = nextDayPairScores.filter((entry) => entry[0] !== lastB);
  for (let nextB = 0; nextB < filtered.length; nextB++) {
    findBestPath(newPath, newScore, nextB);
  }
}

findBestPath();
