import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

type TrieNode = { char: string; isEndOfWord: boolean; children: Record<string, TrieNode> };

function createNode(char: string = '*'): TrieNode {
  return { char, isEndOfWord: false, children: {} };
}

function NTreeNode({ node }: { node: TrieNode }) {
  const childKeys = Object.keys(node.children);
  return (
    <div className="tree-node">
      <span style={{ 
        background: node.isEndOfWord ? 'hsl(var(--primary))' : 'hsl(var(--card))',
        color: node.isEndOfWord ? 'hsl(var(--primary-foreground))' : 'hsl(var(--primary))',
        borderColor: node.isEndOfWord ? 'hsl(var(--primary))' : 'hsl(var(--primary))'
      }}>
        {node.char}
      </span>
      {childKeys.length > 0 && (
        <div className="tree-children" style={{ gap: 20 }}>
          {childKeys.map((key) => (
            <div key={key} className="tree-child"><NTreeNode node={node.children[key]} /></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TriePlayground({ structure, onOperationChange }: any) {
  const [root, setRoot] = useState<TrieNode>(() => {
    const r = createNode('*');
    r.children['C'] = createNode('C');
    r.children['C'].children['A'] = createNode('A');
    r.children['C'].children['A'].children['T'] = createNode('T');
    r.children['C'].children['A'].children['T'].isEndOfWord = true;
    return r;
  });
  
  const [input, setInput] = useState('CAR');
  const [operation, setOperation] = useState('Insert');
  const [message, setMessage] = useState('Trie loaded. "CAT" is pre-inserted.');

  const cloneTrie = (node: TrieNode): TrieNode => {
    const newNode: TrieNode = { char: node.char, isEndOfWord: node.isEndOfWord, children: {} };
    for (const k of Object.keys(node.children)) {
      newNode.children[k] = cloneTrie(node.children[k]);
    }
    return newNode;
  };

  const act = () => {
    const word = input.trim().toUpperCase();
    if (!word) {
      setMessage('Please enter a word.');
      return;
    }

    if (operation === 'Insert') {
      const newRoot = cloneTrie(root);
      let current = newRoot;
      for (const char of word) {
        if (!current.children[char]) {
          current.children[char] = createNode(char);
        }
        current = current.children[char];
      }
      if (current.isEndOfWord) {
        setMessage(`"${word}" is already in the Trie.`);
      } else {
        current.isEndOfWord = true;
        setRoot(newRoot);
        setMessage(`Inserted "${word}". End of word marked with filled circle.`);
      }
    } else if (operation === 'Search') {
      let current = root;
      for (const char of word) {
        if (!current.children[char]) {
          setMessage(`"${word}" NOT found in the Trie.`);
          return;
        }
        current = current.children[char];
      }
      if (current.isEndOfWord) {
        setMessage(`Found "${word}" in the Trie!`);
      } else {
        setMessage(`"${word}" is only a prefix, not a complete word.`);
      }
    } else if (operation === 'Prefix') {
      let current = root;
      for (const char of word) {
        if (!current.children[char]) {
          setMessage(`No words start with prefix "${word}".`);
          return;
        }
        current = current.children[char];
      }
      setMessage(`Prefix "${word}" exists in the Trie.`);
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
      <div className="tree-visual" style={{ minHeight: 300, paddingTop: 20 }}>
        <NTreeNode node={root} />
      </div>
    </PlaygroundFrame>
  );
}
