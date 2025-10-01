import { useState } from "react";
import { useApp } from "../../store";
import { formatTimestamp } from "../../utils";
import { Box, Title, Paragraph, Button, StatsItem } from "../ui";

export function TurnHistory() {
  const room = useApp((s) => s.room);
  const you = useApp((s) => s.you);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  if (!room?.moveHistory || room.moveHistory.length === 0) return null;

  return (
    <Box variant="card">
      <Title level={3} className="text-center">
        Turn History
      </Title>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {room.moveHistory.map((move) => (
          <StatsItem
            key={move.id}
            value={
              <div className="text-right">
                <Paragraph size="sm" className="font-medium">
                  {formatTimestamp(move.timestamp)}
                </Paragraph>
                <Paragraph size="sm" className="font-medium">
                  Total: {move.totalScore} points
                </Paragraph>
              </div>
            }
            label={
              <div className="flex items-center gap-2">
                <Paragraph size="sm" className="font-medium">
                  {move.playerId === you?.id
                    ? "You"
                    : room.players.find((p) => p.id === move.playerId)?.name ||
                      move.playerId}
                </Paragraph>
                {move.isBingo && (
                  <Paragraph variant="warning" size="sm" className="font-bold">
                    🎉 BINGO!
                  </Paragraph>
                )}
              </div>
            }
          >
            <div className="space-y-2 mt-3">
              {move.words.map((wordResult, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={wordResult.valid ? "success" : "danger"}
                    onClick={() =>
                      setSelectedWord(
                        selectedWord === wordResult.word
                          ? null
                          : wordResult.word
                      )
                    }
                  >
                    {wordResult.word} ({wordResult.score})
                  </Button>

                  {selectedWord === wordResult.word &&
                    move.wordDefinitions?.[wordResult.word] && (
                      <div className="text-xs text-slate-800 bg-slate-600 p-3 rounded-lg">
                        {move.wordDefinitions[wordResult.word]}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </StatsItem>
        ))}
      </div>
    </Box>
  );
}
