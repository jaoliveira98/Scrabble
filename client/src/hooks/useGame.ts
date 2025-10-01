import { useEffect, useState } from "react";
import { useApp } from "../store";

export function useGame() {
  const { connect, room, you } = useApp();
  const [showBingo, setShowBingo] = useState(false);

  useEffect(() => {
    connect();
  }, [connect]);

  // Show bingo notification when lastMoveBingo is true
  useEffect(() => {
    if (room?.lastMoveBingo) {
      setShowBingo(true);
      const timer = setTimeout(() => setShowBingo(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [room?.lastMoveBingo]);

  const turnText =
    room && you
      ? room.currentTurnPlayerId === you.id
        ? "Your turn"
        : `${
            room.players.find((p) => p.id === room.currentTurnPlayerId)?.name ||
            "Opponent"
          }'s turn`
      : "";

  const isGameEnded = room?.gameEnded ?? false;
  const isYourTurn = room && you && room.currentTurnPlayerId === you.id;

  return {
    room,
    you,
    turnText,
    isGameEnded,
    isYourTurn,
    showBingo,
  };
}
