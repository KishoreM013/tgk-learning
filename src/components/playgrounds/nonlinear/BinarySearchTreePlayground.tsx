import { useState, useMemo } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

type TreeItem = { value: number; left?: TreeItem; right?: TreeItem };
function addTree(node: TreeItem | undefined, value: number): TreeItem { if (!node) return { value }; if (value < node.value) return { ...node, left: addTree(node.left, value) }; return { ...node, right: addTree(node.right, value) }; }
function TreeNode({ node }: { node?: TreeItem }) { if (!node) return <span style={{ color: 'hsl(var(--muted-foreground))', font: '11px var(--app-font-mono)' }}>empty</span>; return <div className="tree-node"><span>{node.value}</span><div className="tree-children"><div className="tree-child"><TreeNode node={node.left} /></div><div className="tree-child"><TreeNode node={node.right} /></div></div></div>; }

export default function BinarySearchTreePlayground({ structure, onOperationChange }: any) {
  const [values, setValues] = useState([42, 19, 64, 8, 27, 55, 71]);
  const [input, setInput] = useState('33');
  const [operation, setOperation] = useState('Insert');
  const [message, setMessage] = useState('Every left turn is smaller; every right turn is larger.');
  const root = useMemo(() => values.reduce<TreeItem | undefined>((tree, value) => addTree(tree, value), undefined), [values]);

  const act = () => {
    const number = Number(input);
    if (!Number.isFinite(number)) return;
    if (operation === 'Insert') {
      if (values.includes(number)) setMessage(`${number} is already in the tree.`);
      else { setValues((v) => [...v, number]); setMessage(`Inserted ${number}; follow the comparisons.`); }
    }
    if (operation === 'Search') setMessage(values.includes(number) ? `${number} is found on the path.` : `${number} is not in this tree.`);
    if (operation === 'Traverse') setMessage(`In-order traversal: ${[...values].sort((a, b) => a - b).join(' → ')}.`);
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
      <div className="tree-visual"><TreeNode node={root} /></div>
    </PlaygroundFrame>
  );
}
