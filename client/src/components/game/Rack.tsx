import { useState } from "react";
import { useApp } from "../../store";
import { Box, Title, Button, Tile, Paragraph } from "../ui";

export function Rack() {
  const room = useApp((s) => s.room);
  const you = useApp((s) => s.you);
  const availableRack = useApp((s) => s.availableRack);
  const selectedIdx = useApp((s) => s.selectedRackIndex);
  const setSelectedIdx = useApp((s) => s.setSelectedRackIndex);
  const swapMode = useApp((s) => s.swapMode);
  const swapSelection = useApp((s) => s.swapSelection);
  const toggleSwapIndex = useApp((s) => s.toggleSwapIndex);
  const setSwapMode = useApp((s) => s.setSwapMode);
  const submitSwap = useApp((s) => s.submitSwap);

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  if (!you) return null;

  // Don't show rack if game has ended
  if (room?.gameEnded) return null;

  return (
    <Box variant="card-large">
      <div className="relative z-10">
        <Title level={2} className="text-center">
          Your Tiles
        </Title>
        <Paragraph size="sm" className="text-center text-slate-600 mb-4">
          Click to select • Drag to place on board
        </Paragraph>

        {/* Letter Holder/Tray */}
        <div className="letter-holder">
          <div className="text-center mb-2">
            <span className="text-xs font-semibold text-purple-100 uppercase tracking-wider">
              Letter Rack
            </span>
          </div>
          <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
            {availableRack.map((l, i) => {
              const isSelected = selectedIdx === i;
              const inSwap = swapSelection.includes(i);
              const isBlank = l === "_";
              const isDragging = draggingIndex === i;

              return (
                <div
                  key={`${l}-${i}`}
                  className={`tile-slot ${isDragging ? "dragging" : ""}`}
                >
                  <Tile
                    letter={l}
                    isSelected={isSelected}
                    isBlank={isBlank}
                    isStaged={inSwap}
                    isAnimating={isSelected}
                    draggable={!swapMode}
                    data-tile-index={i}
                    onDragStart={(e) => {
                      setDraggingIndex(i);
                      e.dataTransfer.setData(
                        "text/plain",
                        JSON.stringify({ letter: l, rackIndex: i })
                      );
                      // Set drag ghost image
                      const dragImage = e.currentTarget.cloneNode(
                        true
                      ) as HTMLElement;
                      dragImage.classList.add("drag-ghost");
                      document.body.appendChild(dragImage);
                      e.dataTransfer.setDragImage(dragImage, 0, 0);
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
                        toggleSwapIndex(i);
                        return;
                      }
                      setSelectedIdx(i);
                    }}
                  />
                </div>
              );
            })}
          </div>
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
      </div>
    </Box>
  );
}
