import fs from "fs";
import { grid, pieceTransformations } from "./data.js";

const validPositions = {};

function createBitmap(grid) {
  const bitmap = new Array(grid.length);
  for (let i = 0; i < grid.length; i++) {
    bitmap[i] = new Array(grid[0].length).fill(false);
    for (let j = 0; j < grid[i].length; j++) {
      bitmap[i][j] = grid[i][j] === null;
    }
  }
  return bitmap;
}

function fits(grid, bitmap, shape, topLeft) {
  const [x0, y0] = topLeft;
  for (const [dx, dy] of shape) {
    const x = x0 + dx;
    const y = y0 + dy;
    if (
      x < 0 ||
      x >= grid.length ||
      y < 0 ||
      y >= (grid[x] || []).length ||
      bitmap[x][y]
    ) {
      return false;
    }
  }
  return true;
}

function precomputeValidPositions(grid, bitmap) {
  for (const [pieceId, transformations] of Object.entries(
    pieceTransformations
  )) {
    validPositions[pieceId] = [];
    for (const [index, shape] of transformations.entries()) {
      validPositions[pieceId][index] = [];
      for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < (grid[x] || []).length; y++) {
          if (fits(grid, bitmap, shape, [x, y])) {
            validPositions[pieceId][index].push([x, y]);
          }
        }
      }
    }
  }
}

precomputeValidPositions(grid, createBitmap(grid));

fs.writeFile(
  "validPositions.json",
  JSON.stringify(validPositions, null, 2),
  (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("Saved positions to validPositions.json");
  }
);
