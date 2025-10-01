import { useState } from "react";
import { useApp } from "../../store";
import { Button, Paragraph, Tile } from "../ui";

export function Rack() {
  const room = useApp((state) => state.room);
  const you = useApp((state) => state.you);
  const availableRack = useApp((state) => state.availableRack);
  const selectedIdx = useApp((state) => state.selectedRackIndex);
  const setSelectedIdx = useApp((state) => state.setSelectedRackIndex);
  const swapMode = useApp((state) => state.swapMode);
  const swapSelection = useApp((state) => state.swapSelection);
  const toggleSwapIndex = useApp((state) => state.toggleSwapIndex);
  const setSwapMode = useApp((state) => state.setSwapMode);
  const submitSwap = useApp((state) => state.submitSwap);

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  if (!you) return null;

  // Don't show rack if game has ended
  if (room?.gameEnded) return null;

  return (
    <>
      <Paragraph size="sm" className="text-center">
        Click to select • Drag to place on board
      </Paragraph>

      {/* Letter Holder/Tray */}
      <div className="letter-holder flex gap-1 sm:gap-2 justify-center flex-wrap">
        {availableRack.map((letter, index) => {
          const isSelected = selectedIdx === index;
          const inSwap = swapSelection.includes(index);
          const isBlank = letter === "_";
          const isDragging = draggingIndex === index;

          return (
            <div
              key={`${letter}-${index}`}
              className={`tile-slot ${isDragging ? "dragging" : ""}`}
            >
              <Tile
                letter={letter}
                isSelected={isSelected}
                isBlank={isBlank}
                isStaged={inSwap}
                isAnimating={isSelected}
                draggable={!swapMode}
                data-tile-index={index}
                onDragStart={(event) => {
                  setDraggingIndex(index);
                  event.dataTransfer.setData(
                    "text/plain",
                    JSON.stringify({ letter: letter, rackIndex: index })
                  );
                  // Set drag ghost image
                  const dragImage = event.currentTarget.cloneNode(
                    true
                  ) as HTMLElement;
                  dragImage.classList.add("drag-ghost");
                  document.body.appendChild(dragImage);
                  event.dataTransfer.setDragImage(dragImage, 0, 0);
                  // Clean up after a short delay
                  setTimeout(() => {
                    document.body.removeChild(dragImage);
                  }, 0);
                }}
                onDragEnd={() => {
                  setDraggingIndex(null);
                }}
                onClick={() => {
                  if (swapMode) {
                    toggleSwapIndex(index);
                    return;
                  }
                  setSelectedIdx(index);
                }}
              />
            </div>
          );
        })}
      </div>
      {/* Swap controls positioned near the rack for better UX */}
      {room && you && room.currentTurnPlayerId === you.id && (
        <div className="flex justify-center gap-3 mt-6">
          <Button
            variant={swapMode ? "warning" : "secondary"}
            size="sm"
            onClick={() => setSwapMode(!swapMode)}
          >
            {swapMode ? "Swap Mode: ON" : "Swap Mode"}
          </Button>
          {swapMode && (
            <Button variant="warning" size="sm" onClick={() => submitSwap()}>
              Submit Swap
            </Button>
          )}
        </div>
      )}
    </>
  );
}
