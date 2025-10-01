import { createEmptyBoard, createEnglishBag, dealToSeven, scoreSimple, validateAndScoreAllWords, calculateTileBagStats, checkGameEnd, initializePlayerTimer, updatePlayerTimer, checkTimerForfeit, validateTilePlacement, validateWordFormation, } from "./logic";
import { isValidWordAsync, getWordDefinitionAsync } from "./dictionary";
const rooms = new Map();
export function getRoom(roomId) {
    return rooms.get(roomId);
}
function updateTileBagStats(room) {
    room.tileBagStats = calculateTileBagStats(room);
}
function startPlayerTimer(room, playerId) {
    if (!room.timerActive || !room.timeLimit)
        return;
    room.currentPlayerStartTime = Date.now();
}
function endPlayerTimer(room, playerId) {
    if (!room.timerActive || !room.timeLimit || !room.currentPlayerStartTime)
        return;
    const player = room.players.find((p) => p.id === playerId);
    if (!player)
        return;
    const timeElapsed = Date.now() - room.currentPlayerStartTime;
    const enteredOvertime = updatePlayerTimer(player, timeElapsed);
    // Check for forfeit due to overtime
    if (checkTimerForfeit(player)) {
        // Player forfeits due to overtime
        const otherPlayer = room.players.find((p) => p.id !== playerId);
        if (otherPlayer) {
            room.gameEnded = true;
            room.winner = otherPlayer.id;
            room.finalScores = {
                [playerId]: player.score - player.timePenalty,
                [otherPlayer.id]: otherPlayer.score,
            };
        }
    }
    room.currentPlayerStartTime = undefined;
}
function checkTimerForfeits(room) {
    if (!room.timerActive)
        return;
    for (const player of room.players) {
        if (checkTimerForfeit(player)) {
            const otherPlayer = room.players.find((p) => p.id !== player.id);
            if (otherPlayer) {
                room.gameEnded = true;
                room.winner = otherPlayer.id;
                room.finalScores = {
                    [player.id]: player.score - player.timePenalty,
                    [otherPlayer.id]: otherPlayer.score,
                };
                break;
            }
        }
    }
}
function checkAndHandleGameEnd(room) {
    const gameEndResult = checkGameEnd(room);
    if (gameEndResult.gameEnded) {
        room.gameEnded = true;
        room.winner = gameEndResult.winner;
        room.finalScores = gameEndResult.finalScores;
        // Update player scores with final scores
        if (gameEndResult.finalScores) {
            for (const player of room.players) {
                player.score = gameEndResult.finalScores[player.id] || player.score;
            }
        }
    }
}
async function addMoveToHistory(room, playerId, tiles, validationResult, isBingo) {
    if (!room.moveHistory) {
        room.moveHistory = [];
    }
    // Get definitions for all words in the move
    const wordDefinitions = {};
    for (const wordResult of validationResult.words) {
        if (wordResult.valid) {
            const definition = await getWordDefinitionAsync(wordResult.word);
            if (definition) {
                wordDefinitions[wordResult.word] = definition;
            }
        }
    }
    const move = {
        id: Math.random().toString(36).slice(2, 8),
        playerId,
        tiles,
        words: validationResult.words,
        totalScore: validationResult.totalScore,
        isBingo,
        timestamp: Date.now(),
        wordDefinitions,
    };
    // Add to beginning of history (most recent first)
    room.moveHistory.unshift(move);
}
export function createRoom(ownerId, ownerName, timeLimit) {
    const id = Math.random().toString(36).slice(2, 8).toUpperCase();
    const room = {
        id,
        players: [
            {
                id: ownerId,
                name: ownerName,
                rack: [],
                score: 0,
                timeRemaining: timeLimit || 0,
                timePenalty: 0,
                isInOvertime: false,
            },
        ],
        board: createEmptyBoard(),
        bag: createEnglishBag(),
        currentTurnPlayerId: ownerId,
        createdAt: Date.now(),
        challengeMode: true,
        challengeRule: "turn",
        gameEnded: false,
        moveHistory: [],
        timeLimit,
        timerActive: !!timeLimit,
    };
    if (timeLimit) {
        initializePlayerTimer(room.players[0], timeLimit);
    }
    dealToSeven(room.players[0], room);
    updateTileBagStats(room);
    rooms.set(id, room);
    return room;
}
export function joinRoom(roomId, playerId, playerName) {
    const room = rooms.get(roomId);
    if (!room)
        throw new Error("room_not_found");
    if (room.players.find((p) => p.id === playerId))
        return room;
    if (room.players.length >= 2)
        throw new Error("room_full");
    const player = {
        id: playerId,
        name: playerName,
        rack: [],
        score: 0,
        timeRemaining: room.timeLimit || 0,
        timePenalty: 0,
        isInOvertime: false,
    };
    if (room.timeLimit) {
        initializePlayerTimer(player, room.timeLimit);
    }
    dealToSeven(player, room);
    room.players.push(player);
    updateTileBagStats(room);
    return room;
}
export function getPlayer(room, playerId) {
    const p = room.players.find((p) => p.id === playerId);
    if (!p)
        throw new Error("player_not_in_room");
    return p;
}
export async function placeWord(roomId, playerId, tiles) {
    const room = rooms.get(roomId);
    if (!room)
        throw new Error("room_not_found");
    if (room.players.length < 2)
        throw new Error("waiting_for_second_player");
    if (room.currentTurnPlayerId !== playerId)
        throw new Error("not_your_turn");
    // Check if this is the first move
    const isFirstMove = room.board.every((row) => row.every((cell) => cell.letter === null));
    // Validate tile placement
    const placementValidation = validateTilePlacement(tiles, room.board, isFirstMove);
    if (!placementValidation.valid) {
        throw new Error(placementValidation.error);
    }
    // Validate word formation
    const wordFormationValidation = validateWordFormation(tiles, room.board, isFirstMove);
    if (!wordFormationValidation.valid) {
        throw new Error(wordFormationValidation.error);
    }
    const player = getPlayer(room, playerId);
    // End timer for current player
    endPlayerTimer(room, playerId);
    // Check for timer forfeits
    checkTimerForfeits(room);
    if (room.gameEnded)
        return room;
    // Verify player has letters - count required letters
    const requiredLetters = new Map();
    for (const t of tiles) {
        const letter = t.letter;
        requiredLetters.set(letter, (requiredLetters.get(letter) || 0) + 1);
    }
    // Check if player has enough of each letter
    const rackCopy = [...player.rack];
    for (const [letter, count] of requiredLetters) {
        let remaining = count;
        // First try to use actual letters
        for (let i = 0; i < rackCopy.length && remaining > 0; i++) {
            if (rackCopy[i] === letter) {
                rackCopy.splice(i, 1);
                remaining--;
                i--; // Adjust index since we removed an element
            }
        }
        // If still need letters, try to use blanks
        for (let i = 0; i < rackCopy.length && remaining > 0; i++) {
            if (rackCopy[i] === "_") {
                rackCopy.splice(i, 1);
                remaining--;
                i--; // Adjust index since we removed an element
            }
        }
        // If still need letters, player doesn't have enough
        if (remaining > 0) {
            throw new Error(`insufficient_letters_${letter}`);
        }
    }
    // Place on board
    for (const t of tiles) {
        room.board[t.coord.row][t.coord.col].letter = t.letter;
    }
    // Validate and score all words formed by this placement
    const validationResult = await validateAndScoreAllWords(tiles, room.board, isValidWordAsync);
    if (!validationResult.valid) {
        // Rollback: remove placed tiles
        for (const t of tiles) {
            room.board[t.coord.row][t.coord.col].letter = null;
        }
        throw new Error("invalid_words_formed");
    }
    // Check for bingo bonus (using all 7 tiles)
    const isBingo = tiles.length === 7;
    const bingoBonus = isBingo ? 50 : 0;
    const totalScore = validationResult.totalScore + bingoBonus;
    if (!room.challengeMode) {
        player.score += totalScore;
        room.lastMoveBingo = isBingo;
        // Add move to history
        await addMoveToHistory(room, playerId, tiles, validationResult, isBingo);
    }
    // Use the first word as primary word for challenge mode
    const primaryWord = validationResult.words[0]?.word || tiles.map((t) => t.letter).join("");
    // Update rack and deal
    player.rack = rackCopy;
    dealToSeven(player, room);
    updateTileBagStats(room);
    // Check for game end after placing tiles
    checkAndHandleGameEnd(room);
    if (room.challengeMode) {
        // Hold as pending until resolved
        room.pendingMove = {
            byPlayerId: playerId,
            tiles,
            previousRack: [],
            previousScore: 0,
            primaryWord,
        };
        // Opponent must accept or challenge. Turn stays with opponent to decide.
        const other = room.players.find((p) => p.id !== playerId);
        room.currentTurnPlayerId = other?.id;
    }
    else {
        // Switch turn if two players
        if (room.players.length === 2) {
            const other = room.players.find((p) => p.id !== playerId);
            room.currentTurnPlayerId = other?.id;
            // Start timer for next player
            if (other) {
                startPlayerTimer(room, other.id);
            }
        }
    }
    return room;
}
export function swapTiles(roomId, playerId, letters) {
    const room = rooms.get(roomId);
    if (!room)
        throw new Error("room_not_found");
    if (room.players.length < 2)
        throw new Error("waiting_for_second_player");
    if (room.currentTurnPlayerId !== playerId)
        throw new Error("not_your_turn");
    if (room.bag.length < 7)
        throw new Error("cannot_swap_when_bag_below_7");
    if (!letters.length)
        throw new Error("no_letters_to_swap");
    // End timer for current player
    endPlayerTimer(room, playerId);
    // Check for timer forfeits
    checkTimerForfeits(room);
    if (room.gameEnded)
        return room;
    const player = getPlayer(room, playerId);
    const rackCopy = [...player.rack];
    for (const l of letters) {
        const idx = rackCopy.indexOf(l);
        if (idx === -1)
            throw new Error("missing_letter");
        rackCopy.splice(idx, 1);
    }
    // put letters back and draw same amount
    for (const l of letters)
        room.bag.unshift(l);
    // draw
    for (let i = 0; i < letters.length && room.bag.length; i++) {
        rackCopy.push(room.bag.pop());
    }
    player.rack = rackCopy;
    updateTileBagStats(room);
    // switch turn to opponent if two players
    if (room.players.length === 2) {
        const other = room.players.find((p) => p.id !== playerId);
        room.currentTurnPlayerId = other?.id;
        // Start timer for next player
        if (other) {
            startPlayerTimer(room, other.id);
        }
    }
    return room;
}
export async function resolveChallenge(roomId, playerId, action) {
    const room = rooms.get(roomId);
    if (!room)
        throw new Error("room_not_found");
    if (!room.challengeMode)
        throw new Error("challenge_disabled");
    if (!room.pendingMove)
        throw new Error("no_pending_move");
    // Only opponent can resolve
    const pendingBy = room.pendingMove.byPlayerId;
    if (pendingBy === playerId)
        throw new Error("cannot_resolve_own_move");
    const mover = room.players.find((p) => p.id === pendingBy);
    // Validate all words formed by the pending move
    const validationResult = await validateAndScoreAllWords(room.pendingMove.tiles, room.board, isValidWordAsync);
    // Check for bingo bonus (using all 7 tiles)
    const isBingo = room.pendingMove.tiles.length === 7;
    const bingoBonus = isBingo ? 50 : 0;
    const totalScore = validationResult.totalScore + bingoBonus;
    if (action === "accept") {
        if (!validationResult.valid) {
            // invalid word accepted? treat as challenge that succeeds for opponent
            // rollback: remove placed tiles and restore rack would be needed; for simplicity, zero score change (already applied none in challengeMode) and just clear tiles from board
            for (const t of room.pendingMove.tiles) {
                room.board[t.coord.row][t.coord.col].letter = null;
            }
            room.pendingMove = undefined;
            // turn goes back to mover (penalty could be applied in advanced rules)
            room.currentTurnPlayerId = mover.id;
            return room;
        }
        // valid: award points and keep tiles
        mover.score += totalScore;
        room.lastMoveBingo = isBingo;
        // Add move to history
        await addMoveToHistory(room, pendingBy, room.pendingMove.tiles, validationResult, isBingo);
        room.pendingMove = undefined;
        updateTileBagStats(room);
        checkAndHandleGameEnd(room);
        // switch turn to opponent already set
        return room;
    }
    else {
        // challenge
        if (validationResult.valid) {
            // failed challenge: challenger loses turn (double challenge rule), mover keeps board and gets points
            mover.score += totalScore;
            room.lastMoveBingo = isBingo;
            // Add move to history
            await addMoveToHistory(room, pendingBy, room.pendingMove.tiles, validationResult, isBingo);
            room.pendingMove = undefined;
            updateTileBagStats(room);
            checkAndHandleGameEnd(room);
            // turn stays with mover (challenger loses turn)
            room.currentTurnPlayerId = mover.id;
            return room;
        }
        else {
            // successful challenge: remove tiles and revert rack (simplified: do not revert rack draw here to keep flow simple)
            for (const t of room.pendingMove.tiles) {
                room.board[t.coord.row][t.coord.col].letter = null;
            }
            room.pendingMove = undefined;
            updateTileBagStats(room);
            // mover loses turn, opponent continues
            room.currentTurnPlayerId = playerId;
            return room;
        }
    }
}
export function skipTurn(roomId, playerId) {
    const room = rooms.get(roomId);
    if (!room)
        throw new Error("room_not_found");
    if (room.players.length < 2)
        throw new Error("waiting_for_second_player");
    if (room.currentTurnPlayerId !== playerId)
        throw new Error("not_your_turn");
    if (room.gameEnded)
        throw new Error("game_ended");
    // Switch turn to opponent if two players
    if (room.players.length === 2) {
        const other = room.players.find((p) => p.id !== playerId);
        room.currentTurnPlayerId = other?.id;
    }
    return room;
}
export function resignGame(roomId, playerId) {
    const room = rooms.get(roomId);
    if (!room)
        throw new Error("room_not_found");
    if (room.players.length < 2)
        throw new Error("waiting_for_second_player");
    if (room.gameEnded)
        throw new Error("game_ended");
    // Find the other player (winner)
    const otherPlayer = room.players.find((p) => p.id !== playerId);
    if (!otherPlayer)
        throw new Error("no_opponent");
    // End the game with the other player as winner
    room.gameEnded = true;
    room.winner = otherPlayer.id;
    // Calculate final scores (resigning player loses points for remaining tiles)
    const resigningPlayer = room.players.find((p) => p.id === playerId);
    const remainingValue = scoreSimple(resigningPlayer.rack);
    room.finalScores = {
        [playerId]: resigningPlayer.score - remainingValue,
        [otherPlayer.id]: otherPlayer.score + remainingValue,
    };
    // Update player scores
    resigningPlayer.score = room.finalScores[playerId];
    otherPlayer.score = room.finalScores[otherPlayer.id];
    return room;
}
