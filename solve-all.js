import fs from "fs";
import { fits, placePiece } from "./functions.js";
import {
  grid,
  initialBitmap,
  pieceTransformations,
  validPositions,
} from "./data.js";

const covered = [...Object.keys(pieceTransformations), "."];
const solutions = {};

let configurationsTried = 0;

function solve(bitmap, piecesLeft, solution = []) {
  configurationsTried++;

  if (configurationsTried % 1000000 === 0) {
    const solutionsArrays = {};
    let validSolutions = 0;
    Object.keys(solutions).forEach((key) => {
      solutionsArrays[key] = Array.from(solutions[key]);
      validSolutions += solutions[key].size;
    });
    fs.writeFileSync("solutions.json", JSON.stringify(solutionsArrays), {
      encoding: "utf8",
    });
    console.log(
      `Tried ${
        configurationsTried / 1000000
      } million configurations. ${validSolutions} valid solutions found so far. Saved to disk.`
    );
  }

  const rendered = grid.map((row) =>
    row.map((cell) => (cell === null ? "." : cell))
  );
  solution.forEach(({ piece, shape, position }) => {
    const [x0, y0] = position;
    shape.forEach(([dx, dy]) => {
      rendered[x0 + dx][y0 + dy] = piece;
    });
  });

  let monthRendered = "";
  let monthsRendered = 0;
  let dayRendered = "";
  let daysRendered = 0;
  rendered.forEach((row, rowIndex) => {
    row.forEach((cell) => {
      if (!covered.includes(cell)) {
        if (rowIndex < 2) {
          monthsRendered++;
          monthRendered = cell;
        } else {
          daysRendered++;
          dayRendered = cell;
        }
      }
    });
  });

  if (!monthsRendered || !daysRendered) {
    return null;
  }

  if (!piecesLeft.length) {
    if (monthsRendered === 1 && daysRendered === 1) {
      const key = monthRendered + dayRendered;
      if (!solutions[key]) {
        solutions[key] = new Set();
      }
      solutions[key].add(rendered);
    }
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
