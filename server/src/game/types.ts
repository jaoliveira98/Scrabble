export type Letter = string; // A-Z or _ for blank

export type Coordinate = { row: number; col: number };

export type PlacedTile = {
  letter: Letter;
  coord: Coordinate;
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

export type PremiumSquare = "DL" | "TL" | "DW" | "TW" | "STAR" | null;

export type BoardCell = {
  letter: Letter | null;
  premium?: PremiumSquare;
};

export type Board = BoardCell[][]; // 15x15

export type Player = {
  id: string;
  name: string; // Player's display name
  rack: Letter[];
  score: number;
  timeRemaining: number; // Time remaining in milliseconds
  timePenalty: number; // Points lost due to overtime
  isInOvertime: boolean; // Whether player is in overtime
};

export type Room = {
  id: string;
  players: Player[];
  board: Board;
  bag: Letter[];
  currentTurnPlayerId?: string;
  createdAt: number;
  challengeMode?: boolean;
  challengeRule?: "turn";
  pendingMove?: {
    byPlayerId: string;
    tiles: PlacedTile[];
    previousRack: Letter[];
    previousScore: number;
    primaryWord: string;
  };
  lastMoveBingo?: boolean; // Track if last move was a bingo
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
  timeLimit?: number; // Time limit in milliseconds (e.g., 3 minutes = 180000)
  timerActive?: boolean; // Whether timer is currently running
  currentPlayerStartTime?: number; // When current player's turn started
};

export type ServerMessage =
  | { type: "connected"; clientId: string }
  | { type: "error"; error: string }
  | { type: "pong"; t: number }
  | { type: "room_update"; room: Room; you: Player };

export type ClientMessage =
  | { type: "ping" }
  | { type: "create_room"; playerName: string }
  | { type: "join_room"; roomId: string; playerName: string }
  | { type: "place_word"; roomId: string; tiles: PlacedTile[] }
  | { type: "swap_tiles"; roomId: string; letters: Letter[] }
  | {
      type: "resolve_challenge";
      roomId: string;
      action: "accept" | "challenge";
    }
  | { type: "skip_turn"; roomId: string }
  | { type: "resign_game"; roomId: string };
