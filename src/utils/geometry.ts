import type { Geometry } from "../types";
export function relativeToAbsolute(
  geometry: Geometry,
  containerWidth: number,
  containerHeight: number
) {
  return {
    x: geometry.x * containerWidth,
    y: geometry.y * containerHeight,
    width: geometry.width * containerWidth,
    height: geometry.height * containerHeight,
  };
}

export function absoluteToRelative(
  rect: { x: number; y: number; width: number; height: number },
  containerWidth: number,
  containerHeight: number
): Geometry {
  return {
    x: rect.x / containerWidth,
    y: rect.y / containerHeight,
    width: rect.width / containerWidth,
    height: rect.height / containerHeight,
  };
}

export function getAspectRatio(ratio: string): number {
  switch (ratio) {
    case "16:9":
      return 16 / 9;
    case "9:16":
      return 9 / 16;
    case "1:1":
      return 1;
    case "4:5":
      return 4 / 5;
    default:
      return 16 / 9;
  }
}
