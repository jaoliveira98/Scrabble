import { useRef, useState, useEffect } from "react";
import { useApp } from "../../store";
import { Box, Button, Paragraph, Status, Input } from "../ui";

export function Controls() {
  const { connect, createRoom, joinRoom, room, you, resolveChallenge } =
    useApp();
  const [joinId, setJoinId] = useState("");
  const [joinPlayerName, setJoinPlayerName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const createNameRef = useRef<HTMLInputElement | null>(null);
  const joinNameRef = useRef<HTMLInputElement | null>(null);
  const [showBingo, setShowBingo] = useState(false);

  useEffect(() => {
    connect();
  }, [connect]);

  // Autofocus appropriate input when switching tabs
  useEffect(() => {
    if (activeTab === "create") {
      createNameRef.current?.focus();
    } else {
      joinNameRef.current?.focus();
    }
  }, [activeTab]);

  // Show bingo notification when lastMoveBingo is true
  useEffect(() => {
    if (room?.lastMoveBingo) {
      setShowBingo(true);
      const timer = setTimeout(() => setShowBingo(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [room?.lastMoveBingo]);

  const turnText =
    room && you
      ? room.currentTurnPlayerId === you.id
        ? "Your turn"
        : `${
            room.players.find((p) => p.id === room.currentTurnPlayerId)?.name ||
            "Opponent"
          }'s turn`
      : "";

  // Don't show controls if game has ended
  if (room?.gameEnded) {
    return (
      <div className="flex items-center gap-2 mb-4">
        <Paragraph variant="warning" size="lg" className="font-semibold">
          Game Ended - Check Final Scores Below
        </Paragraph>
      </div>
    );
  }

  return (
    <Box variant="card-large" className="mb-8">
      {showBingo && (
        <div className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-bold shadow-2xl animate-bounce transform scale-110 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-spin">🎉</span>
            <span className="text-lg">BINGO! +50 points!</span>
            <span className="text-2xl animate-spin">🎉</span>
          </div>
        </div>
      )}

      <div className="relative z-10">
        <div className="space-y-4 mb-6">
          {/* Tabs */}
          <div className="inline-flex rounded-xl overflow-hidden border border-slate-300/50">
            <button
              className={`px-5 py-2 text-sm font-semibold transition-colors ${
                activeTab === "create"
                  ? "bg-slate-200 text-slate-800"
                  : "bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-150"
              }`}
              onClick={() => setActiveTab("create")}
            >
              Create Room
            </button>
            <button
              className={`px-5 py-2 text-sm font-semibold transition-colors border-l border-slate-300/50 ${
                activeTab === "join"
                  ? "bg-slate-200 text-slate-800"
                  : "bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-150"
              }`}
              onClick={() => setActiveTab("join")}
            >
              Join Room
            </button>
          </div>

          {activeTab === "create" && (
            <div className="flex flex-wrap items-center gap-4">
              <Input
                placeholder="Your name (required)"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                ref={createNameRef}
              />
              <Button
                variant="primary"
                onClick={() => createRoom(playerName)}
                disabled={!playerName.trim()}
              >
                Create Room
              </Button>
            </div>
          )}

          {activeTab === "join" && (
            <>
              <div className="flex flex-wrap items-center gap-4">
                <Input
                  variant={!joinPlayerName.trim() ? "error" : "default"}
                  placeholder="Your name (required to join)"
                  value={joinPlayerName}
                  onChange={(e) => setJoinPlayerName(e.target.value)}
                  ref={joinNameRef}
                />
                <Input
                  placeholder="Room ID (e.g. ABC123)"
                  value={joinId}
                  onChange={(e) => setJoinId(e.target.value.toUpperCase())}
                />
                <Button
                  variant="success"
                  onClick={() => joinRoom(joinId, joinPlayerName)}
                  disabled={!joinId.trim() || !joinPlayerName.trim()}
                >
                  Join Room
                </Button>
              </div>
              {!joinPlayerName.trim() && joinId.trim() && (
                <Paragraph variant="error" size="sm">
                  Please enter your name to join a room.
                </Paragraph>
              )}
            </>
          )}
        </div>

        {room && you && (
          <div className="bg-slate-100 backdrop-blur-sm p-6 rounded-xl mb-6 border border-slate-600/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-slate-800">
                <span className="font-semibold text-slate-800">Room:</span>
                <span className="font-mono text-blue-300 ml-1">
                  {room.id}
                </span>{" "}
                ·
                <span className="font-semibold text-slate-800 ml-2">
                  Player:
                </span>
                <span className="font-mono text-amber-800 ml-1">
                  {you.name}
                </span>{" "}
                ·
                <span className="font-semibold text-slate-800 ml-2">
                  Score:
                </span>
                <span className="font-mono text-green-800 ml-1">
                  {you.score}
                </span>
              </div>
              <Status
                variant={
                  room.currentTurnPlayerId === you.id ? "active" : "inactive"
                }
                className="font-bold"
              >
                {turnText}
              </Status>
            </div>
          </div>
        )}

        {room && you && room.currentTurnPlayerId === you.id && (
          <div className="flex flex-wrap items-center gap-4">
            {room.pendingMove && room.currentTurnPlayerId === you.id && (
              <>
                <Button
                  variant="success"
                  onClick={() => resolveChallenge("accept")}
                >
                  Accept
                </Button>
                <Button
                  variant="danger"
                  onClick={() => resolveChallenge("challenge")}
                >
                  Challenge
                </Button>
              </>
            )}
            {/* Skip/Resign moved to Board actions for better UX */}
          </div>
        )}
      </div>
    </Box>
  );
}
