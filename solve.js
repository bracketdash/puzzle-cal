import chalk from "chalk";
import { grid, pieceTransformations } from "./data.js";

// Parse command line arguments
const args = process.argv.slice(2);
let TARGET_MONTH, TARGET_DAY;

if (args.length >= 2) {
  // Convert month to uppercase for case-insensitive matching
  TARGET_MONTH = args[0].toUpperCase();
  TARGET_DAY = args[1];
} else {
  // Default values if no arguments provided
  TARGET_MONTH = "JAN";
  TARGET_DAY = "1";
  console.log(
    `No arguments provided. Using defaults: ${TARGET_MONTH} ${TARGET_DAY}`
  );
  console.log(`Usage: node solve <month> <day>`);
  console.log(`Example: node solve mar 2`);
}

// Assign unique colors for each piece
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

// Find the position of the target month and day in the grid
function findPosition(grid, target) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < (grid[x] || []).length; y++) {
      if (grid[x][y] === target) return [x, y];
    }
  }
  return null;
}

// Dynamically find the target positions
const targetMonthPosition = findPosition(grid, TARGET_MONTH);
const targetDayPosition = findPosition(grid, TARGET_DAY);

if (!targetMonthPosition || !targetDayPosition) {
  console.error("Error: Target month or day not found in the grid.");
  process.exit(1);
}

// Convert the grid to a bitmap for faster checks
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

// Create initial bitmap
const initialBitmap = createBitmap(grid);

// Check if a piece fits in the grid at a specific position
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

// Create a Set to track occupied cells
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

// Initial occupied cells
const initialOccupiedCells = createCellSet(grid);

// Place a piece on the grid and update bitmap
function placePiece(bitmap, shape, topLeft) {
  const newBitmap = bitmap.map((row) => [...row]);
  const [x0, y0] = topLeft;

  for (const [dx, dy] of shape) {
    newBitmap[x0 + dx][y0 + dy] = true;
  }

  return newBitmap;
}

// More efficient grid manipulation without copying entire grid
function placePieceOnSet(cellsOccupied, shape, topLeft) {
  const [x0, y0] = topLeft;
  const newCellsOccupied = new Set(cellsOccupied);

  for (const [dx, dy] of shape) {
    newCellsOccupied.add(`${x0 + dx},${y0 + dy}`);
  }

  return newCellsOccupied;
}

// Precompute valid positions for each piece transformation
const validPositions = {};
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

// Initialize valid positions
precomputeValidPositions(grid, initialBitmap);

// Count number of valid placements for a piece
function countPlacements(grid, bitmap, transformations) {
  let count = 0;
  for (const shape of transformations) {
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < (grid[x] || []).length; y++) {
        if (fits(grid, bitmap, shape, [x, y])) count++;
      }
    }
  }
  return count;
}

// Sort pieces by number of possible placements (most constrained first)
function sortPiecesByConstraint(grid, bitmap, piecesLeft) {
  return [...piecesLeft].sort((a, b) => {
    const aOptions = countPlacements(grid, bitmap, pieceTransformations[a]);
    const bOptions = countPlacements(grid, bitmap, pieceTransformations[b]);
    return aOptions - bOptions; // Place most constrained pieces first
  });
}

// Backtracking solver with progress updates and optimizations
let configurationsTried = 0;

function solve(grid, bitmap, occupiedCells, piecesLeft, solution = []) {
  configurationsTried++;

  // Early termination check - ensure target cells are still available
  const [monthX, monthY] = targetMonthPosition;
  const [dayX, dayY] = targetDayPosition;

  if (bitmap[monthX][monthY] || bitmap[dayX][dayY]) {
    return null; // Target cells already covered, this branch won't work
  }

  if (!piecesLeft.length) {
    // Check if target month and day are uncovered
    if (!bitmap[monthX][monthY] && !bitmap[dayX][dayY]) {
      return solution;
    }
    return null;
  }

  // Sort pieces by constraint for better pruning
  const sortedPieces = sortPiecesByConstraint(grid, bitmap, piecesLeft);
  const [pieceId] = sortedPieces;
  const remainingPieces = sortedPieces.filter((p) => p !== pieceId);

  for (const [index, shape] of pieceTransformations[pieceId].entries()) {
    // Use precomputed valid positions
    for (const [x, y] of validPositions[pieceId][index]) {
      if (fits(grid, bitmap, shape, [x, y])) {
        const newBitmap = placePiece(bitmap, shape, [x, y]);
        const newOccupiedCells = placePieceOnSet(occupiedCells, shape, [x, y]);

        const result = solve(
          grid,
          newBitmap,
          newOccupiedCells,
          remainingPieces,
          [...solution, { piece: pieceId, shape, position: [x, y] }]
        );

        if (result) return result;
      }
    }
  }

  return null;
}

// Measure performance
const startTime = Date.now();

// Solve for the target month and day
const solution = solve(
  grid,
  initialBitmap,
  initialOccupiedCells,
  Object.keys(pieceTransformations)
);

const endTime = Date.now();
const executionTime = (endTime - startTime) / 1000;

if (solution) {
  console.log(
    `Solution found in ${executionTime.toFixed(
      2
    )} seconds after trying ${configurationsTried.toLocaleString()} configurations.\n`
  );

  // Create an empty visual grid
  const visualGrid = grid.map((row) =>
    row.map((cell) => (cell === null ? "." : cell))
  );

  // Fill the visual grid with the solution
  solution.forEach(({ piece, shape, position }) => {
    const [x0, y0] = position;
    shape.forEach(([dx, dy]) => {
      visualGrid[x0 + dx][y0 + dy] = piece;
    });
  });

  // Print the visual grid with colors
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
