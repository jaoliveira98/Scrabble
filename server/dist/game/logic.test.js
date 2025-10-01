import { describe, it, expect } from "vitest";
import { createEmptyBoard, createEnglishBag, letterPoints, scoreSimple, calculateTileBagStats, checkGameEnd, initializePlayerTimer, updatePlayerTimer, checkTimerForfeit, formatTimeRemaining, validateTilePlacement, validateWordFormation, extractAllWords, } from "./logic";
describe("logic", () => {
    it("creates a 15x15 empty board", () => {
        const b = createEmptyBoard();
        expect(b.length).toBe(15);
        expect(b[0].length).toBe(15);
        expect(b[0][0].letter).toBeNull();
    });
    it("creates a bag with 100 tiles", () => {
        const bag = createEnglishBag();
        expect(bag.length).toBe(100);
    });
    it("scores letters correctly", () => {
        expect(letterPoints("A")).toBe(1);
        expect(letterPoints("Z")).toBe(10);
        expect(letterPoints("_")).toBe(0);
        expect(scoreSimple(["C", "A", "T"])).toBe(5);
    });
    describe("calculateTileBagStats", () => {
        it("calculates stats for empty room", () => {
            const room = {
                id: "test",
                players: [],
                board: createEmptyBoard(),
                bag: ["A", "E", "I", "O", "U", "B", "C", "D"],
                currentTurnPlayerId: undefined,
                createdAt: Date.now(),
            };
            const stats = calculateTileBagStats(room);
            expect(stats.totalRemaining).toBe(8);
            expect(stats.vowelsRemaining).toBe(5); // A, E, I, O, U
            expect(stats.consonantsRemaining).toBe(3); // B, C, D
        });
        it("calculates stats with players having tiles", () => {
            const room = {
                id: "test",
                players: [
                    {
                        id: "p1",
                        name: "Player 1",
                        rack: ["A", "E", "B"],
                        score: 0,
                        timeRemaining: 0,
                        timePenalty: 0,
                        isInOvertime: false,
                    },
                    {
                        id: "p2",
                        name: "Player 2",
                        rack: ["I", "O", "C"],
                        score: 0,
                        timeRemaining: 0,
                        timePenalty: 0,
                        isInOvertime: false,
                    },
                ],
                board: createEmptyBoard(),
                bag: ["U", "D", "F"],
                currentTurnPlayerId: "p1",
                createdAt: Date.now(),
            };
            const stats = calculateTileBagStats(room);
            expect(stats.totalRemaining).toBe(3); // Only bag tiles
            expect(stats.vowelsRemaining).toBe(5); // A, E, I, O, U
            expect(stats.consonantsRemaining).toBe(4); // B, C, D, F
        });
        it("calculates stats with tiles on board", () => {
            const board = createEmptyBoard();
            board[7][7].letter = "H";
            board[7][8].letter = "E";
            board[7][9].letter = "L";
            board[7][10].letter = "L";
            board[7][11].letter = "O";
            const room = {
                id: "test",
                players: [
                    {
                        id: "p1",
                        name: "Player 1",
                        rack: ["A", "B"],
                        score: 0,
                        timeRemaining: 0,
                        timePenalty: 0,
                        isInOvertime: false,
                    },
                ],
                board,
                bag: ["C", "D", "E", "F"],
                currentTurnPlayerId: "p1",
                createdAt: Date.now(),
            };
            const stats = calculateTileBagStats(room);
            expect(stats.totalRemaining).toBe(4); // Only bag tiles
            expect(stats.vowelsRemaining).toBe(4); // A, E, O, E
            expect(stats.consonantsRemaining).toBe(7); // B, C, D, F, H, L, L
        });
        it("handles blank tiles correctly", () => {
            const room = {
                id: "test",
                players: [
                    {
                        id: "p1",
                        name: "Player 1",
                        rack: ["A", "_", "B"],
                        score: 0,
                        timeRemaining: 0,
                        timePenalty: 0,
                        isInOvertime: false,
                    },
                ],
                board: createEmptyBoard(),
                bag: ["C", "_", "D"],
                currentTurnPlayerId: "p1",
                createdAt: Date.now(),
            };
            const stats = calculateTileBagStats(room);
            expect(stats.totalRemaining).toBe(3); // Only bag tiles
            expect(stats.vowelsRemaining).toBe(1); // A only (blanks excluded)
            expect(stats.consonantsRemaining).toBe(3); // B, C, D (blanks excluded)
        });
        it("calculates stats for full game state", () => {
            const board = createEmptyBoard();
            // Place some tiles on board
            board[7][7].letter = "C";
            board[7][8].letter = "A";
            board[7][9].letter = "T";
            const room = {
                id: "test",
                players: [
                    {
                        id: "p1",
                        name: "Player 1",
                        rack: ["D", "O", "G"],
                        score: 10,
                        timeRemaining: 0,
                        timePenalty: 0,
                        isInOvertime: false,
                    },
                    {
                        id: "p2",
                        name: "Player 2",
                        rack: ["H", "I", "T"],
                        score: 5,
                        timeRemaining: 0,
                        timePenalty: 0,
                        isInOvertime: false,
                    },
                ],
                board,
                bag: ["E", "F", "G", "H", "I", "J", "K", "L", "M", "N"],
                currentTurnPlayerId: "p1",
                createdAt: Date.now(),
            };
            const stats = calculateTileBagStats(room);
            expect(stats.totalRemaining).toBe(10); // Only bag tiles
            expect(stats.vowelsRemaining).toBe(5); // A, O, I, E, I
            expect(stats.consonantsRemaining).toBe(14); // C, T, D, G, H, T, E, F, G, H, I, J, K, L, M, N
        });
    });
    describe("checkGameEnd", () => {
        it("returns game not ended when players have tiles and bag has tiles", () => {
            const room = {
                id: "test",
                players: [
                    {
                        id: "p1",
                        name: "Player 1",
                        rack: ["A", "B", "C"],
                        score: 10,
                        timeRemaining: 0,
                        timePenalty: 0,
                        isInOvertime: false,
                    },
                    {
                        id: "p2",
                        name: "Player 2",
                        rack: ["D", "E", "F"],
                        score: 15,
                        timeRemaining: 0,
                        timePenalty: 0,
                        isInOvertime: false,
                    },
                ],
                board: createEmptyBoard(),
                bag: ["G", "H", "I", "J"],
                currentTurnPlayerId: "p1",
                createdAt: Date.now(),
            };
            const result = checkGameEnd(room);
            expect(result.gameEnded).toBe(false);
        });
        it("ends game when a player has empty rack", () => {
            const room = {
                id: "test",
                players: [
                    {
                        id: "p1",
                        name: "Player 1",
                        rack: [],
                        score: 20,
                        timeRemaining: 0,
                        timePenalty: 0,
                        isInOvertime: false,
                    },
                    {
                        id: "p2",
                        name: "Player 2",
                        rack: ["A", "B", "C"],
                        score: 15,
                        timeRemaining: 0,
                        timePenalty: 0,
                        isInOvertime: false,
                    },
                    {
                        id: "p2",
                        name: "Player 2",
                        rack: ["A", "B", "C"],
                        score: 15,
                        timeRemaining: 0,
                        timePenalty: 0,
                        isInOvertime: false,
                    },
                ],
                board: createEmptyBoard(),
                bag: ["D", "E", "F"],
                currentTurnPlayerId: "p1",
                createdAt: Date.now(),
            };
            const result = checkGameEnd(room);
            expect(result.gameEnded).toBe(true);
            expect(result.winner).toBe("p1");
            expect(result.finalScores).toBeDefined();
            expect(result.finalScores["p1"]).toBe(20 + 7); // Winner gets loser's tile values (A=1, B=3, C=3 = 7)
            expect(result.finalScores["p2"]).toBe(15 - 7); // Loser loses points for remaining tiles (A=1, B=3, C=3 = 7)
        });
        it("ends game when bag is empty", () => {
            const room = {
                id: "test",
                players: [
                    {
                        id: "p1",
                        name: "Player 1",
                        rack: ["A", "B"],
                        score: 20,
                        timePenalty: 0,
                        isInOvertime: false,
                        timeRemaining: 0,
                    },
                    {
                        id: "p2",
                        name: "Player 2",
                        rack: ["C", "D"],
                        score: 25,
                        timePenalty: 0,
                        isInOvertime: false,
                        timeRemaining: 0,
                    },
                ],
                board: createEmptyBoard(),
                bag: [], // Empty bag
                currentTurnPlayerId: "p1",
                createdAt: Date.now(),
            };
            const result = checkGameEnd(room);
            expect(result.gameEnded).toBe(true);
            expect(result.winner).toBe("p2"); // Player with highest score wins
            expect(result.finalScores).toBeDefined();
            expect(result.finalScores["p1"]).toBe(20);
            expect(result.finalScores["p2"]).toBe(25);
        });
        it("calculates final scores correctly when player empties rack", () => {
            const room = {
                id: "test",
                players: [
                    {
                        id: "p1",
                        name: "Player 1",
                        rack: [],
                        score: 30,
                        timePenalty: 0,
                        isInOvertime: false,
                        timeRemaining: 0,
                    }, // Winner with empty rack
                    {
                        id: "p2",
                        name: "Player 2",
                        rack: ["Q", "Z"],
                        score: 20,
                        timePenalty: 0,
                        isInOvertime: false,
                        timeRemaining: 0,
                    }, // Loser with high-value tiles
                ],
                board: createEmptyBoard(),
                bag: ["A", "B"],
                currentTurnPlayerId: "p1",
                createdAt: Date.now(),
            };
            const result = checkGameEnd(room);
            expect(result.gameEnded).toBe(true);
            expect(result.winner).toBe("p1");
            expect(result.finalScores["p1"]).toBe(30 + 20); // Winner gets loser's tile values (Q=10, Z=10 = 20)
            expect(result.finalScores["p2"]).toBe(20 - 20); // Loser loses their tile values
        });
        it("handles multiple players correctly", () => {
            const room = {
                id: "test",
                players: [
                    {
                        id: "p1",
                        name: "Player 1",
                        rack: [],
                        score: 25,
                        timePenalty: 0,
                        isInOvertime: false,
                        timeRemaining: 0,
                    }, // Winner
                    {
                        id: "p2",
                        name: "Player 2",
                        rack: ["A", "B"],
                        score: 20,
                        timePenalty: 0,
                        isInOvertime: false,
                        timeRemaining: 0,
                    }, // Loser 1
                    {
                        id: "p3",
                        name: "Player 3",
                        rack: ["C"],
                        score: 15,
                        timePenalty: 0,
                        isInOvertime: false,
                        timeRemaining: 0,
                    }, // Loser 2
                ],
                board: createEmptyBoard(),
                bag: ["D", "E"],
                currentTurnPlayerId: "p1",
                createdAt: Date.now(),
            };
            const result = checkGameEnd(room);
            expect(result.gameEnded).toBe(true);
            expect(result.winner).toBe("p1");
            expect(result.finalScores["p1"]).toBe(25 + 4 + 3); // Winner gets all losers' tile values (A=1, B=3, C=3 = 7)
            expect(result.finalScores["p2"]).toBe(20 - 4); // A=1, B=3 = 4
            expect(result.finalScores["p3"]).toBe(15 - 3); // C=3 = 3
        });
    });
    describe("timer functions", () => {
        it("initializes player timer correctly", () => {
            const player = {
                id: "p1",
                name: "Player 1",
                rack: [],
                score: 0,
                timeRemaining: 0,
                timePenalty: 0,
                isInOvertime: false,
            };
            const timeLimit = 180000; // 3 minutes
            initializePlayerTimer(player, timeLimit);
            expect(player.timeRemaining).toBe(180000);
            expect(player.timePenalty).toBe(0);
            expect(player.isInOvertime).toBe(false);
        });
        it("updates player timer correctly", () => {
            const player = {
                id: "p1",
                name: "Player 1",
                rack: [],
                score: 0,
                timeRemaining: 60000,
                timePenalty: 0,
                isInOvertime: false,
            };
            const enteredOvertime = updatePlayerTimer(player, 30000); // 30 seconds elapsed
            expect(player.timeRemaining).toBe(30000);
            expect(player.timePenalty).toBe(0);
            expect(player.isInOvertime).toBe(false);
            expect(enteredOvertime).toBe(false);
        });
        it("enters overtime when time runs out", () => {
            const player = {
                id: "p1",
                name: "Player 1",
                rack: [],
                score: 0,
                timeRemaining: 30000,
                timePenalty: 0,
                isInOvertime: false,
            };
            const enteredOvertime = updatePlayerTimer(player, 30000); // 30 seconds elapsed
            expect(player.timeRemaining).toBe(0);
            expect(player.timePenalty).toBe(10);
            expect(player.isInOvertime).toBe(true);
            expect(enteredOvertime).toBe(true);
        });
        it("adds penalty for overtime minutes", () => {
            const player = {
                id: "p1",
                name: "Player 1",
                rack: [],
                score: 0,
                timeRemaining: 0,
                timePenalty: 10,
                isInOvertime: true,
            };
            const enteredOvertime = updatePlayerTimer(player, 120000); // 2 minutes elapsed
            expect(player.timeRemaining).toBe(0);
            expect(player.timePenalty).toBe(30); // 10 + 2*10
            expect(player.isInOvertime).toBe(true);
            expect(enteredOvertime).toBe(false);
        });
        it("checks timer forfeit correctly", () => {
            const player1 = {
                id: "p1",
                name: "Player 1",
                rack: [],
                score: 0,
                timeRemaining: 0,
                timePenalty: 10,
                isInOvertime: true,
            };
            const player2 = {
                id: "p2",
                name: "Player 2",
                rack: [],
                score: 0,
                timeRemaining: -120000,
                timePenalty: 50,
                isInOvertime: true,
            }; // 2 minutes overtime
            // Player 1: just entered overtime (not forfeit yet)
            expect(checkTimerForfeit(player1)).toBe(false);
            // Player 2: been in overtime for more than 1 minute (forfeit)
            expect(checkTimerForfeit(player2)).toBe(true);
        });
        it("formats time remaining correctly", () => {
            expect(formatTimeRemaining(125000)).toBe("2:05"); // 2 minutes 5 seconds
            expect(formatTimeRemaining(60000)).toBe("1:00"); // 1 minute exactly
            expect(formatTimeRemaining(5000)).toBe("0:05"); // 5 seconds
            expect(formatTimeRemaining(0)).toBe("0:00"); // No time left
        });
    });
    describe("validation functions", () => {
        it("validates empty tile placement", () => {
            const board = createEmptyBoard();
            const result = validateTilePlacement([], board, true);
            expect(result.valid).toBe(false);
            expect(result.error).toBe("no_tiles_placed");
        });
        it("validates duplicate tile positions", () => {
            const board = createEmptyBoard();
            const tiles = [
                { letter: "A", coord: { row: 7, col: 7 } },
                { letter: "B", coord: { row: 7, col: 7 } }, // Duplicate position
            ];
            const result = validateTilePlacement(tiles, board, true);
            expect(result.valid).toBe(false);
            expect(result.error).toBe("duplicate_tile_positions");
        });
        it("validates out-of-bounds coordinates", () => {
            const board = createEmptyBoard();
            const tiles = [
                { letter: "A", coord: { row: 15, col: 7 } }, // Out of bounds
            ];
            const result = validateTilePlacement(tiles, board, true);
            expect(result.valid).toBe(false);
            expect(result.error).toBe("tile_out_of_bounds");
        });
        it("validates occupied cells", () => {
            const board = createEmptyBoard();
            board[7][7].letter = "C"; // Occupy center cell
            const tiles = [
                { letter: "A", coord: { row: 7, col: 7 } }, // Try to place on occupied cell
            ];
            const result = validateTilePlacement(tiles, board, true);
            expect(result.valid).toBe(false);
            expect(result.error).toBe("cell_already_occupied");
        });
        it("validates straight line placement", () => {
            const board = createEmptyBoard();
            const tiles = [
                { letter: "A", coord: { row: 7, col: 7 } },
                { letter: "B", coord: { row: 8, col: 8 } }, // Not in straight line
            ];
            const result = validateTilePlacement(tiles, board, true);
            expect(result.valid).toBe(false);
            expect(result.error).toBe("tiles_must_be_adjacent");
        });
        it("validates adjacent tiles in horizontal line", () => {
            const board = createEmptyBoard();
            const tiles = [
                { letter: "A", coord: { row: 7, col: 7 } },
                { letter: "B", coord: { row: 7, col: 9 } }, // Gap in line
            ];
            const result = validateTilePlacement(tiles, board, true);
            expect(result.valid).toBe(false);
            expect(result.error).toBe("tiles_must_be_adjacent");
        });
        it("validates adjacent tiles in vertical line", () => {
            const board = createEmptyBoard();
            const tiles = [
                { letter: "A", coord: { row: 7, col: 7 } },
                { letter: "B", coord: { row: 9, col: 7 } }, // Gap in line
            ];
            const result = validateTilePlacement(tiles, board, true);
            expect(result.valid).toBe(false);
            expect(result.error).toBe("tiles_must_be_adjacent");
        });
        it("validates first move touches center star", () => {
            const board = createEmptyBoard();
            const tiles = [
                { letter: "A", coord: { row: 6, col: 6 } }, // Not touching center
            ];
            const result = validateTilePlacement(tiles, board, true);
            expect(result.valid).toBe(false);
            expect(result.error).toBe("first_move_must_touch_center_star");
        });
        it("validates subsequent moves connect to existing tiles", () => {
            const board = createEmptyBoard();
            // Place a tile on the board
            board[7][7].letter = "C";
            const tiles = [
                { letter: "A", coord: { row: 5, col: 5 } }, // Not connected to existing
            ];
            const result = validateTilePlacement(tiles, board, false);
            expect(result.valid).toBe(false);
            expect(result.error).toBe("must_connect_to_existing_tiles");
        });
        it("validates word formation", () => {
            const board = createEmptyBoard();
            const tiles = [
                { letter: "A", coord: { row: 7, col: 7 } },
                { letter: "B", coord: { row: 7, col: 8 } },
            ];
            const result = validateWordFormation(tiles, board, true); // First move
            expect(result.valid).toBe(true);
        });
        it("validates connected tiles", () => {
            const board = createEmptyBoard();
            // Place some existing tiles
            board[7][7].letter = "C";
            board[7][8].letter = "A";
            board[7][9].letter = "T";
            const tiles = [
                { letter: "A", coord: { row: 5, col: 5 } }, // Disconnected from existing tiles
                { letter: "B", coord: { row: 5, col: 6 } },
            ];
            expect(() => extractAllWords(tiles, board, false)).toThrow("tiles_must_be_connected");
        });
        it("validates valid connected tiles", () => {
            const board = createEmptyBoard();
            // Place some existing tiles
            board[7][7].letter = "C";
            board[7][8].letter = "A";
            board[7][9].letter = "T";
            const tiles = [
                { letter: "A", coord: { row: 6, col: 7 } }, // Connected to existing
                { letter: "B", coord: { row: 6, col: 8 } },
            ];
            const words = extractAllWords(tiles, board);
            expect(words.length).toBeGreaterThan(0);
        });
    });
});
