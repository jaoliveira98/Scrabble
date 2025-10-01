import { useEffect, useState } from "react";
import { useApp } from "../store";

export function useScoreAnimation() {
  const you = useApp((s) => s.you);
  const room = useApp((s) => s.room);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [scoreToShow, setScoreToShow] = useState(0);

  // Track score changes for animation
  useEffect(() => {
    if (you?.score !== undefined && you.score > lastScore) {
      const scoreDiff = you.score - lastScore;
      if (scoreDiff > 0) {
        // Suppress score pop if the game ended due to resign
        if (!room?.gameEnded) {
          setScoreToShow(scoreDiff);
          setShowScoreAnimation(true);
          setTimeout(() => setShowScoreAnimation(false), 2000);
        }
      }
    }
    setLastScore(you?.score || 0);
  }, [you?.score, lastScore, room?.gameEnded]);

  return {
    showScoreAnimation,
    scoreToShow,
  };
}
