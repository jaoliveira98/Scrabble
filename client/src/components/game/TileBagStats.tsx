import { useApp } from "../../store";
import { Box, Title, StatsItem } from "../ui";

export function TileBagStats() {
  const room = useApp((s) => s.room);

  if (!room?.tileBagStats) return null;

  const { totalRemaining, vowelsRemaining, consonantsRemaining } =
    room.tileBagStats;

  return (
    <Box variant="card">
      <Title level={3} className="text-center">
        Tile Bag
      </Title>
      <div className="grid grid-cols-3 gap-4 text-center">
        <StatsItem value={totalRemaining} label="Total" />
        <StatsItem value={vowelsRemaining} label="Vowels" />
        <StatsItem value={consonantsRemaining} label="Consonants" />
      </div>
    </Box>
  );
}
