  it("awards bingo bonus for using all 7 tiles", async () => {
    const r = createRoom("p1");
    const r2 = joinRoom(r.id, "p2");
    r2.challengeMode = false;
    const player = r2.players.find((p) => p.id === "p1")!;
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
    const scoreIncrease = after.players.find((p) => p.id === "p1")!.score - before;
    
    // Should get word score + 50 bingo bonus
    expect(scoreIncrease).toBeGreaterThan(50);
    expect(after.lastMoveBingo).toBe(true);
  });
