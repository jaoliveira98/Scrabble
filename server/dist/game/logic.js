export const BOARD_SIZE = 15;
export function createEmptyBoard() {
    const board = Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => ({ letter: null })));
    // Add premium squares in correct Scrabble positions
    const premiumPositions = [
        // Triple Word Score (TW) - corners and center edges
        [0, 0, "TW"],
        [0, 7, "TW"],
        [0, 14, "TW"],
        [7, 0, "TW"],
        [7, 14, "TW"],
        [14, 0, "TW"],
        [14, 7, "TW"],
        [14, 14, "TW"],
        // Double Word Score (DW) - diagonal lines
        [1, 1, "DW"],
        [2, 2, "DW"],
        [3, 3, "DW"],
        [4, 4, "DW"],
        [10, 10, "DW"],
        [11, 11, "DW"],
        [12, 12, "DW"],
        [13, 13, "DW"],
        [1, 13, "DW"],
        [2, 12, "DW"],
        [3, 11, "DW"],
        [4, 10, "DW"],
        [10, 4, "DW"],
        [11, 3, "DW"],
        [12, 2, "DW"],
        [13, 1, "DW"],
        // Triple Letter Score (TL) - specific positions
        [1, 5, "TL"],
        [1, 9, "TL"],
        [5, 1, "TL"],
        [5, 5, "TL"],
        [5, 9, "TL"],
        [5, 13, "TL"],
        [9, 1, "TL"],
        [9, 5, "TL"],
        [9, 9, "TL"],
        [9, 13, "TL"],
        [13, 5, "TL"],
        [13, 9, "TL"],
        // Double Letter Score (DL) - specific positions
        [0, 3, "DL"],
        [0, 11, "DL"],
        [2, 6, "DL"],
        [2, 8, "DL"],
        [3, 0, "DL"],
        [3, 7, "DL"],
        [3, 14, "DL"],
        [6, 2, "DL"],
        [6, 6, "DL"],
        [6, 8, "DL"],
        [6, 12, "DL"],
        [7, 3, "DL"],
        [7, 11, "DL"],
        [8, 2, "DL"],
        [8, 6, "DL"],
        [8, 8, "DL"],
        [8, 12, "DL"],
        [11, 0, "DL"],
        [11, 7, "DL"],
        [11, 14, "DL"],
        [12, 6, "DL"],
        [12, 8, "DL"],
        [14, 3, "DL"],
        [14, 11, "DL"],
        // Center star (STAR)
        [7, 7, "STAR"],
    ];
    for (const [row, col, premium] of premiumPositions) {
        board[row][col].premium = premium;
    }
    return board;
}
export function createEnglishBag() {
    const entries = [
        ["A", 9],
        ["B", 2],
        ["C", 2],
        ["D", 4],
        ["E", 12],
        ["F", 2],
        ["G", 3],
        ["H", 2],
        ["I", 9],
        ["J", 1],
        ["K", 1],
        ["L", 4],
        ["M", 2],
        ["N", 6],
        ["O", 8],
        ["P", 2],
        ["Q", 1],
        ["R", 6],
        ["S", 4],
        ["T", 6],
        ["U", 4],
        ["V", 2],
        ["W", 2],
        ["X", 1],
        ["Y", 2],
        ["Z", 1],
        ["_", 2], // blanks
    ];
    const bag = [];
    for (const [letter, count] of entries) {
        for (let i = 0; i < count; i++)
            bag.push(letter);
    }
    shuffle(bag);
    return bag;
}
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
export function dealToSeven(player, room) {
    while (player.rack.length < 7 && room.bag.length > 0) {
        player.rack.push(room.bag.pop());
    }
}
export function letterPoints(letter) {
    const scores = {
        A: 1,
        B: 3,
        C: 3,
        D: 2,
        E: 1,
        F: 4,
        G: 2,
        H: 4,
        I: 1,
        J: 8,
        K: 5,
        L: 1,
        M: 3,
        N: 1,
        O: 1,
        P: 3,
        Q: 10,
        R: 1,
        S: 1,
        T: 1,
        U: 1,
        V: 4,
        W: 4,
        X: 8,
        Y: 4,
        Z: 10,
    };
    if (letter === "_")
        return 0;
    return scores[letter] ?? 0;
}
export function scoreSimple(letters) {
    return letters.reduce((sum, l) => sum + letterPoints(l), 0);
}
export function calculateTileBagStats(room) {
    const vowels = new Set(["A", "E", "I", "O", "U"]);
    const allTiles = [...room.bag];
    // Add tiles from all player racks
    for (const player of room.players) {
        allTiles.push(...player.rack);
    }
    // Add tiles from the board
    for (const row of room.board) {
        for (const cell of row) {
            if (cell.letter) {
                allTiles.push(cell.letter);
            }
        }
    }
    const totalRemaining = room.bag.length;
    let vowelsRemaining = 0;
    let consonantsRemaining = 0;
    for (const letter of allTiles) {
        if (letter === "_")
            continue; // Skip blanks
        if (vowels.has(letter)) {
            vowelsRemaining++;
        }
        else {
            consonantsRemaining++;
        }
    }
    return {
        totalRemaining,
        vowelsRemaining,
        consonantsRemaining,
    };
}
export function checkGameEnd(room) {
    // Game ends when:
    // 1. A player empties their rack (no tiles left), OR
    // 2. The bag is empty and no more moves are possible (simplified: bag empty)
    // Check if any player has empty rack
    const playerWithEmptyRack = room.players.find((player) => player.rack.length === 0);
    if (playerWithEmptyRack) {
        // Player emptied their rack - game ends
        const finalScores = {};
        for (const player of room.players) {
            let finalScore = player.score;
            if (player.id !== playerWithEmptyRack.id) {
                // This player has tiles remaining - subtract their value
                const remainingValue = scoreSimple(player.rack);
                finalScore -= remainingValue;
                // Add this value to the winner's score
                finalScores[playerWithEmptyRack.id] =
                    (finalScores[playerWithEmptyRack.id] || playerWithEmptyRack.score) +
                        remainingValue;
            }
            finalScores[player.id] = finalScore;
        }
        return {
            gameEnded: true,
            winner: playerWithEmptyRack.id,
            finalScores,
        };
    }
    // Check if bag is empty (simplified game end condition)
    if (room.bag.length === 0) {
        // Find player with highest score (or implement more complex logic later)
        const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
        const winner = sortedPlayers[0];
        const finalScores = {};
        for (const player of room.players) {
            finalScores[player.id] = player.score;
        }
        return {
            gameEnded: true,
            winner: winner.id,
            finalScores,
        };
    }
    return { gameEnded: false };
}
export function scoreWordWithPremiums(tiles, board) {
    let wordScore = 0;
    let wordMultiplier = 1;
    for (const tile of tiles) {
        const cell = board[tile.coord.row][tile.coord.col];
        const letterScore = letterPoints(tile.letter);
        // Apply letter multipliers
        let finalLetterScore = letterScore;
        if (cell.premium === "DL") {
            finalLetterScore = letterScore * 2;
        }
        else if (cell.premium === "TL") {
            finalLetterScore = letterScore * 3;
        }
        wordScore += finalLetterScore;
        // Apply word multipliers
        if (cell.premium === "DW") {
            wordMultiplier *= 2;
        }
        else if (cell.premium === "TW") {
            wordMultiplier *= 3;
        }
    }
    return { wordScore, wordMultiplier };
}
export function extractAllWords(placedTiles, board, isFirstMove = false) {
    const words = [];
    // Validate that all placed tiles are connected
    if (!areTilesConnected(placedTiles, board, isFirstMove)) {
        throw new Error("tiles_must_be_connected");
    }
    // Create a temporary board with the placed tiles
    const tempBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    for (const tile of placedTiles) {
        tempBoard[tile.coord.row][tile.coord.col].letter = tile.letter;
    }
    // Group placed tiles by row and column
    const tilesByRow = new Map();
    const tilesByCol = new Map();
    for (const tile of placedTiles) {
        if (!tilesByRow.has(tile.coord.row))
            tilesByRow.set(tile.coord.row, []);
        if (!tilesByCol.has(tile.coord.col))
            tilesByCol.set(tile.coord.col, []);
        tilesByRow.get(tile.coord.row).push(tile);
        tilesByCol.get(tile.coord.col).push(tile);
    }
    // Extract horizontal words
    for (const [row, tiles] of tilesByRow) {
        if (tiles.length > 0) {
            const word = extractWordInDirection(tempBoard, row, tiles[0].coord.col, 0, 1); // horizontal
            if (word.word.length > 1) {
                words.push(word);
            }
        }
    }
    // Extract vertical words
    for (const [col, tiles] of tilesByCol) {
        if (tiles.length > 0) {
            const word = extractWordInDirection(tempBoard, tiles[0].coord.row, col, 1, 0); // vertical
            if (word.word.length > 1) {
                words.push(word);
            }
        }
    }
    return words;
}
export function areTilesConnected(placedTiles, board, isFirstMove = false) {
    if (placedTiles.length <= 1)
        return true;
    // For first move, tiles just need to be connected to each other
    if (isFirstMove) {
        // Check if all placed tiles form a connected group
        const visited = new Set();
        const toVisit = [placedTiles[0].coord];
        while (toVisit.length > 0) {
            const current = toVisit.pop();
            const key = `${current.row},${current.col}`;
            if (visited.has(key))
                continue;
            visited.add(key);
            // Check all 4 directions for connected placed tiles
            const directions = [
                { row: current.row - 1, col: current.col }, // up
                { row: current.row + 1, col: current.col }, // down
                { row: current.row, col: current.col - 1 }, // left
                { row: current.row, col: current.col + 1 }, // right
            ];
            for (const dir of directions) {
                if (dir.row < 0 ||
                    dir.row >= BOARD_SIZE ||
                    dir.col < 0 ||
                    dir.col >= BOARD_SIZE)
                    continue;
                // Only check for placed tiles in first move
                const hasPlacedTile = placedTiles.some((t) => t.coord.row === dir.row && t.coord.col === dir.col);
                if (hasPlacedTile && !visited.has(`${dir.row},${dir.col}`)) {
                    toVisit.push(dir);
                }
            }
        }
        // All placed tiles should be visited
        return placedTiles.every((tile) => visited.has(`${tile.coord.row},${tile.coord.col}`));
    }
    // For subsequent moves, check if tiles connect to existing board tiles
    // For single tile placement, check if it connects to existing tiles
    if (placedTiles.length === 1) {
        const tile = placedTiles[0];
        const directions = [
            { row: tile.coord.row - 1, col: tile.coord.col }, // up
            { row: tile.coord.row + 1, col: tile.coord.col }, // down
            { row: tile.coord.row, col: tile.coord.col - 1 }, // left
            { row: tile.coord.row, col: tile.coord.col + 1 }, // right
        ];
        return directions.some((dir) => dir.row >= 0 &&
            dir.row < BOARD_SIZE &&
            dir.col >= 0 &&
            dir.col < BOARD_SIZE &&
            board[dir.row][dir.col].letter !== null);
    }
    // Check if all placed tiles form a connected group
    const visited = new Set();
    const toVisit = [placedTiles[0].coord];
    while (toVisit.length > 0) {
        const current = toVisit.pop();
        const key = `${current.row},${current.col}`;
        if (visited.has(key))
            continue;
        visited.add(key);
        // Check all 4 directions for connected tiles
        const directions = [
            { row: current.row - 1, col: current.col }, // up
            { row: current.row + 1, col: current.col }, // down
            { row: current.row, col: current.col - 1 }, // left
            { row: current.row, col: current.col + 1 }, // right
        ];
        for (const dir of directions) {
            if (dir.row < 0 ||
                dir.row >= BOARD_SIZE ||
                dir.col < 0 ||
                dir.col >= BOARD_SIZE)
                continue;
            // Check if there's a tile at this position (either placed or existing on board)
            const hasTile = placedTiles.some((t) => t.coord.row === dir.row && t.coord.col === dir.col) || board[dir.row][dir.col].letter !== null;
            if (hasTile && !visited.has(`${dir.row},${dir.col}`)) {
                toVisit.push(dir);
            }
        }
    }
    // All placed tiles should be visited (form a connected group)
    const allPlacedTilesVisited = placedTiles.every((tile) => visited.has(`${tile.coord.row},${tile.coord.col}`));
    // Also check if at least one placed tile connects to existing board tiles
    const connectsToExisting = placedTiles.some((tile) => {
        const directions = [
            { row: tile.coord.row - 1, col: tile.coord.col }, // up
            { row: tile.coord.row + 1, col: tile.coord.col }, // down
            { row: tile.coord.row, col: tile.coord.col - 1 }, // left
            { row: tile.coord.row, col: tile.coord.col + 1 }, // right
        ];
        return directions.some((dir) => dir.row >= 0 &&
            dir.row < BOARD_SIZE &&
            dir.col >= 0 &&
            dir.col < BOARD_SIZE &&
            board[dir.row][dir.col].letter !== null);
    });
    return allPlacedTilesVisited && connectsToExisting;
}
function extractWordInDirection(board, startRow, startCol, rowDir, colDir) {
    // Find the start of the word
    let row = startRow;
    let col = startCol;
    while (row >= 0 && col >= 0 && board[row][col].letter) {
        row -= rowDir;
        col -= colDir;
    }
    // Move back to the actual start
    row += rowDir;
    col += colDir;
    // Extract the word
    const tiles = [];
    let word = "";
    while (row < BOARD_SIZE && col < BOARD_SIZE && board[row][col].letter) {
        const letter = board[row][col].letter;
        word += letter;
        tiles.push({ letter, coord: { row, col } });
        row += rowDir;
        col += colDir;
    }
    return { word, tiles };
}
export async function validateAndScoreAllWords(placedTiles, board, isValidWordAsync) {
    const allWords = extractAllWords(placedTiles, board);
    const wordResults = [];
    let totalScore = 0;
    let allValid = true;
    for (const { word, tiles } of allWords) {
        const isValid = await isValidWordAsync(word);
        const { wordScore, wordMultiplier } = scoreWordWithPremiums(tiles, board);
        const score = wordScore * wordMultiplier;
        wordResults.push({ word, score, valid: isValid });
        totalScore += score;
        if (!isValid) {
            allValid = false;
        }
    }
    return { valid: allValid, totalScore, words: wordResults };
}
export function initializePlayerTimer(player, timeLimit) {
    player.timeRemaining = timeLimit;
    player.timePenalty = 0;
    player.isInOvertime = false;
}
export function updatePlayerTimer(player, timeElapsed) {
    // Update time remaining
    player.timeRemaining = Math.max(0, player.timeRemaining - timeElapsed);
    // Check if player is now in overtime
    if (player.timeRemaining <= 0 && !player.isInOvertime) {
        player.isInOvertime = true;
        player.timePenalty += 10; // Initial overtime penalty
        return true; // Player just entered overtime
    }
    // If already in overtime, add penalty for each full minute
    if (player.isInOvertime) {
        const overtimeMinutes = Math.floor(timeElapsed / 60000); // 60000ms = 1 minute
        if (overtimeMinutes > 0) {
            player.timePenalty += overtimeMinutes * 10;
        }
    }
    return false; // No new overtime entry
}
export function checkTimerForfeit(player) {
    // Forfeit if player has been in overtime for more than 1 minute total
    // This is a simplified rule - in real Scrabble, it might be more complex
    return player.isInOvertime && player.timeRemaining <= -60000; // 1 minute overtime limit
}
export function formatTimeRemaining(timeRemaining) {
    const totalSeconds = Math.ceil(timeRemaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
export function validateTilePlacement(tiles, board, isFirstMove) {
    // Check for empty placement
    if (tiles.length === 0) {
        return { valid: false, error: "no_tiles_placed" };
    }
    // Check for duplicate coordinates
    const coords = tiles.map((t) => `${t.coord.row},${t.coord.col}`);
    const uniqueCoords = new Set(coords);
    if (coords.length !== uniqueCoords.size) {
        return { valid: false, error: "duplicate_tile_positions" };
    }
    // Check for out-of-bounds coordinates
    for (const tile of tiles) {
        if (tile.coord.row < 0 ||
            tile.coord.row >= BOARD_SIZE ||
            tile.coord.col < 0 ||
            tile.coord.col >= BOARD_SIZE) {
            return { valid: false, error: "tile_out_of_bounds" };
        }
    }
    // Check for occupied cells
    for (const tile of tiles) {
        if (board[tile.coord.row][tile.coord.col].letter !== null) {
            return { valid: false, error: "cell_already_occupied" };
        }
    }
    // Check if tiles form valid word formations (straight lines or cross-words)
    // For single tile, it's always valid
    if (tiles.length === 1) {
        // Single tile placement is always valid
    }
    else {
        // For multiple tiles, check if they form valid word patterns
        const isValidWordFormation = areTilesConnected(tiles, board, isFirstMove);
        if (!isValidWordFormation) {
            return { valid: false, error: "tiles_must_be_adjacent" };
        }
    }
    // First move must touch center star
    if (isFirstMove) {
        const touchesCenter = tiles.some((t) => t.coord.row === 7 && t.coord.col === 7);
        if (!touchesCenter) {
            return { valid: false, error: "first_move_must_touch_center_star" };
        }
    }
    else {
        // Subsequent moves must connect to existing tiles
        const connectsToExisting = tiles.some((tile) => {
            const directions = [
                { row: tile.coord.row - 1, col: tile.coord.col },
                { row: tile.coord.row + 1, col: tile.coord.col },
                { row: tile.coord.row, col: tile.coord.col - 1 },
                { row: tile.coord.row, col: tile.coord.col + 1 },
            ];
            return directions.some((dir) => dir.row >= 0 &&
                dir.row < BOARD_SIZE &&
                dir.col >= 0 &&
                dir.col < BOARD_SIZE &&
                board[dir.row][dir.col].letter !== null);
        });
        if (!connectsToExisting) {
            return { valid: false, error: "must_connect_to_existing_tiles" };
        }
    }
    return { valid: true };
}
export function validateWordFormation(tiles, board, isFirstMove = false) {
    try {
        const words = extractAllWords(tiles, board, isFirstMove);
        // Must form at least one word
        if (words.length === 0) {
            return { valid: false, error: "must_form_at_least_one_word" };
        }
        // All words must be at least 2 letters
        const shortWords = words.filter((w) => w.word.length < 2);
        if (shortWords.length > 0) {
            return { valid: false, error: "words_must_be_at_least_2_letters" };
        }
        return { valid: true };
    }
    catch (error) {
        return { valid: false, error: error.message };
    }
}
