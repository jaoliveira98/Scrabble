import { useTimer } from "../../hooks";
import { formatTime } from "../../utils";
import { Box, Title, Paragraph, StatsItem } from "../ui";

export function Timer() {
  const { timerActive, players, you } = useTimer();

  if (!timerActive || !you) return null;

  const getTimeColor = (player: {
    timeRemaining: number;
    isInOvertime: boolean;
  }) => {
    if (player.isInOvertime) return "text-red-500";
    if (player.timeRemaining < 30000) return "text-yellow-500"; // Less than 30 seconds
    return "text-white";
  };

  return (
    <Box variant="card">
      <Title level={3} className="text-center">
        Timer
      </Title>
      <div className="space-y-3">
        {players.map((player) => (
          <StatsItem
            key={player.id}
            value={
              <div className="text-right">
                <div
                  className={`text-2xl font-mono font-bold ${getTimeColor(
                    player
                  )}`}
                >
                  {formatTime(player.timeRemaining)}
                </div>
                {player.timePenalty > 0 && (
                  <Paragraph variant="error" size="sm" className="font-medium">
                    -{player.timePenalty} penalty
                  </Paragraph>
                )}
              </div>
            }
            label={
              <div className="flex items-center gap-2">
                <Paragraph size="sm" className="font-medium">
                  {player.id === you?.id ? "You" : player.name}
                </Paragraph>
                {player.isInOvertime && (
                  <Paragraph variant="error" size="sm" className="font-bold">
                    (Overtime)
                  </Paragraph>
                )}
              </div>
            }
          />
        ))}
      </div>
    </Box>
  );
}
