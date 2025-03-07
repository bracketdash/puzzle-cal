import fs from "fs";
import { grid } from "../data.js";

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

const initialBitmap = createBitmap(grid);

fs.writeFile(
  "./generated/initialBitmap.json",
  JSON.stringify(initialBitmap, null, 2),
  (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("Saved bitmap to initialBitmap.json");
  }
);
