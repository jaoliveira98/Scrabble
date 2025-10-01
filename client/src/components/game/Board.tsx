import { useState } from "react";
import toast from "react-hot-toast";
import { useApp } from "../../store";
import { Button, ConfirmationModal, Paragraph } from "../ui";
import { Cell } from "./Cell";

export function Board() {
  const room = useApp((state) => state.room);
  const you = useApp((state) => state.you);
  const availableRack = useApp((state) => state.availableRack);
  const selectedIdx = useApp((state) => state.selectedRackIndex);
  const staged = useApp((state) => state.staged);
  const addPlacement = useApp((state) => state.addPlacement);
  const removePlacementAt = useApp((state) => state.removePlacementAt);
  const submitPlacements = useApp((state) => state.submitPlacements);
  const openBlankTileModal = useApp((state) => state.openBlankTileModal);
  const skipTurn = useApp((state) => state.skipTurn);
  const resignGame = useApp((state) => state.resignGame);
  const resolveChallenge = useApp((state) => state.resolveChallenge);
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

  function _handleCellClick(rowIndex: number, colIndex: number) {
    if (!you || !room) return;

    if (room.currentTurnPlayerId !== you.id) {
      toast.error("Not your turn", { position: "bottom-right" });
      return;
    }

    const coord = { row: rowIndex, col: colIndex };
    const isStagedTile = staged.some(
      (p) => p.coord.row === rowIndex && p.coord.col === colIndex
    );

    if (isStagedTile) {
      removePlacementAt(coord);
      return;
    }

    if (selectedIdx == null) return;
    if (room.board[rowIndex][colIndex].letter) return;

    const letter = availableRack[selectedIdx];

    if (letter === "_") {
      openBlankTileModal(coord);
      return;
    }

    addPlacement({ letter, coord });
  }

  function _handleCellDrop(
    event: React.DragEvent<HTMLDivElement>,
    rowIndex: number,
    colIndex: number
  ) {
    event.preventDefault();

    if (!you) return;

    if (room?.currentTurnPlayerId !== you.id) {
      toast.error("Not your turn", { position: "bottom-right" });
      return;
    }

    if (room?.board[rowIndex][colIndex].letter) return;

    try {
      const payload = JSON.parse(event.dataTransfer.getData("text/plain"));
      const letter: string = payload.letter;
      const coord = { row: rowIndex, col: colIndex };

      if (letter === "_") {
        openBlankTileModal(coord);
        return;
      }

      addPlacement({ letter, coord });
    } catch (error) {
      toast.error("Error placing tile", { position: "bottom-right" });
      console.error(`Error placing tile: ${error}`);
    }
  }

  return (
    <>
      <div className="grid grid-cols-15 gap-1 ">
        {room.board.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const temp = staged.find(
              (placedTile) =>
                placedTile.coord.row === rowIndex &&
                placedTile.coord.col === colIndex
            );
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => _handleCellDrop(event, rowIndex, colIndex)}
                className="board-cell"
              >
                <Cell
                  letter={temp?.letter ?? cell.letter}
                  premium={cell.premium}
                  onClick={() => _handleCellClick(rowIndex, colIndex)}
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
                Submit Move ✅
              </Button>
              <Button
                variant="secondary"
                onClick={() => useApp.getState().clearPlacements()}
              >
                Clear 🧹
              </Button>
            </>
          )}
          {/* Accept & Challenge for pending moves */}
          {room.pendingMove ? (
            <>
              <Button
                variant="success"
                onClick={() => resolveChallenge("accept")}
              >
                Accept 🤝
              </Button>
              <Button
                variant="danger"
                onClick={() => resolveChallenge("challenge")}
              >
                Challenge 🔥
              </Button>
            </>
          ) : (
            <>
              <Button variant="text" onClick={() => setShowResignConfirm(true)}>
                Resign 💔
              </Button>
              <Button
                variant="warning"
                onClick={() => setShowSkipConfirm(true)}
              >
                Skip Turn 🔄
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
    </>
  );
}
