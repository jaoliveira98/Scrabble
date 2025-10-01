import { useEffect, useRef, useState } from "react";
import { useApp } from "../../store";
import { Box, Button, Input, Paragraph } from "../ui";

export function Controls() {
  const { connect, createRoom, joinRoom, room, you } = useApp();
  const [joinId, setJoinId] = useState("");
  const [joinPlayerName, setJoinPlayerName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const createNameRef = useRef<HTMLInputElement | null>(null);
  const joinNameRef = useRef<HTMLInputElement | null>(null);

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

  // Don't show controls if game has ended
  if (room?.gameEnded) {
    return (
      <div className="flex items-center gap-3 mb-4">
        <Paragraph variant="warning" size="lg" className="font-semibold">
          Game Ended - Check Final Scores Below
        </Paragraph>
      </div>
    );
  }

  return (
    <Box variant="card" className="flex flex-col gap-3">
      {/* Tabs */}
      <div className="flex gap-3">
        <Button
          variant={activeTab === "create" ? "primary" : "secondary"}
          onClick={() => setActiveTab("create")}
        >
          Create Room
        </Button>
        <Button
          variant={activeTab === "join" ? "primary" : "secondary"}
          onClick={() => setActiveTab("join")}
        >
          Join Room
        </Button>
      </div>

      {activeTab === "create" && (
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Enter your username"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            ref={createNameRef}
          />
          <Button
            variant="success"
            size="md"
            onClick={() => createRoom(playerName)}
            disabled={!playerName.trim()}
          >
            Create Room
          </Button>
        </div>
      )}

      {activeTab === "join" && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Input
              variant={!joinPlayerName.trim() ? "error" : "default"}
              placeholder="Enter your username"
              value={joinPlayerName}
              onChange={(e) => setJoinPlayerName(e.target.value)}
              ref={joinNameRef}
            />
            <Input
              placeholder="Enter the room ID"
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

      {room && you && (
        <div className="flex gap-3">
          <Paragraph>
            Room: <span className="font-bold">{room.id}</span>
          </Paragraph>
          <Paragraph>
            Player: <span className="font-bold">{you.name}</span>
          </Paragraph>
        </div>
      )}

      {/* Skip/Resign and Accept/Challenge moved to Board actions for better UX */}
    </Box>
  );
}
