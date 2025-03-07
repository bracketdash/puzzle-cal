import fs from "fs";
import { fits, placePiece } from "./functions.js";
import {
  grid,
  initialBitmap,
  pieceTransformations,
  validPositions,
} from "./data.js";

function saveToJson(data, filename) {
  const filenameWithExt = filename + ".json";
  fs.writeFileSync(filenameWithExt, JSON.stringify(data), { encoding: "utf8" });
  console.log(`Saved data to ${filenameWithExt}`);
}

function saveIfValid(solution) {
  const rendered = grid.map((row) =>
    row.map((cell) => (cell === null ? "." : cell))
  );
  solution.forEach(({ piece, shape, position }) => {
    const [x0, y0] = position;
    shape.forEach(([dx, dy]) => {
      rendered[x0 + dx][y0 + dy] = piece;
    });
  });
  let valid = true;
  let monthRendered = false;
  let dayRendered = false;
  rendered.forEach((row, rowIndex) => {
    if (!valid) {
      return;
    }
    row.forEach((cell) => {
      if (!covered.includes(cell)) {
        if (rowIndex < 2) {
          if (monthRendered) {
            valid = false;
            return;
          }
          monthRendered = cell;
        } else {
          if (dayRendered) {
            valid = false;
            return;
          }
          dayRendered = cell;
        }
      }
    });
  });
  if (valid) {
    const key = monthRendered + dayRendered;
    if (!solutions[key]) {
      solutions[key] = [];
    }
    solutions[key].push(rendered);
    return 1;
  }
  return 0;
}

const covered = [...Object.keys(pieceTransformations), "."];
const solutions = {};

let configurationsTried = 0;
let validSolutions = 0;

function solve(bitmap, piecesLeft, solution = []) {
  configurationsTried++;

  // TODO: return here (prune branch) if all the months are already covered

  // TODO: return here (prune branch) if all the days are already covered

  if (configurationsTried % 100000 === 0) {
    const configsTried = (configurationsTried / 1000000).toFixed(1);
    console.log(
      `Tried ${configsTried} million configurations. ${validSolutions} valid solutions found so far.`
    );
    if (configurationsTried % 1000000 === 0) {
      saveToJson(solutions, "solutions");
    }
  }

  if (!piecesLeft.length) {
    validSolutions += saveIfValid(solution);
    return null;
  }

  const [pieceId, ...remainingPieces] = piecesLeft;

  for (const [index, shape] of pieceTransformations[pieceId].entries()) {
    for (const [x, y] of validPositions[pieceId][index]) {
      if (fits(bitmap, shape, [x, y])) {
        const newBitmap = placePiece(bitmap, shape, [x, y]);
        solve(newBitmap, remainingPieces, [
          ...solution,
          { piece: pieceId, shape, position: [x, y] },
        ]);
      }
    }
  }
}

solve(initialBitmap, Object.keys(pieceTransformations));
