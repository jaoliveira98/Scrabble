import { ERROR_MESSAGES } from "../constants";

export function getFriendlyError(code: string): string {
  return (
    ERROR_MESSAGES[code] ||
    code.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
