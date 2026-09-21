import { useState, useMemo } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

type TreeItem = { value: number; left?: TreeItem; right?: TreeItem };
function TreeNode({ node }: { node?: TreeItem }) { if (!node) return <span style={{ color: 'hsl(var(--muted-foreground))', font: '11px var(--app-font-mono)' }}>empty</span>; return <div className="tree-node"><span>{node.value}</span><div className="tree-children"><div className="tree-child"><TreeNode node={node.left} /></div><div className="tree-child"><TreeNode node={node.right} /></div></div></div>; }

export default function BinaryTreePlayground({ structure, onOperationChange }: any) {
  const [values, setValues] = useState([1, 2, 3, 4, 5]);
  const [input, setInput] = useState('6');
  const [operation, setOperation] = useState('Insert');
  const [message, setMessage] = useState('A general hierarchy with left and right children.');

  const root = useMemo(() => {
    if (!values.length) return undefined;
    const nodes: TreeItem[] = values.map(v => ({ value: v }));
    for (let i = 0; i < nodes.length; i++) {
      if (2 * i + 1 < nodes.length) nodes[i].left = nodes[2 * i + 1];
      if (2 * i + 2 < nodes.length) nodes[i].right = nodes[2 * i + 2];
    }
    return nodes[0];
  }, [values]);

  const act = () => {
    const number = Number(input);
    if (!Number.isFinite(number)) return;
    if (operation === 'Insert') { setValues((v) => [...v, number]); setMessage(`Inserted ${number} into the next available slot.`); }
    if (operation === 'Traverse') setMessage(`Level-order: ${values.join(' → ')}.`);
    if (operation === 'Reset') { setValues([]); setMessage('Tree cleared.'); }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
      <div className="tree-visual"><TreeNode node={root} /></div>
    </PlaygroundFrame>
  );
}
