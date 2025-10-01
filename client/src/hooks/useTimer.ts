import { useEffect } from "react";
import { useApp } from "../store";

export function useTimer() {
  const room = useApp((s) => s.room);
  const you = useApp((s) => s.you);

  useEffect(() => {
    if (!room?.timerActive) return;

    const interval = setInterval(() => {
      // Force re-render to update timer display
    }, 1000);

    return () => clearInterval(interval);
  }, [room?.timerActive]);

  return {
    timerActive: room?.timerActive ?? false,
    players: room?.players ?? [],
    you,
  };
}
