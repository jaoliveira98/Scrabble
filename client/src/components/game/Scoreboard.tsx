import { useApp } from "../../store";
import { Box, Title, Status, StatsItem } from "../ui";

export function Scoreboard() {
  const room = useApp((s) => s.room);
  const you = useApp((s) => s.you);

  if (!room?.players || room.players.length === 0) return null;

  return (
    <Box variant="card">
      <Title level={3} className="text-center">
        Scoreboard
      </Title>
      <div className="space-y-3">
        {room.players.map((p) => (
          <StatsItem
            key={p.id}
            value={
              <div className="text-lg font-mono font-bold text-slate-900">
                {p.score}
              </div>
            }
            label={
              <Status
                variant={
                  room.currentTurnPlayerId === p.id ? "active" : "inactive"
                }
                className="!px-2 !py-1"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    room.currentTurnPlayerId === p.id
                      ? "bg-emerald-400"
                      : "bg-slate-500"
                  }`}
                />
                <span className="text-slate-800 font-medium text-sm">
                  {p.id === you?.id ? "You" : p.name}
                </span>
              </Status>
            }
            className={
              room.currentTurnPlayerId === p.id
                ? "border-emerald-400/50 ring-1 ring-emerald-400/30"
                : ""
            }
          />
        ))}
      </div>
    </Box>
  );
}
