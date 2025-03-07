import { grid } from "./data.js";

export function fits(bitmap, shape, topLeft) {
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

export function placePiece(bitmap, shape, topLeft) {
  const newBitmap = bitmap.map((row) => [...row]);
  const [x0, y0] = topLeft;
  for (const [dx, dy] of shape) {
    newBitmap[x0 + dx][y0 + dy] = true;
  }
  return newBitmap;
}
