import fs from "fs";

const pieceTransformations = {};

const pieces = {
  // 2x3 rectangle
  A: [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  // L-shape (3x3 legs)
  B: [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 0],
    [2, 0],
  ],
  // L-shape (4x2 legs)
  C: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 0],
  ],
  // T-shape (3 wide/tall)
  D: [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 1],
    [2, 1],
  ],
  // Z-like shape
  E: [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2],
    [1, 3],
  ],
  // Line with pop-out
  F: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 1],
  ],
  // 2x2 square with pop-out
  G: [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
    [2, 0],
  ],
  // C-shape
  H: [
    [0, 0],
    [0, 1],
    [1, 0],
    [2, 0],
    [2, 1],
  ],
};

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

for (const [key, shape] of Object.entries(pieces)) {
  pieceTransformations[key] = generateTransformations(shape);
}

function optimizeTransformations() {
  for (const [pieceId, shapes] of Object.entries(pieceTransformations)) {
    const uniqueShapes = new Map();
    for (const shape of shapes) {
      const key = shape
        .map((point) => `${point[0]},${point[1]}`)
        .sort()
        .join("|");
      uniqueShapes.set(key, shape);
    }
    pieceTransformations[pieceId] = Array.from(uniqueShapes.values());
  }
}

optimizeTransformations();

fs.writeFile(
  "./generated/pieceTransformations.json",
  JSON.stringify(pieceTransformations, null, 2),
  (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }
    console.log("Saved transformations to pieceTransformations.json");
  }
);
