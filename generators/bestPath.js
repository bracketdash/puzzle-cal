import fs from "fs";

const scoredPairs = JSON.parse(
  fs.readFileSync(new URL("../generated/scoredPairs.json", import.meta.url))
);

const dayPairs = Object.keys(scoredPairs);

let bestPath = [];
let lowestScore = Infinity;

function findOptimalPath(path = [], score = 0, a = 0, b = 0) {
  const dayPairKey = dayPairs[path.length];
  const dayPairScores = scoredPairs[dayPairKey];
  if (a >= dayPairScores.length || b >= dayPairScores[a].length) {
    return;
  }
  const newScore = score + dayPairScores[a][b];
  if (newScore > lowestScore) {
    return;
  }
  const newPath = [...path, [a, b]];
  if (newPath.length === dayPairs.length) {
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
  const nextDayPairKey = dayPairs[newPath.length];
  const nextDayPairScores = scoredPairs[nextDayPairKey];
  const lastB = b;
  if (lastB < nextDayPairScores.length) {
    for (let nextB = 0; nextB < nextDayPairScores[lastB].length; nextB++) {
      findOptimalPath(newPath, newScore, lastB, nextB);
    }
  }
}

findOptimalPath();
console.log("Final best path:", bestPath);
console.log("Lowest score:", lowestScore);
