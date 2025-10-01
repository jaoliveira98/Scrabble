const cache = new Map();
export const definitionCache = new Map();
async function validateWithApi(word, signal) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    const res = await fetch(url, { signal });
    // 200 with array => valid, 404 => invalid
    if (res.status === 200)
        return true;
    if (res.status === 404)
        return false;
    // Other status: treat as unknown, fallback later
    throw new Error(`dictionary_api_error_${res.status}`);
}
export async function isValidWordAsync(word) {
    const key = word.toUpperCase();
    if (cache.has(key))
        return cache.get(key);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    try {
        const ok = await validateWithApi(key, controller.signal);
        cache.set(key, ok);
        return ok;
    }
    catch {
        // If API fails or times out, assume invalid (conservative approach)
        cache.set(key, false);
        return false;
    }
    finally {
        clearTimeout(timeout);
    }
}
async function getDefinitionFromApi(word, signal) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    const res = await fetch(url, { signal });
    if (res.status === 200) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
            const entry = data[0];
            if (entry.meanings && entry.meanings.length > 0) {
                const meaning = entry.meanings[0];
                if (meaning.definitions && meaning.definitions.length > 0) {
                    return meaning.definitions[0].definition;
                }
            }
        }
    }
    return null;
}
export async function getWordDefinitionAsync(word) {
    const key = word.toUpperCase();
    if (definitionCache.has(key))
        return definitionCache.get(key);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    try {
        const definition = await getDefinitionFromApi(key, controller.signal);
        if (definition) {
            definitionCache.set(key, definition);
        }
        return definition;
    }
    catch {
        // If API fails or times out, return null
        return null;
    }
    finally {
        clearTimeout(timeout);
    }
}
