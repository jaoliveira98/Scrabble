// Letter points system (matching server logic)
export const LETTER_POINTS: Record<string, number> = {
  A: 1,
  B: 3,
  C: 3,
  D: 2,
  E: 1,
  F: 4,
  G: 2,
  H: 4,
  I: 1,
  J: 8,
  K: 5,
  L: 1,
  M: 3,
  N: 1,
  O: 1,
  P: 3,
  Q: 10,
  R: 1,
  S: 1,
  T: 1,
  U: 1,
  V: 4,
  W: 4,
  X: 8,
  Y: 4,
  Z: 10,
};

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const BOARD_SIZE = 15;

export const PREMIUM_MULTIPLIERS = {
  DL: "2L",
  TL: "3L",
  DW: "2W",
  TW: "3W",
  STAR: "2W",
} as const;
