import fs from "fs";
import { grid, pieceTransformations, validPositions, covered } from "./data.js";

// TODO: pull over bitmap stuff from solve
// TODO: pull over 

function fits(grid, shape, topLeft) {
  const [x0, y0] = topLeft;
  for (const [dx, dy] of shape) {
    const x = x0 + dx;
    const y = y0 + dy;
    if (
      x < 0 ||
      x >= grid.length ||
      y < 0 ||
      y >= (grid[x] || []).length ||
      grid[x][y] === null
    ) {
      return false;
    }
  }
  return true;
}

function placePiece(grid, shape, topLeft) {
  const newGrid = grid.map((row) => [...row]);
  const [x0, y0] = topLeft;
  for (const [dx, dy] of shape) {
    newGrid[x0 + dx][y0 + dy] = null;
  }
  return newGrid;
}

function saveToJson(data, filename) {
  const filenameWithExt = filename + ".json";
  fs.writeFileSync(filenameWithExt, JSON.stringify(data), { encoding: "utf8" });
  console.log(`Saved data to ${filenameWithExt}`);
}

const solutions = {};
let configurationsTried = 0;
let validSolutions = 0;
function solve(grid, piecesLeft, solution = []) {
  configurationsTried++;
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
      validSolutions++;
    }
    return null;
  }
  const [pieceId, ...remainingPieces] = piecesLeft;
  for (const [index, shape] of pieceTransformations[pieceId].entries()) {
    for (const [x, y] of validPositions[pieceId][index]) {
      if (fits(grid, shape, [x, y])) {
        const newGrid = placePiece(grid, shape, [x, y]);
        solve(newGrid, remainingPieces, [
          ...solution,
          { piece: pieceId, shape, position: [x, y] },
        ]);
      }
    }
  }
}

solve(grid, Object.keys(pieceTransformations));
