import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { createRoom, getRoom, joinRoom, placeWord, swapTiles, resolveChallenge, skipTurn, resignGame, } from "./game/rooms";
const PORT = Number(process.env.PORT || 3001);
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (_req, res) => {
    res
        .type("text")
        .send("Scrabble server is running. Try GET /healthy or connect via WebSocket.");
});
app.get("/healthy", (_req, res) => {
    res.json({ ok: true });
});
const server = app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
});
const wss = new WebSocketServer({ server });
const clients = new Map();
function send(ws, data) {
    ws.send(JSON.stringify(data));
}
wss.on("connection", (ws) => {
    const clientId = Math.random().toString(36).slice(2);
    const client = { id: clientId, ws };
    clients.set(clientId, client);
    send(ws, { type: "connected", clientId });
    ws.on("message", async (raw) => {
        try {
            const msg = JSON.parse(String(raw));
            switch (msg.type) {
                case "ping":
                    send(ws, { type: "pong", t: Date.now() });
                    break;
                case "create_room": {
                    const room = createRoom(clientId, msg.playerName);
                    const you = room.players.find((p) => p.id === clientId);
                    send(ws, { type: "room_update", room, you });
                    break;
                }
                case "join_room": {
                    try {
                        const room = joinRoom(msg.roomId, clientId, msg.playerName);
                        const you = room.players.find((p) => p.id === clientId);
                        // notify both players
                        broadcastRoom(room.id);
                        send(ws, { type: "room_update", room, you });
                    }
                    catch (e) {
                        send(ws, { type: "error", error: e.message });
                    }
                    break;
                }
                case "place_word": {
                    try {
                        const room = await placeWord(msg.roomId, clientId, msg.tiles);
                        broadcastRoom(room.id);
                    }
                    catch (e) {
                        send(ws, { type: "error", error: e.message });
                    }
                    break;
                }
                case "swap_tiles": {
                    try {
                        const room = swapTiles(msg.roomId, clientId, msg.letters);
                        broadcastRoom(room.id);
                    }
                    catch (e) {
                        send(ws, { type: "error", error: e.message });
                    }
                    break;
                }
                case "resolve_challenge": {
                    try {
                        const room = await resolveChallenge(msg.roomId, clientId, msg.action);
                        broadcastRoom(room.id);
                    }
                    catch (e) {
                        send(ws, { type: "error", error: e.message });
                    }
                    break;
                }
                case "skip_turn": {
                    try {
                        const room = skipTurn(msg.roomId, clientId);
                        broadcastRoom(room.id);
                    }
                    catch (e) {
                        send(ws, { type: "error", error: e.message });
                    }
                    break;
                }
                case "resign_game": {
                    try {
                        const room = resignGame(msg.roomId, clientId);
                        broadcastRoom(room.id);
                    }
                    catch (e) {
                        send(ws, { type: "error", error: e.message });
                    }
                    break;
                }
                default:
                    send(ws, { type: "error", error: "unknown_message_type" });
            }
        }
        catch (err) {
            send(ws, { type: "error", error: "invalid_json" });
        }
    });
    ws.on("close", () => {
        clients.delete(clientId);
    });
});
function broadcastRoom(roomId) {
    const room = getRoom(roomId);
    if (!room)
        return;
    for (const client of clients.values()) {
        if (!room.players.find((p) => p.id === client.id))
            continue;
        const you = room.players.find((p) => p.id === client.id);
        send(client.ws, { type: "room_update", room, you });
    }
}
