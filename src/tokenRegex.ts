/**
 * Shared utilities for token pattern matching.
 */

/** Regex metacharacters that indicate a pattern rather than a literal token. */
export const METACHAR_PATTERN = /[.*+?^${}()|[\]\\]/;

/**
 * Cache for expanded patterns to avoid repeated regex matching.
 */
export const patternCache = new Map<string, string[]>();

/**
 * Checks if a string contains regex metacharacters.
 */
export function hasMetacharacters(str: string): boolean {
  return METACHAR_PATTERN.test(str);
}

/**
 * Checks if a string contains regex metacharacters.
 * Alias for hasMetacharacters for semantic clarity.
 */
export const isPattern = hasMetacharacters;

/**
 * Expands a regex pattern into all matching tokens from a vocabulary.
 * Uses cache to avoid redundant regex operations.
 */
export function expandPattern(pattern: string, tokens: string[]): string[] {
  if (!pattern) return [];
  
  const cached = patternCache.get(pattern);
  if (cached !== undefined) {
    return cached;
  }
  
  try {
    const regex = new RegExp(pattern);
    const result = tokens.filter(token => regex.test(token));
    if (patternCache.size > 100) {
      patternCache.clear();
    }
    patternCache.set(pattern, result);
    return result;
  } catch {
    return [];
  }
}

/**
 * Extracts the raw pattern from a suggestion string that may include match count.
 * e.g., "anticipat* (42 matches)" -> "anticipat*"
 */
export function extractPattern(suggestion: string): string {
  const match = suggestion.match(/^(.+?)\s*\((\d+)\s+matches?\)$/);
  return match ? match[1] : suggestion;
}
