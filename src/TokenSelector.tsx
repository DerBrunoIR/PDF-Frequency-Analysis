import { useState, useMemo } from 'react';
import { 
  AutoComplete, 
  type AutoCompleteCompleteEvent, 
  type AutoCompleteChangeEvent 
} from 'primereact/autocomplete';
import { Trie, find, toArray } from '@kamilmielnik/trie';
import { expandPattern, hasMetacharacters, extractPattern } from './tokenRegex';

type TokenSelectorProps = {
  selection: string[];
  setTokens: (tokens: string[]) => void;
  tokens: string[]; 
};

export function TokenSelector({ selection, setTokens, tokens}: TokenSelectorProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const trie = useMemo(() => {
    const t = new Trie();
    tokens.forEach(token => t.add(token))
    return t;
  }, [tokens]);

  const search = (event: AutoCompleteCompleteEvent) => {
    const query = event.query;
    const prefix = query.toLowerCase();
    
    // Get Trie-based prefix matches (existing behavior)
    const prefixNode = find(trie.root, prefix) || {};
    const descendants = toArray(prefixNode, { prefix, sort: true, wordsOnly: true });
    let words = descendants.map(({ prefix: word }) => word);
    if (prefixNode.wordEnd) {
      words = [prefix, ...words]
    }

    // If query contains metacharacters, also suggest pattern expansion
    if (hasMetacharacters(query)) {
      const expanded = expandPattern(query, tokens);
      if (expanded.length > 0) {
        // Clean pattern suggestion at the top
        const patternSuggestion = `${query} (${expanded.length} matches)`;
        words = [patternSuggestion, ...words];
        
        // Add individual matched tokens below for easy selection
        // (only show first few to avoid clutter)
        const MAX_SHOWN = 5;
        const shownMatches = expanded.slice(0, MAX_SHOWN);
        for (const match of shownMatches) {
          if (!words.includes(match)) {
            words.push(match);
          }
        }
      }
    }

    setSuggestions(words)
  };

  /**
   * Handles token selection.
   * Patterns are kept as-is (not expanded) - expansion happens in the chart.
   */
  const handleChange = (e: AutoCompleteChangeEvent) => {
    const newSelection = e.value as string[];
    
    if (!newSelection) {
      setTokens([]);
      return;
    }

    // Clean up: remove match count suffix from suggestions, keep patterns as-is
    const cleaned = newSelection.map(t => extractPattern(t));
    
    // Remove duplicates
    setTokens([...new Set(cleaned)]);
  };

  /**
   * Handles Enter to add best match, Escape to hide suggestions.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      // Get the first/best matching suggestion
      const bestMatch = suggestions[0];
      const pattern = extractPattern(bestMatch);
      
      if (!selection.includes(pattern)) {
        setTokens([...selection, pattern]);
      }
    } 
  };

  return (
    <AutoComplete 
      multiple
      value={selection}
      suggestions={suggestions}
      completeMethod={search}
      virtualScrollerOptions={{ itemSize: 35 }}
      dropdown
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
}
