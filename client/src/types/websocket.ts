import type { Room, Player, PlacedTile } from "./game";

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
  | { type: "swap_tiles"; roomId: string; letters: string[] }
  | {
      type: "resolve_challenge";
      roomId: string;
      action: "accept" | "challenge";
    }
  | { type: "skip_turn"; roomId: string }
  | { type: "resign_game"; roomId: string };
