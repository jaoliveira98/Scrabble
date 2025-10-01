import type { HTMLAttributes, ReactNode } from "react";
import { getLetterPoints } from "../../utils";

interface TileProps extends HTMLAttributes<HTMLButtonElement> {
  letter: string;
  isSelected?: boolean;
  isBlank?: boolean;
  isStaged?: boolean;
  isAnimating?: boolean;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
}

export function Tile({
  letter,
  isSelected = false,
  isBlank = false,
  isStaged = false,
  isAnimating = false,
  draggable = false,
  onDragStart,
  className = "",
  children,
  ...props
}: TileProps) {
  const baseClasses = `
    w-14 h-16 sm:w-16 sm:h-18 
    relative flex flex-col items-center justify-center 
    text-sm font-bold
    transition-all duration-300 transform
    rounded-lg border-2 border-amber-700/50
    scrabble-tile
  `;

  const stateClasses = isSelected
    ? "scale-110 shadow-2xl ring-4 ring-amber-400/50 border-amber-400"
    : isStaged
    ? "scale-105 shadow-xl ring-4 ring-red-400/50 border-red-400"
    : "hover:scale-105 hover:shadow-xl border-amber-600/80 hover:border-amber-500";

  const tileClasses = isBlank ? "text-amber-50" : "text-amber-50";

  const animationClasses = isAnimating ? "animate-pulse scale-110" : "";

  const classes = `${baseClasses} ${stateClasses} ${tileClasses} ${animationClasses} ${className}`;

  return (
    <button
      draggable={draggable}
      onDragStart={onDragStart}
      className={classes}
      title={
        isBlank
          ? "Blank tile - click to place and choose letter"
          : `${letter} - ${getLetterPoints(letter)} points`
      }
      {...props}
    >
      {/* Domino-style tile design */}
      <div className="flex flex-col items-center justify-center w-full h-full relative">
        {/* Letter section - top half */}
        <div className="flex-1 flex items-center justify-center">
          <span
            className={`text-xl sm:text-2xl font-black drop-shadow-lg ${
              isSelected ? "animate-pulse" : ""
            }`}
          >
            {isBlank ? "?" : letter}
          </span>
        </div>

        {/* Points section - bottom half */}
        {!isBlank && (
          <div className="absolute bottom-1 right-1">
            <span className="text-[10px] sm:text-[12px] font-bold text-amber-100 leading-none drop-shadow-sm bg-amber-800/50 rounded-full px-1 py-0.5">
              {getLetterPoints(letter)}
            </span>
          </div>
        )}

        {/* Blank tile indicator */}
        {isBlank && (
          <div className="absolute bottom-1 right-1">
            <span className="text-[10px] sm:text-[12px] font-bold text-amber-200 leading-none drop-shadow-sm bg-amber-800/50 rounded-full px-1 py-0.5">
              ?
            </span>
          </div>
        )}
      </div>
      {children}
    </button>
  );
}
