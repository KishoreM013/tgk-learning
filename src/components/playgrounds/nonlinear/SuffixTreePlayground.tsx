import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

type NNode = { value: string; children?: NNode[] };
function NTreeNode({ node }: { node: NNode }) {
  return (
    <div className="tree-node">
      <span>{node.value}</span>
      {node.children && node.children.length > 0 && (
        <div className="tree-children" style={{ gap: 20 }}>
          {node.children.map((child, i) => (
            <div key={i} className="tree-child"><NTreeNode node={child} /></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SuffixTreePlayground({ structure, onOperationChange }: any) {
  const [input, setInput] = useState('Node');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Tree initialized.');
  const buildSuffixRoot = (text: string): NNode => ({ value: text || 'Root', children: Array.from({ length: text.length }, (_, index) => ({ value: text.slice(index) })) });
  const [root, setRoot] = useState<NNode>(() => buildSuffixRoot('banana'));

  const act = () => {
    if (operation === 'Reset') { setRoot(buildSuffixRoot('banana')); setMessage('Suffix tree reset to "banana".'); return; }
    if (!input.trim()) { setMessage(`${operation} requires a non-empty text value.`); return; }
    const value = input.trim();
    if (operation === 'Build') { setRoot(buildSuffixRoot(value)); setMessage(`Built suffix tree for "${value}".`); return; }
    if (operation === 'Search') { setMessage(root.children?.some((suffix) => suffix.value.includes(value)) ? `Found pattern "${value}" in the suffix tree.` : `Pattern "${value}" was not found.`); return; }
    if (operation === 'Delete') { setRoot((current) => ({ ...current, children: current.children?.filter((suffix) => suffix.value !== value) })); setMessage(`Deleted suffix "${value}" from the tree.`); }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={['Build', 'Search', 'Delete'].includes(operation) ? [{ label: operation === 'Build' ? 'Text' : 'Pattern', value: input, setValue: setInput }] : []} message={message}>
      <div className="tree-visual" style={{ minHeight: 300 }}><NTreeNode node={root} /></div>
    </PlaygroundFrame>
  );
}
