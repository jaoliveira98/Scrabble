import { useApp } from "../../store";
import { Box, Title, Paragraph, Button, StatsItem } from "../ui";

export function GameEndModal() {
  const room = useApp((s) => s.room);
  const you = useApp((s) => s.you);

  if (!room?.gameEnded || !room.winner || !room.finalScores) return null;

  const isWinner = you?.id === room.winner;
  const winnerPlayer = room.players.find((p) => p.id === room.winner);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
      <Box
        variant="card"
        className="max-w-md w-full mx-4 text-center animate-slideInUp"
      >
        <div
          className={`text-6xl mb-4 ${
            isWinner ? "animate-bounce" : "animate-pulse"
          }`}
        >
          {isWinner ? "🎉" : "😔"}
        </div>
        <Title level={2} className={`mb-2 ${isWinner ? "animate-pulse" : ""}`}>
          {isWinner ? "You Won!" : "Game Over"}
        </Title>
        <Paragraph variant="muted" className="mb-6 animate-fadeIn">
          {isWinner
            ? `Congratulations! You won with ${
                room.finalScores?.[you.id]
              } points!`
            : `${winnerPlayer?.id} won with ${
                room.finalScores?.[room.winner]
              } points!`}
        </Paragraph>

        <div className="mb-6">
          <Title level={3} className="mb-3">
            Final Scores
          </Title>
          <div className="space-y-2">
            {room.players.map((player) => (
              <StatsItem
                key={player.id}
                value={`${room.finalScores?.[player.id]} points`}
                label={
                  <span className="text-slate-900 font-medium">
                    {player.id === you?.id ? "You" : player.id}
                    {player.id === room.winner && " 👑"}
                  </span>
                }
                variant={player.id === room.winner ? "highlighted" : "default"}
              />
            ))}
          </div>
        </div>

        <Button variant="primary" onClick={() => window.location.reload()}>
          Play Again
        </Button>
      </Box>
    </div>
  );
}
