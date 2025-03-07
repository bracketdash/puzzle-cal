import fs from "fs";
import { grid } from "../data.js";

function createCellSet(grid) {
  const occupiedCells = new Set();
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < (grid[x] || []).length; y++) {
      if (grid[x][y] === null) {
        occupiedCells.add(`${x},${y}`);
      }
    }
  }
  return occupiedCells;
}

const initialOccupiedCells = createCellSet(grid);

fs.writeFile(
  "initialOccupiedCells.json",
  JSON.stringify(Array.from(initialOccupiedCells), null, 2),
  (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("Saved cells to initialOccupiedCells.json");
  }
);
