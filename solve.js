import chalk from "chalk";

// Define the target month and day
const TARGET_MONTH = "JAN"; // Change this to the desired month
const TARGET_DAY = "4"; // Change this to the desired day

// Define the grid (irregular structure)
const grid = [
  ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", null],
  ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC", null],
  ["1", "2", "3", "4", "5", "6", "7"],
  ["8", "9", "10", "11", "12", "13", "14"],
  ["15", "16", "17", "18", "19", "20", "21"],
  ["22", "23", "24", "25", "26", "27", "28"],
  ["29", "30", "31", null, null, null, null],
];

// Define the pieces and their base shapes
const pieces = {
  A: [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
  ], // 2x3 rectangle
  B: [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [2, 0],
  ], // L-shape (3x3 legs)
  C: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 0],
  ], // L-shape (4x2 legs)
  D: [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 1],
    [2, 1],
  ], // T-shape (3 wide/tall)
  E: [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2],
    [1, 3],
  ], // Z-like shape
  F: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 1],
  ], // Line with pop-out
  G: [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
    [2, 0],
  ], // 2x2 square with pop-out
  H: [
    [0, 0],
    [0, 1],
    [1, 0],
    [2, 0],
    [2, 1],
  ], // C-shape
};

// Assign unique colors for each piece
const pieceColors = {
  A: chalk.red,
  B: chalk.green,
  C: chalk.blue,
  D: chalk.yellow,
  E: chalk.magenta,
  F: chalk.cyan,
  G: chalk.white,
};

// Generate all transformations (rotations and flips) for a piece
function generateTransformations(shape) {
  const transformations = new Set();

  for (const flip of [false, true]) {
    for (let rotation = 0; rotation < 4; rotation++) {
      const transformed = shape.map(([x, y]) => {
        let nx = flip ? -x : x;
        let ny = y;

        if (rotation === 1) [nx, ny] = [ny, -nx];
        if (rotation === 2) [nx, ny] = [-nx, -ny];
        if (rotation === 3) [nx, ny] = [-ny, nx];

        return [nx, ny];
      });

      const minX = Math.min(...transformed.map(([x]) => x));
      const minY = Math.min(...transformed.map(([_, y]) => y));

      const normalized = transformed.map(([x, y]) => [x - minX, y - minY]);
      transformations.add(JSON.stringify(normalized));
    }
  }

  return Array.from(transformations).map((t) => JSON.parse(t));
}

// Generate transformations for all pieces
const pieceTransformations = {};
for (const [key, shape] of Object.entries(pieces)) {
  pieceTransformations[key] = generateTransformations(shape);
}

// Find the position of the target month and day in the grid
function findPosition(grid, target) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < (grid[x] || []).length; y++) {
      if (grid[x][y] === target) return [x, y];
    }
  }
  return null; // Not found
}

// Dynamically find the target positions
const targetMonthPosition = findPosition(grid, TARGET_MONTH);
const targetDayPosition = findPosition(grid, TARGET_DAY);

if (!targetMonthPosition || !targetDayPosition) {
  console.error("Error: Target month or day not found in the grid.");
  process.exit(1);
}

// Check if a piece fits in the grid at a specific position
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

// Place a piece on the grid
function placePiece(grid, shape, topLeft) {
  const newGrid = grid.map((row) => [...row]);
  const [x0, y0] = topLeft;

  for (const [dx, dy] of shape) {
    newGrid[x0 + dx][y0 + dy] = null;
  }

  return newGrid;
}

// Backtracking solver with progress updates
let configurationsTried = 0;

function solve(grid, piecesLeft, solution = []) {
  configurationsTried++;
  if (configurationsTried % 100000 === 0) {
    console.log(
      `Tried ${(configurationsTried / 1000000).toFixed(
        1
      )} million configurations...`
    );
  }

  if (!piecesLeft.length) {
    // Check if target month and day are uncovered
    const [monthX, monthY] = targetMonthPosition;
    const [dayX, dayY] = targetDayPosition;
    if (
      grid[monthX][monthY] === TARGET_MONTH &&
      grid[dayX][dayY] === TARGET_DAY
    ) {
      return solution;
    }
    return null;
  }

  const [pieceId, ...remainingPieces] = piecesLeft;
  for (const shape of pieceTransformations[pieceId]) {
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < (grid[x] || []).length; y++) {
        if (fits(grid, shape, [x, y])) {
          const newGrid = placePiece(grid, shape, [x, y]);
          const result = solve(newGrid, remainingPieces, [
            ...solution,
            { piece: pieceId, shape, position: [x, y] },
          ]);
          if (result) return result;
        }
      }
    }
  }

  return null;
}

// Solve for the target month and day
const piecesToPlace = Object.keys(pieces);
const solution = solve(grid, piecesToPlace);

if (solution) {
  console.log("Solution found!");

  // Create an empty visual grid
  const visualGrid = grid.map((row) =>
    row.map((cell) => (cell === null ? "." : cell.substring(0, 1)))
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
            ? cell
            : pieceColors[cell]
            ? pieceColors[cell](cell)
            : cell
        )
        .join(" ")
    );
  });
} else {
  console.log("No solution found.");
}
