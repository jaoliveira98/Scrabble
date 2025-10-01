interface ScoreAnimationProps {
  score: number;
  isVisible: boolean;
}

export function ScoreAnimation({ score, isVisible }: ScoreAnimationProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-bounce">
        <div className="text-2xl font-bold text-center">+{score} points!</div>
      </div>
    </div>
  );
}
