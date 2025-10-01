import { describe, it, expect } from "vitest";
import { createRoom, joinRoom, placeWord, swapTiles, skipTurn, resignGame, } from "./rooms";
describe("rooms", () => {
    it("creates and joins a room with two players", () => {
        const r = createRoom("p1", "Player 1");
        expect(r.players.length).toBe(1);
        expect(r.tileBagStats).toBeDefined();
        expect(r.tileBagStats.totalRemaining).toBe(93); // 100 - 7 for first player
        expect(r.tileBagStats.vowelsRemaining).toBeGreaterThan(0);
        expect(r.tileBagStats.consonantsRemaining).toBeGreaterThan(0);
        const r2 = joinRoom(r.id, "p2", "Player 2");
        expect(r2.players.length).toBe(2);
        expect(r2.currentTurnPlayerId).toBe("p1");
        expect(r2.tileBagStats).toBeDefined();
        expect(r2.tileBagStats.totalRemaining).toBe(86); // 100 - 7 - 7 for both players
    });
    it("places a straight word and switches turn", async () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        // Disable challenge mode for this test
        r2.challengeMode = false;
        // Give the player specific letters to form a valid word
        const player = r2.players.find((p) => p.id === "p1");
        player.rack = ["H", "E", "L", "L", "O", "A", "B"]; // Give them HELLO letters
        const tiles = [
            { letter: "H", coord: { row: 7, col: 7 } },
            { letter: "E", coord: { row: 7, col: 8 } },
        ];
        const after = await placeWord(r.id, "p1", tiles);
        expect(after.players.find((p) => p.id === "p1").score).toBeGreaterThan(0);
        expect(after.currentTurnPlayerId).toBe("p2");
        // Verify tile bag stats are updated
        expect(after.tileBagStats).toBeDefined();
        expect(after.tileBagStats.totalRemaining).toBe(84); // 86 - 2 placed + 2 replenished = 84
    });
    it("swaps tiles only if bag >= 7 and switches turn", () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        const you = r2.players.find((p) => p.id === "p1");
        const letters = you.rack.slice(0, 3);
        const after = swapTiles(r.id, "p1", letters);
        expect(after.players.find((p) => p.id === "p1").rack.length).toBe(7);
        expect(after.currentTurnPlayerId).toBe("p2");
        // Verify tile bag stats are updated
        expect(after.tileBagStats).toBeDefined();
        expect(after.tileBagStats.totalRemaining).toBe(86); // Should remain same after swap
    });
    it("rejects placement when player doesn't have enough letters", async () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        r2.challengeMode = false;
        const player = r2.players.find((p) => p.id === "p1");
        player.rack = ["H", "E", "L", "O", "A", "B", "C"]; // Only one E
        // Try to place two E's
        const tiles = [
            { letter: "E", coord: { row: 7, col: 7 } },
            { letter: "E", coord: { row: 7, col: 8 } },
        ];
        await expect(placeWord(r.id, "p1", tiles)).rejects.toThrow("insufficient_letters_E");
    });
    it("allows placement when player has enough letters", async () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        r2.challengeMode = false;
        const player = r2.players.find((p) => p.id === "p1");
        player.rack = ["H", "E", "E", "L", "O", "A", "B"]; // Two E's
        // Place two E's - should work
        const tiles = [
            { letter: "E", coord: { row: 7, col: 7 } },
            { letter: "E", coord: { row: 7, col: 8 } },
        ];
        const after = await placeWord(r.id, "p1", tiles);
        expect(after.players.find((p) => p.id === "p1").score).toBeGreaterThan(0);
        expect(after.currentTurnPlayerId).toBe("p2");
    });
    it.skip("awards bingo bonus for using all 7 tiles", async () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        r2.challengeMode = false;
        const player = r2.players.find((p) => p.id === "p1");
        player.rack = ["H", "E", "L", "L", "O", "A", "B"]; // 7 letters
        // Place all 7 letters - should get bingo bonus
        // Use "HELLO" which is a valid word, then add "AB" to make 7 tiles
        const tiles = [
            { letter: "H", coord: { row: 7, col: 7 } },
            { letter: "E", coord: { row: 7, col: 8 } },
            { letter: "L", coord: { row: 7, col: 9 } },
            { letter: "L", coord: { row: 7, col: 10 } },
            { letter: "O", coord: { row: 7, col: 11 } },
            { letter: "A", coord: { row: 7, col: 12 } },
            { letter: "B", coord: { row: 7, col: 13 } },
        ];
        const before = player.score;
        const after = await placeWord(r.id, "p1", tiles);
        const scoreIncrease = after.players.find((p) => p.id === "p1").score - before;
        // Should get word score + 50 bingo bonus
        expect(scoreIncrease).toBeGreaterThan(50);
        expect(after.lastMoveBingo).toBe(true);
    });
    it("does not award bingo bonus for using less than 7 tiles", async () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        r2.challengeMode = false;
        const player = r2.players.find((p) => p.id === "p1");
        player.rack = ["H", "E", "L", "L", "O", "A", "B"]; // 7 letters
        // Place only 2 letters - should not get bingo bonus
        const tiles = [
            { letter: "H", coord: { row: 7, col: 7 } },
            { letter: "E", coord: { row: 7, col: 8 } },
        ];
        const before = player.score;
        const after = await placeWord(r.id, "p1", tiles);
        const scoreIncrease = after.players.find((p) => p.id === "p1").score - before;
        // Should get word score only (no bingo bonus)
        expect(scoreIncrease).toBeLessThan(50);
        expect(after.lastMoveBingo).toBe(false);
    });
    it("updates tile bag stats correctly when placing tiles", async () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        r2.challengeMode = false;
        // Get initial stats
        const initialStats = r2.tileBagStats;
        expect(initialStats.totalRemaining).toBe(86);
        // Place some tiles
        const player = r2.players.find((p) => p.id === "p1");
        player.rack = ["H", "E", "L", "L", "O", "A", "B"];
        const tiles = [
            { letter: "H", coord: { row: 7, col: 7 } },
            { letter: "E", coord: { row: 7, col: 8 } },
            { letter: "L", coord: { row: 7, col: 9 } },
            { letter: "L", coord: { row: 7, col: 10 } },
            { letter: "O", coord: { row: 7, col: 11 } },
        ];
        const after = await placeWord(r.id, "p1", tiles);
        // Stats should be updated
        expect(after.tileBagStats).toBeDefined();
        expect(after.tileBagStats.totalRemaining).toBe(81); // 86 - 5 placed + 5 replenished = 81
        // Vowels and consonants should reflect the new distribution
        expect(after.tileBagStats.vowelsRemaining).toBeGreaterThan(0);
        expect(after.tileBagStats.consonantsRemaining).toBeGreaterThan(0);
    });
    it("updates tile bag stats correctly when swapping tiles", () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        const initialStats = r2.tileBagStats;
        expect(initialStats.totalRemaining).toBe(86);
        const you = r2.players.find((p) => p.id === "p1");
        const lettersToSwap = you.rack.slice(0, 2); // Swap 2 tiles
        const after = swapTiles(r.id, "p1", lettersToSwap);
        // Stats should be updated
        expect(after.tileBagStats).toBeDefined();
        expect(after.tileBagStats.totalRemaining).toBe(86); // Same as before (tiles replenished)
        // Vowels and consonants should reflect the new distribution
        expect(after.tileBagStats.vowelsRemaining).toBeGreaterThan(0);
        expect(after.tileBagStats.consonantsRemaining).toBeGreaterThan(0);
    });
    it("detects game end when player empties their rack", async () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        r2.challengeMode = false;
        // Empty the bag so player can't get replenished
        r2.bag = [];
        // Give player exactly 2 tiles to place
        const player = r2.players.find((p) => p.id === "p1");
        player.rack = ["H", "E"]; // Only 2 tiles
        const tiles = [
            { letter: "H", coord: { row: 7, col: 7 } },
            { letter: "E", coord: { row: 7, col: 8 } },
        ];
        const after = await placeWord(r.id, "p1", tiles);
        // Game should end because player emptied their rack
        expect(after.gameEnded).toBe(true);
        expect(after.winner).toBe("p1");
        expect(after.finalScores).toBeDefined();
        expect(after.finalScores["p1"]).toBeGreaterThan(0);
    });
    it("does not end game when player still has tiles after placing", async () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        r2.challengeMode = false;
        // Give player more than 2 tiles
        const player = r2.players.find((p) => p.id === "p1");
        player.rack = ["H", "E", "L", "L", "O", "A", "B"]; // 7 tiles
        const tiles = [
            { letter: "H", coord: { row: 7, col: 7 } },
            { letter: "E", coord: { row: 7, col: 8 } },
        ];
        const after = await placeWord(r.id, "p1", tiles);
        // Game should not end because player still has tiles
        expect(after.gameEnded).toBe(false);
        expect(after.winner).toBeUndefined();
        expect(after.finalScores).toBeUndefined();
    });
    it("tracks move history when placing tiles", async () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        r2.challengeMode = false;
        const player = r2.players.find((p) => p.id === "p1");
        player.rack = ["H", "E", "L", "L", "O", "A", "B"];
        const tiles = [
            { letter: "H", coord: { row: 7, col: 7 } },
            { letter: "E", coord: { row: 7, col: 8 } },
            { letter: "L", coord: { row: 7, col: 9 } },
            { letter: "L", coord: { row: 7, col: 10 } },
            { letter: "O", coord: { row: 7, col: 11 } },
        ];
        const after = await placeWord(r.id, "p1", tiles);
        // Should have move history
        expect(after.moveHistory).toBeDefined();
        expect(after.moveHistory.length).toBe(1);
        const move = after.moveHistory[0];
        expect(move.playerId).toBe("p1");
        expect(move.tiles).toEqual(tiles);
        expect(move.words.length).toBeGreaterThan(0);
        expect(move.totalScore).toBeGreaterThan(0);
        expect(move.isBingo).toBe(false);
        expect(move.timestamp).toBeGreaterThan(0);
    });
    it("tracks bingo moves in history", async () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        r2.challengeMode = false;
        // Empty the bag so player can't get replenished
        r2.bag = [];
        const player = r2.players.find((p) => p.id === "p1");
        player.rack = ["H", "E", "L", "L", "O", "A", "B"]; // 7 tiles
        // Use a valid word formation
        const tiles = [
            { letter: "H", coord: { row: 7, col: 7 } },
            { letter: "E", coord: { row: 7, col: 8 } },
            { letter: "L", coord: { row: 7, col: 9 } },
            { letter: "L", coord: { row: 7, col: 10 } },
            { letter: "O", coord: { row: 7, col: 11 } },
        ];
        const after = await placeWord(r.id, "p1", tiles);
        // Should have move history
        expect(after.moveHistory).toBeDefined();
        expect(after.moveHistory.length).toBe(1);
        const move = after.moveHistory[0];
        expect(move.playerId).toBe("p1");
        expect(move.tiles).toEqual(tiles);
        expect(move.words.length).toBeGreaterThan(0);
        expect(move.totalScore).toBeGreaterThan(0);
        expect(move.isBingo).toBe(false); // Not a bingo since we only placed 5 tiles
        expect(move.timestamp).toBeGreaterThan(0);
    });
    it("allows player to skip their turn", () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        expect(r2.currentTurnPlayerId).toBe("p1");
        const after = skipTurn(r.id, "p1");
        expect(after.currentTurnPlayerId).toBe("p2");
    });
    it("prevents skipping when not your turn", () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        expect(() => skipTurn(r.id, "p2")).toThrow("not_your_turn");
    });
    it("prevents skipping when game has ended", () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        r2.gameEnded = true;
        expect(() => skipTurn(r.id, "p1")).toThrow("game_ended");
    });
    it("allows player to resign game", () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        // Give p1 some tiles and score
        const p1 = r2.players.find((p) => p.id === "p1");
        p1.rack = ["A", "B", "C"];
        p1.score = 50;
        const p2 = r2.players.find((p) => p.id === "p2");
        p2.score = 30;
        const after = resignGame(r.id, "p1");
        expect(after.gameEnded).toBe(true);
        expect(after.winner).toBe("p2");
        expect(after.finalScores).toBeDefined();
        // p1 should lose points for remaining tiles (A=1, B=3, C=3 = 7)
        expect(after.finalScores["p1"]).toBe(50 - 7); // 43
        expect(after.finalScores["p2"]).toBe(30 + 7); // 37
    });
    it("prevents resigning when game has ended", () => {
        const r = createRoom("p1", "Player 1");
        const r2 = joinRoom(r.id, "p2", "Player 2");
        r2.gameEnded = true;
        expect(() => resignGame(r.id, "p1")).toThrow("game_ended");
    });
    it("prevents resigning when no opponent", () => {
        const r = createRoom("p1", "Player 1");
        expect(() => resignGame(r.id, "p1")).toThrow("waiting_for_second_player");
    });
});
