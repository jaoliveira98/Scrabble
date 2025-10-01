import { describe, it, expect, vi } from "vitest";
import { getWordDefinitionAsync } from "./dictionary";

// Mock fetch for testing
global.fetch = vi.fn();

describe("dictionary", () => {
  it("gets word definition successfully", async () => {
    const mockResponse = [
      {
        meanings: [
          {
            definitions: [
              {
                definition: "a small domesticated carnivorous mammal",
              },
            ],
          },
        ],
      },
    ];

    (fetch as any).mockResolvedValueOnce({
      status: 200,
      json: async () => mockResponse,
    });

    const definition = await getWordDefinitionAsync("cat");
    expect(definition).toBe("a small domesticated carnivorous mammal");
  });

  it("returns null for invalid word", async () => {
    (fetch as any).mockResolvedValueOnce({
      status: 404,
    });

    const definition = await getWordDefinitionAsync("invalidword");
    expect(definition).toBeNull();
  });

  it("caches definitions", async () => {
    const mockResponse = [
      {
        meanings: [
          {
            definitions: [
              {
                definition: "a small domesticated carnivorous mammal",
              },
            ],
          },
        ],
      },
    ];

    (fetch as any).mockResolvedValueOnce({
      status: 200,
      json: async () => mockResponse,
    });

    // First call
    const definition1 = await getWordDefinitionAsync("cat");
    expect(definition1).toBe("a small domesticated carnivorous mammal");

    // Reset fetch mock to track second call
    (fetch as any).mockClear();

    // Second call should use cache (no additional fetch call)
    const definition2 = await getWordDefinitionAsync("cat");
    expect(definition2).toBe("a small domesticated carnivorous mammal");
    expect(fetch).toHaveBeenCalledTimes(0);
  });

  it.skip("handles API timeout", async () => {
    // Clear any previous mocks and cache
    (fetch as any).mockClear();

    // Clear the cache by importing and clearing it
    const { definitionCache } = await import("./dictionary");
    definitionCache.clear();

    (fetch as any).mockImplementationOnce(
      () =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 100)
        )
    );

    const definition = await getWordDefinitionAsync("timeoutword");
    expect(definition).toBeNull();
  });
});
