export type Coordinate = { row: number; col: number };

export type PlacedTile = { letter: string; coord: Coordinate };

export type PremiumSquare = "DL" | "TL" | "DW" | "TW" | "STAR" | null;

export type BoardCell = { letter: string | null; premium?: PremiumSquare };

export type Board = BoardCell[][];

export type Player = {
  id: string;
  name: string; // Player's display name
  rack: string[];
  score: number;
  timeRemaining: number;
  timePenalty: number;
  isInOvertime: boolean;
};

export type Move = {
  id: string;
  playerId: string;
  tiles: PlacedTile[];
  words: { word: string; score: number; valid: boolean }[];
  totalScore: number;
  isBingo: boolean;
  timestamp: number;
  wordDefinitions?: { [word: string]: string };
};

export type Room = {
  id: string;
  players: Player[];
  board: Board;
  bag: string[];
  currentTurnPlayerId?: string;
  challengeMode?: boolean;
  challengeRule?: "turn";
  pendingMove?: {
    byPlayerId: string;
    tiles: PlacedTile[];
    previousRack: string[];
    previousScore: number;
    primaryWord: string;
  };
  lastMoveBingo?: boolean;
  // Tile bag statistics
  tileBagStats?: {
    totalRemaining: number;
    vowelsRemaining: number;
    consonantsRemaining: number;
  };
  // Game end state
  gameEnded?: boolean;
  winner?: string; // Player ID of the winner
  finalScores?: { [playerId: string]: number };
  // Move history
  moveHistory?: Move[];
  // Timer settings
  timeLimit?: number;
  timerActive?: boolean;
  currentPlayerStartTime?: number;
};
