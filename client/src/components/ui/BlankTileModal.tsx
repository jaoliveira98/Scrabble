import { ALPHABET } from "../../constants";
import { Title } from "./";

interface BlankTileModalProps {
  isOpen: boolean;
  onSelect: (letter: string) => void;
  onClose: () => void;
}

export function BlankTileModal({
  isOpen,
  onSelect,
  onClose,
}: BlankTileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-lg max-w-md w-full mx-4">
        <Title level={3} className="text-xl font-semibold mb-4 text-white">
          Choose letter for blank tile
        </Title>
        <div className="grid grid-cols-6 gap-2 mb-4">
          {ALPHABET.split("").map((letter) => (
            <button
              key={letter}
              onClick={() => onSelect(letter)}
              className="w-8 h-8 bg-amber-600 text-white rounded border border-amber-500 hover:bg-amber-700 flex items-center justify-center text-sm"
            >
              {letter}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-neutral-600 text-white rounded hover:bg-neutral-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
