import { useApp } from "../../store";
import { Box, Status, Title } from "../ui";

export function Scoreboard() {
  const room = useApp((state) => state.room);
  const you = useApp((state) => state.you);

  if (!room?.players || room.players.length === 0) return null;

  const isPlayerTurn = (playerId: string) => {
    return room.currentTurnPlayerId === playerId ? "active" : "inactive";
  };

  return (
    <Box variant="card">
      <Title level={3}>Scoreboard</Title>
      <div className="flex flex-col gap-3">
        {room.players.map((player) => (
          <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 flex items-center justify-between">
            <div className="text-lg font-mono font-bold text-slate-900">
              {player.score}
            </div>
            <Status variant={isPlayerTurn(player.id)}>
              <div
                className={`w-2 h-2 rounded-full ${
                  isPlayerTurn(player.id) === "active"
                    ? "bg-emerald-400"
                    : "bg-slate-500"
                }`}
              />
              <span className="text-slate-800 font-medium text-sm">
                {player.id === you?.id ? "You" : player.name}
              </span>
            </Status>
          </div>
        ))}
      </div>
    </Box>
  );
}
