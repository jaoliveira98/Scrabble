import { useState } from "react";
import { useApp } from "../../store";
import { Cell } from "./Cell";
import { ConfirmationModal, Button, Title, Box, Paragraph } from "../ui";
import toast from "react-hot-toast";

export function Board() {
  const room = useApp((s) => s.room);
  const you = useApp((s) => s.you);
  const availableRack = useApp((s) => s.availableRack);
  const selectedIdx = useApp((s) => s.selectedRackIndex);
  const staged = useApp((s) => s.staged);
  const addPlacement = useApp((s) => s.addPlacement);
  const removePlacementAt = useApp((s) => s.removePlacementAt);
  const submitPlacements = useApp((s) => s.submitPlacements);
  const openBlankTileModal = useApp((s) => s.openBlankTileModal);
  const skipTurn = useApp((s) => s.skipTurn);
  const resignGame = useApp((s) => s.resignGame);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showResignConfirm, setShowResignConfirm] = useState(false);

  if (!room) return null;

  // Don't allow interactions if game has ended
  if (room.gameEnded) {
    return (
      <div className="text-center py-8">
        <Paragraph className="text-neutral-400 text-lg">
          Game has ended
        </Paragraph>
        <Paragraph className="text-neutral-500 text-sm">
          Check the final scores above
        </Paragraph>
      </div>
    );
  }

  function handleCellClick(r: number, c: number) {
    if (!you || !room) return;
    if (room.currentTurnPlayerId !== you.id) {
      toast.error("Not your turn");
      return;
    }
    const isStaged = staged.find((p) => p.coord.row === r && p.coord.col === c);
    if (isStaged) {
      removePlacementAt({ row: r, col: c });
      return;
    }
    if (selectedIdx == null) return;
    const existing = room.board[r][c].letter;
    if (existing) return;
    const letter = availableRack[selectedIdx];

    // If it's a blank tile, open the modal
    if (letter === "_") {
      openBlankTileModal({ row: r, col: c });
      return;
    }

    // Otherwise, place the tile directly
    addPlacement({ letter, coord: { row: r, col: c } });
  }

  return (
    <Box variant="card-large">
      <div className="relative z-10">
        <Title level={2} className="text-center">
          Game Board
        </Title>
        <div className="grid grid-cols-15 gap-1 sm:gap-1.5 md:gap-2 p-2 sm:p-3 md:p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-inner max-w-2xl mx-auto">
          {room.board.flatMap((row, r) =>
            row.map((cell, c) => {
              const temp = staged.find(
                (p) => p.coord.row === r && p.coord.col === c
              );
              return (
                <div
                  key={`${r}-${c}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (!you) return;
                    if (room.currentTurnPlayerId !== you.id) {
                      toast.error("Not your turn");
                      return;
                    }
                    const existing = room.board[r][c].letter;
                    if (existing) return;
                    try {
                      const payload = JSON.parse(
                        e.dataTransfer.getData("text/plain")
                      );
                      const letter: string = payload.letter;

                      // If it's a blank tile, open the modal
                      if (letter === "_") {
                        openBlankTileModal({ row: r, col: c });
                        return;
                      }

                      // Otherwise, place the tile directly
                      addPlacement({ letter, coord: { row: r, col: c } });
                    } catch {
                      // Ignore drag and drop errors
                    }
                  }}
                  className="board-cell"
                >
                  <Cell
                    letter={temp?.letter ?? cell.letter}
                    premium={cell.premium}
                    onClick={() => handleCellClick(r, c)}
                    isStaged={!!temp}
                    isAnimating={!!temp}
                  />
                </div>
              );
            })
          )}
        </div>
        {you && room.currentTurnPlayerId === you.id && (
          <div className="flex gap-4 mt-8 justify-end">
            {staged.length > 0 && (
              <>
                <Button variant="primary" onClick={submitPlacements}>
                  <span className="flex items-center gap-2">
                    <span>Submit Move</span>
                    <span className="text-lg">✓</span>
                  </span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => useApp.getState().clearPlacements()}
                >
                  <span className="flex items-center gap-2">
                    <span>Clear</span>
                    <span className="text-lg">↺</span>
                  </span>
                </Button>
              </>
            )}
            {/* Skip & Resign next to board actions */}
            {!room.pendingMove && (
              <>
                <Button
                  variant="text"
                  onClick={() => setShowResignConfirm(true)}
                >
                  Resign
                </Button>
                <Button
                  variant="warning"
                  onClick={() => setShowSkipConfirm(true)}
                >
                  Skip Turn
                </Button>
              </>
            )}
          </div>
        )}
        {/* Modals over the board area */}
        <ConfirmationModal
          isOpen={showSkipConfirm}
          title="Skip Turn"
          message="Are you sure you want to skip your turn? This will pass the turn to your opponent."
          confirmText="Skip"
          cancelText="Cancel"
          onConfirm={() => {
            skipTurn();
            setShowSkipConfirm(false);
          }}
          onCancel={() => setShowSkipConfirm(false)}
        />
        <ConfirmationModal
          isOpen={showResignConfirm}
          title="Resign Game"
          message="Are you sure you want to resign? This will end the game and your opponent will win."
          confirmText="Resign"
          cancelText="Cancel"
          onConfirm={() => {
            resignGame();
            setShowResignConfirm(false);
          }}
          onCancel={() => setShowResignConfirm(false)}
          isDestructive={true}
        />
      </div>
    </Box>
  );
}
