import type { Room, Player, PlacedTile, Coordinate } from "./game";

export type AppState = {
  clientId?: string;
  room?: Room;
  you?: Player;
  selectedRackIndex: number | null;
  staged: PlacedTile[];
  swapMode: boolean;
  swapSelection: number[];
  // Computed properties
  availableRack: string[];
  // Blank tile modal
  blankTileModal: {
    isOpen: boolean;
    pendingCoord: Coordinate | null;
  };
  connect: () => void;
  createRoom: (playerName: string) => void;
  joinRoom: (roomId: string, playerName: string) => void;
  placeWord: (tiles: PlacedTile[]) => void;
  setSelectedRackIndex: (idx: number | null) => void;
  addPlacement: (tile: PlacedTile) => void;
  removePlacementAt: (coord: Coordinate) => void;
  clearPlacements: () => void;
  submitPlacements: () => void;
  swapTiles: (letters: string[]) => void;
  setSwapMode: (on: boolean) => void;
  toggleSwapIndex: (idx: number) => void;
  clearSwapSelection: () => void;
  submitSwap: () => void;
  resolveChallenge: (action: "accept" | "challenge") => void;
  // Blank tile functions
  openBlankTileModal: (coord: Coordinate) => void;
  closeBlankTileModal: () => void;
  selectBlankLetter: (letter: string) => void;
  // Skip and resign functions
  skipTurn: () => void;
  resignGame: () => void;
};
