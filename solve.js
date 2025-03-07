import chalk from "chalk";
import { fits, placePiece } from "./functions.js";
import {
  grid,
  initialBitmap,
  pieceTransformations,
  validPositions,
} from "./data.js";

const args = process.argv.slice(2);
let TARGET_MONTH, TARGET_DAY;
if (args.length >= 2) {
  TARGET_MONTH = args[0].toUpperCase();
  TARGET_DAY = args[1];
} else {
  TARGET_MONTH = "JAN";
  TARGET_DAY = "1";
  console.log(`Usage: node solve <month> <day>`);
  console.log(`Example: node solve mar 2`);
  console.log("Defaulting to JAN 1 for this run...");
}

function findPosition(target) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < (grid[x] || []).length; y++) {
      if (grid[x][y] === target) return [x, y];
    }
  }
  return null;
}

const targetMonthPosition = findPosition(TARGET_MONTH);
const targetDayPosition = findPosition(TARGET_DAY);
if (!targetMonthPosition || !targetDayPosition) {
  console.error("Error: Target month or day not found in the grid.");
  process.exit(1);
}

function countPlacements(bitmap, transformations) {
  let count = 0;
  for (const shape of transformations) {
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < (grid[x] || []).length; y++) {
        if (fits(bitmap, shape, [x, y])) count++;
      }
    }
  }
  return count;
}

function sortPiecesByConstraint(bitmap, piecesLeft) {
  return [...piecesLeft].sort((a, b) => {
    const aOptions = countPlacements(bitmap, pieceTransformations[a]);
    const bOptions = countPlacements(bitmap, pieceTransformations[b]);
    return aOptions - bOptions;
  });
}

let configurationsTried = 0;

function solve(bitmap, piecesLeft, solution = []) {
  configurationsTried++;

  const [monthX, monthY] = targetMonthPosition;
  const [dayX, dayY] = targetDayPosition;
  if (bitmap[monthX][monthY] || bitmap[dayX][dayY]) {
    return null;
  }

  if (!piecesLeft.length) {
    if (!bitmap[monthX][monthY] && !bitmap[dayX][dayY]) {
      return solution;
    }
    return null;
  }

  const sortedPieces = sortPiecesByConstraint(bitmap, piecesLeft);
  const [pieceId] = sortedPieces;
  const remainingPieces = sortedPieces.filter((p) => p !== pieceId);

  for (const [index, shape] of pieceTransformations[pieceId].entries()) {
    for (const [x, y] of validPositions[pieceId][index]) {
      if (fits(bitmap, shape, [x, y])) {
        const newBitmap = placePiece(bitmap, shape, [x, y]);
        const result = solve(newBitmap, remainingPieces, [
          ...solution,
          { piece: pieceId, shape, position: [x, y] },
        ]);
        if (result) return result;
      }
    }
  }

  return null;
}

const startTime = Date.now();
const solution = solve(initialBitmap, Object.keys(pieceTransformations));
const endTime = Date.now();
const executionTime = (endTime - startTime) / 1000;

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

if (solution) {
  console.log(
    `Solution found in ${executionTime.toFixed(
      2
    )} seconds after trying ${configurationsTried.toLocaleString()} configurations.\n`
  );
  const visualGrid = grid.map((row) =>
    row.map((cell) => (cell === null ? "." : cell))
  );
  solution.forEach(({ piece, shape, position }) => {
    const [x0, y0] = position;
    shape.forEach(([dx, dy]) => {
      visualGrid[x0 + dx][y0 + dy] = piece;
    });
  });
  visualGrid.forEach((row) => {
    console.log(
      row
        .map((cell) =>
          cell === "."
            ? ""
            : pieceColors[cell]
            ? pieceColors[cell]("   ")
            : cell.padStart(2 + cell.length / 2, " ").padEnd(3, " ")
        )
        .join("")
    );
  });
} else {
  console.log(
    `No solution found after ${executionTime.toFixed(
      2
    )} seconds and ${configurationsTried.toLocaleString()} configurations. Check targets?`
  );
}
