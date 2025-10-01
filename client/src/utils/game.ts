import { LETTER_POINTS, PREMIUM_MULTIPLIERS } from "../constants";
import type { PlacedTile, PremiumSquare } from "../types";

export function getLetterPoints(letter: string): number {
  if (letter === "_") return 0;
  return LETTER_POINTS[letter] ?? 0;
}

export function getPremiumMultiplier(
  premium: PremiumSquare | undefined
): string {
  if (!premium) return "";
  return PREMIUM_MULTIPLIERS[premium] ?? "";
}

export function computeAvailableRack(
  rack: string[],
  staged: PlacedTile[]
): string[] {
  const rackCopy = [...rack];
  for (const tile of staged) {
    const idx = rackCopy.indexOf(tile.letter);
    if (idx !== -1) {
      rackCopy.splice(idx, 1);
    }
  }
  return rackCopy;
}
