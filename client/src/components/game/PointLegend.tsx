import { ALPHABET } from "../../constants";
import { getLetterPoints } from "../../utils";
import { Box, Title, PremiumSquare, Paragraph } from "../ui";

export function PointLegend() {
  const letters = ALPHABET.split("");

  return (
    <Box variant="card">
      <Title level={3} className="text-center">
        Letter Points
      </Title>
      <div className="grid grid-cols-6 gap-2 mb-4">
        {letters.map((letter) => (
          <div
            key={letter}
            className="bg-slate-100 p-2 rounded-lg text-center border border-slate-200"
            title={`${letter} - ${getLetterPoints(letter)} points`}
          >
            <div className="text-lg font-bold text-slate-900">{letter}</div>
            <div className="text-xs text-slate-700">
              {getLetterPoints(letter)}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-4">
        <Title level={3} className="text-center mb-3">
          Premium Squares
        </Title>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <PremiumSquare premium="DL" size="md">
              2L
            </PremiumSquare>
            <Paragraph size="sm" className="text-slate-700">
              Double Letter
            </Paragraph>
          </div>
          <div className="flex items-center gap-2">
            <PremiumSquare premium="TL" size="md">
              3L
            </PremiumSquare>
            <Paragraph size="sm" className="text-slate-700">
              Triple Letter
            </Paragraph>
          </div>
          <div className="flex items-center gap-2">
            <PremiumSquare premium="DW" size="md">
              2W
            </PremiumSquare>
            <Paragraph size="sm" className="text-slate-700">
              Double Word
            </Paragraph>
          </div>
          <div className="flex items-center gap-2">
            <PremiumSquare premium="TW" size="md">
              3W
            </PremiumSquare>
            <Paragraph size="sm" className="text-slate-700">
              Triple Word
            </Paragraph>
          </div>
        </div>
      </div>
    </Box>
  );
}
