import type { HTMLAttributes, ReactNode } from "react";
import { getLetterPoints } from "../../utils";

interface TileProps extends HTMLAttributes<HTMLButtonElement> {
  letter: string;
  isSelected?: boolean;
  isBlank?: boolean;
  isStaged?: boolean;
  isAnimating?: boolean;
  draggable?: boolean;
  variant?: "rack" | "board";
  onDragStart?: (e: React.DragEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
}

const TileContent = ({
  letter,
  isBlank,
  isSelected,
  points,
}: {
  letter: string;
  isBlank: boolean;
  isSelected: boolean;
  points: number;
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      {/* Letter section */}
      <div className="flex-1 flex items-center justify-center">
        <span
          className={`text-lg sm:text-xl md:text-2xl font-black drop-shadow-lg ${
            isSelected ? "animate-pulse" : ""
          }`}
        >
          {isBlank ? "?" : letter}
        </span>
      </div>

      {/* Points indicator */}
      <div className="absolute bottom-0.5 right-0.5">
        <span className="text-[8px] sm:text-[10px] md:text-[12px] font-bold text-amber-100 leading-none drop-shadow-sm bg-amber-800/50 rounded-full px-1 py-0.5">
          {isBlank ? "?" : points}
        </span>
      </div>
    </div>
  );
};

const getTileClasses = ({
  variant,
  isSelected,
  isStaged,
  isAnimating,
  className,
}: {
  variant: "rack" | "board";
  isSelected: boolean;
  isStaged: boolean;
  isAnimating: boolean;
  className: string;
}) => {
  const sizeClasses =
    variant === "board" ? "w-[95%] h-[95%]" : "w-14 h-16 sm:w-16 sm:h-18";

  const borderClasses = variant === "board" ? "border" : "border-2";

  const stateClasses = isSelected
    ? "scale-110 shadow-2xl ring-4 ring-amber-400/50 border-amber-400"
    : isStaged
    ? "scale-105 shadow-xl ring-4 ring-red-400/50 border-red-400"
    : "hover:scale-105 hover:shadow-xl border-amber-600/80 hover:border-amber-500";

  const animationClasses = isAnimating ? "animate-pulse" : "";

  return `
    ${sizeClasses}
    relative flex flex-col items-center justify-center 
    text-amber-50
    transition-all duration-300 transform
    rounded-lg ${borderClasses}
    scrabble-tile
    ${stateClasses}
    ${animationClasses}
    ${className}
  `.trim();
};

export function Tile({
  letter,
  isSelected = false,
  isBlank = false,
  isStaged = false,
  isAnimating = false,
  draggable = false,
  variant = "rack",
  onDragStart,
  className = "",
  children,
  ...props
}: TileProps) {
  const points = getLetterPoints(letter);
  const title = isBlank
    ? "Blank tile - click to place and choose letter"
    : `${letter} - ${points} points`;

  return (
    <button
      draggable={draggable}
      onDragStart={onDragStart}
      className={getTileClasses({
        variant,
        isSelected,
        isStaged,
        isAnimating,
        className,
      })}
      title={title}
      {...props}
    >
      <TileContent
        letter={letter}
        isBlank={isBlank}
        isSelected={isSelected}
        points={points}
      />
      {children}
    </button>
  );
}
