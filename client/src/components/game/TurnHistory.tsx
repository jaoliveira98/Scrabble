import { Fragment, useState } from "react";
import { useApp } from "../../store";
import { formatTimestamp } from "../../utils";
import { Box, Button, Paragraph, Title } from "../ui";

export function TurnHistory() {
  const room = useApp((state) => state.room);
  const you = useApp((state) => state.you);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  if (!room?.moveHistory || room.moveHistory.length === 0) return null;

  return (
    <Box variant="card">
      <Title level={3}>Turn History</Title>
      <div className="max-h-80 overflow-y-auto flex flex-col gap-3">
        {room.moveHistory.map((move) => (
          <Fragment key={move.id}>
            <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 flex items-center justify-between">
              <Paragraph size="sm">{formatTimestamp(move.timestamp)}</Paragraph>
              <Paragraph size="sm">
                {move.playerId === you?.id
                  ? "You"
                  : room.players.find((p) => p.id === move.playerId)?.name}
              </Paragraph>
              {move.isBingo && (
                <Paragraph variant="warning" size="sm" className="font-bold">
                  🎉 BINGO!
                </Paragraph>
              )}
              <Paragraph size="sm">{move.totalScore} points</Paragraph>
              {move.words.map((wordResult, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={wordResult.valid ? "success" : "danger"}
                  onClick={() =>
                    setSelectedWord(
                      selectedWord === wordResult.word ? null : wordResult.word
                    )
                  }
                >
                  {wordResult.word} ({wordResult.score})
                </Button>
              ))}
            </div>
            {selectedWord && move.wordDefinitions?.[selectedWord] && (
              <Paragraph size="sm">
                {move.wordDefinitions[selectedWord]}
              </Paragraph>
            )}
          </Fragment>
        ))}
      </div>
    </Box>
  );
}
