import {
  Board,
  Controls,
  GameEndModal,
  PointLegend,
  Rack,
  Scoreboard,
  TileBagStats,
  Timer,
  TurnHistory,
} from "./components/game";
import {
  BlankTileModal,
  Paragraph,
  ScoreAnimation,
  Title,
} from "./components/ui";
import { useScoreAnimation } from "./hooks";
import { useApp } from "./store";

export default function App() {
  const blankTileModal = useApp((s) => s.blankTileModal);
  const closeBlankTileModal = useApp((s) => s.closeBlankTileModal);
  const selectBlankLetter = useApp((s) => s.selectBlankLetter);
  const { showScoreAnimation, scoreToShow } = useScoreAnimation();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="text-center">
          <Title level={1}>Scrabble</Title>
          <Paragraph>Classic word game with friends</Paragraph>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Controls />
            <Board />
            <Rack />
          </div>
          <div className="space-y-6">
            <PointLegend />
            <TileBagStats />
            <Scoreboard />
            <Timer />
            <TurnHistory />
          </div>
        </div>

        <BlankTileModal
          isOpen={blankTileModal.isOpen}
          onSelect={selectBlankLetter}
          onClose={closeBlankTileModal}
        />
        <GameEndModal />
        <ScoreAnimation score={scoreToShow} isVisible={showScoreAnimation} />
      </div>
    </div>
  );
}
