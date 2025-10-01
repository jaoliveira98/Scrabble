import { ALPHABET } from "../../constants";
import type { PremiumSquare as PremiumSquareType } from "../../types";
import { getLetterPoints } from "../../utils";
import { Box, Paragraph, PremiumSquare, Title } from "../ui";

const SquarePoints = ({
  premium,
  size,
  title,
  description,
}: {
  premium: PremiumSquareType;
  size: "sm" | "md" | "lg";
  title: string;
  description: string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <PremiumSquare premium={premium} size={size}>
        {title}
      </PremiumSquare>
      <Paragraph size="sm">{description}</Paragraph>
    </div>
  );
};

export function PointLegend() {
  const letters = ALPHABET.split("");

  return (
    <Box variant="card" className="space-y-3">
      <Title level={3}>Letter Points</Title>
      <div className="grid grid-cols-6 gap-1">
        {letters.map((letter) => (
          <div
            key={letter}
            className="bg-slate-100 p-2 rounded-lg text-center border border-slate-200"
            title={`${letter} - ${getLetterPoints(letter)} points`}
          >
            <Title level={4} className="!mb-0">
              {letter}
            </Title>
            <Paragraph size="sm">{getLetterPoints(letter)}</Paragraph>
          </div>
        ))}
      </div>

      <Title level={3}>Premium Squares</Title>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <SquarePoints
          premium="DL"
          size="md"
          title="2L"
          description="Double Letter"
        />
        <SquarePoints
          premium="TL"
          size="md"
          title="3L"
          description="Triple Letter"
        />
        <SquarePoints
          premium="DW"
          size="md"
          title="2W"
          description="Double Word"
        />
        <SquarePoints
          premium="TW"
          size="md"
          title="3W"
          description="Triple Word"
        />
        <SquarePoints premium="STAR" size="md" title="S" description="Start" />
      </div>
    </Box>
  );
}
