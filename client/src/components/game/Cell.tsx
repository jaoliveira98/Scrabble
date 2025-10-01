import { getLetterPoints, getPremiumMultiplier } from "../../utils";
import type { PremiumSquare } from "../../types";

interface CellProps {
  letter: string | null;
  premium?: PremiumSquare;
  onClick?: () => void;
  isStaged?: boolean;
  isAnimating?: boolean;
}

export function Cell({
  letter,
  premium,
  onClick,
  isStaged = false,
  isAnimating = false,
}: CellProps) {
  const getPremiumClasses = (premium: PremiumSquare | undefined) => {
    const baseClasses =
      "w-full h-full flex flex-col items-center justify-center text-xs font-bold rounded-lg border-2 transition-all duration-200";

    switch (premium) {
      case "DL":
        return `${baseClasses} bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 text-slate-900 border-blue-300 shadow-md`;
      case "TL":
        return `${baseClasses} bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 text-white border-blue-400 shadow-md`;
      case "DW":
        return `${baseClasses} bg-gradient-to-br from-pink-300 via-pink-400 to-pink-500 text-white border-pink-400 shadow-md`;
      case "TW":
        return `${baseClasses} bg-gradient-to-br from-red-300 via-red-400 to-red-500 text-white border-red-400 shadow-md`;
      case "STAR":
        return `${baseClasses} bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 text-black border-yellow-400 shadow-lg ring-2 ring-yellow-300/50`;
      default:
        return `${baseClasses} bg-gradient-to-br from-slate-100 via-slate-50 to-white text-slate-800 border-slate-300 shadow-sm`;
    }
  };

  const multiplier = getPremiumMultiplier(premium);

  return (
    <button
      onClick={onClick}
      className={`
        ${getPremiumClasses(premium)}
        ${isStaged ? "ring-4 ring-yellow-400/60 scale-105 shadow-xl z-10" : ""}
        ${
          isAnimating
            ? "animate-pulse scale-110"
            : "hover:scale-105 hover:shadow-lg"
        }
        relative group
      `}
      title={
        premium
          ? `${premium} - ${multiplier}`
          : letter
          ? `${letter} - ${getLetterPoints(letter)} points`
          : ""
      }
    >
      {letter && (
        <div className="flex flex-col items-center justify-center">
          <span
            className={`${
              isAnimating ? "animate-bounce" : ""
            } text-sm sm:text-base font-black drop-shadow-sm`}
          >
            {letter}
          </span>
          <span className="text-[8px] sm:text-[9px] font-bold leading-none drop-shadow-sm">
            {getLetterPoints(letter)}
          </span>
        </div>
      )}
      {!letter && multiplier && (
        <span className="text-[10px] sm:text-[11px] font-black leading-none drop-shadow-sm">
          {multiplier}
        </span>
      )}
    </button>
  );
}
