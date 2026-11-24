import { describe, expect, it } from "vitest";
import { buildTileGrid, fillTemplate, lonLatToTile } from "./tileMath";

describe("lonLatToTile", () => {
  it("converts longitude and latitude to a tile coordinate", () => {
    const tile = lonLatToTile(10.75, 59.91, 7);
    expect(tile.x).toBe(67);
    expect(tile.y).toBe(37);
    expect(tile.fracX).toBeCloseTo(0.82, 1);
    expect(tile.fracY).toBeCloseTo(0.21, 1);
  });
});

describe("buildTileGrid", () => {
  it("builds a 3x3 grid around the center tile", () => {
    const tiles = buildTileGrid({ x: 67, y: 37 }, 7);
    expect(tiles).toHaveLength(9);
    expect(tiles[0]).toEqual({ x: 66, y: 36, row: 0, col: 0 });
    expect(tiles[tiles.length - 1]).toEqual({ x: 68, y: 38, row: 2, col: 2 });
  });

  it("wraps the x coordinate around the antimeridian", () => {
    const tiles = buildTileGrid({ x: 0, y: 10 }, 7);
    const leftColumn = tiles.filter((tile) => tile.col === 0);
    expect(leftColumn.every((tile) => tile.x === 127)).toBe(true);
  });
});

describe("fillTemplate", () => {
  it("replaces the z, x and y placeholders", () => {
    expect(fillTemplate("h/{z}/{x}/{y}.png", 7, 67, 37)).toBe("h/7/67/37.png");
  });
});
