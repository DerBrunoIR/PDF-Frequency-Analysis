import { useState, useMemo } from 'react';
import { 
  AutoComplete, 
  type AutoCompleteCompleteEvent, 
  type AutoCompleteChangeEvent 
} from 'primereact/autocomplete';
import { Trie, find, toArray } from '@kamilmielnik/trie';

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
    const prefix = event.query
    const prefixNode = find(trie.root, prefix) || {};
    const descendants = toArray(prefixNode, { prefix, sort: true, wordsOnly: true });
    let words = descendants.map(({ prefix: word }) => word);
    if (prefixNode.wordEnd) {
      words = [prefix, ...words]
    }
    setSuggestions(words)
  };

  return (
    <AutoComplete 
      multiple
      //field='label'
      value={selection}
      suggestions={suggestions}
      completeMethod={search}
      virtualScrollerOptions={{ itemSize: 35 }}
      dropdown
      onChange={(e: AutoCompleteChangeEvent) => setTokens(e.value ?? [])}
    />
  );
}
