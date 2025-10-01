import { create } from "zustand";
import toast from "react-hot-toast";
import type { ServerMessage, ClientMessage, AppState } from "../types";
import { computeAvailableRack } from "../utils";
import { getFriendlyError } from "../utils";

// Extend Window interface to include WebSocket
declare global {
  interface Window {
    ws?: WebSocket;
  }
}

export const useApp = create<AppState>((set, get) => ({
  selectedRackIndex: null,
  staged: [],
  swapMode: false,
  swapSelection: [],
  availableRack: [],
  blankTileModal: {
    isOpen: false,
    pendingCoord: null,
  },
  connect: () => {
    const proto = location.protocol === "https:" ? "wss" : "ws";
    const url = `${proto}://${location.hostname}:3001`;
    const ws = new WebSocket(url);
    window.ws = ws;
    ws.onmessage = (ev) => {
      const msg = JSON.parse(String(ev.data)) as ServerMessage;
      if (msg.type === "connected") set({ clientId: msg.clientId });
      if (msg.type === "room_update") {
        const staged = get().staged;
        const availableRack = computeAvailableRack(msg.you.rack, staged);
        set({
          room: msg.room,
          you: msg.you,
          staged: [],
          selectedRackIndex: null,
          swapSelection: [],
          swapMode: false,
          availableRack,
        });
      }
      if (msg.type === "error") {
        const err = msg.error;
        console.warn("server_error", err);
        toast.error(getFriendlyError(err));
        // On server error (e.g., invalid move), restore staged tiles back to rack
        set((s) => ({
          staged: [],
          selectedRackIndex: null,
          availableRack: computeAvailableRack(s.you?.rack || [], []),
        }));
      }
    };
  },
  createRoom: (playerName: string) => {
    window.ws?.send(
      JSON.stringify({
        type: "create_room",
        playerName,
      } satisfies ClientMessage)
    );
  },
  joinRoom: (roomId: string, playerName: string) => {
    window.ws?.send(
      JSON.stringify({
        type: "join_room",
        roomId,
        playerName,
      } satisfies ClientMessage)
    );
  },
  placeWord: (tiles) => {
    const roomId = get().room?.id;
    if (!roomId) return;
    window.ws?.send(
      JSON.stringify({
        type: "place_word",
        roomId,
        tiles,
      } satisfies ClientMessage)
    );
  },
  setSelectedRackIndex: (idx: number | null) => set({ selectedRackIndex: idx }),
  addPlacement: (tile) =>
    set((s) => {
      const newStaged = [...s.staged, tile];
      const availableRack = computeAvailableRack(s.you?.rack || [], newStaged);
      return { staged: newStaged, availableRack };
    }),
  removePlacementAt: (coord) =>
    set((s) => {
      const newStaged = s.staged.filter(
        (t) => t.coord.row !== coord.row || t.coord.col !== coord.col
      );
      const availableRack = computeAvailableRack(s.you?.rack || [], newStaged);
      return { staged: newStaged, availableRack };
    }),
  clearPlacements: () =>
    set((s) => {
      const availableRack = computeAvailableRack(s.you?.rack || [], []);
      return { staged: [], selectedRackIndex: null, availableRack };
    }),
  submitPlacements: () => {
    const tiles = get().staged;
    if (!tiles.length) return;
    get().placeWord(tiles);
  },
  swapTiles: (letters: string[]) => {
    const roomId = get().room?.id;
    if (!roomId || letters.length === 0) return;
    window.ws?.send(
      JSON.stringify({
        type: "swap_tiles",
        roomId,
        letters,
      } satisfies ClientMessage)
    );
  },
  setSwapMode: (on: boolean) => set({ swapMode: on, swapSelection: [] }),
  toggleSwapIndex: (idx: number) =>
    set((s) => ({
      swapSelection: s.swapSelection.includes(idx)
        ? s.swapSelection.filter((i) => i !== idx)
        : [...s.swapSelection, idx],
    })),
  clearSwapSelection: () => set({ swapSelection: [] }),
  submitSwap: () => {
    const { you, swapSelection } = get();
    if (!you || swapSelection.length === 0) return;
    const letters = swapSelection.map((i) => you.rack[i]);
    get().swapTiles(letters);
    set({ swapSelection: [], swapMode: false });
  },
  resolveChallenge: (action) => {
    const roomId = get().room?.id;
    if (!roomId) return;
    window.ws?.send(
      JSON.stringify({
        type: "resolve_challenge",
        roomId,
        action,
      } satisfies ClientMessage)
    );
  },
  openBlankTileModal: (coord) => {
    set({
      blankTileModal: {
        isOpen: true,
        pendingCoord: coord,
      },
    });
  },
  closeBlankTileModal: () => {
    set({
      blankTileModal: {
        isOpen: false,
        pendingCoord: null,
      },
    });
  },
  selectBlankLetter: (letter) => {
    const { blankTileModal } = get();
    if (!blankTileModal.pendingCoord) return;

    // Add the placement with the selected letter
    get().addPlacement({
      letter,
      coord: blankTileModal.pendingCoord,
    });

    // Close the modal
    get().closeBlankTileModal();
  },
  skipTurn: () => {
    const roomId = get().room?.id;
    if (!roomId) return;
    window.ws?.send(
      JSON.stringify({ type: "skip_turn", roomId } satisfies ClientMessage)
    );
  },
  resignGame: () => {
    const roomId = get().room?.id;
    if (!roomId) return;
    window.ws?.send(
      JSON.stringify({ type: "resign_game", roomId } satisfies ClientMessage)
    );
  },
}));
