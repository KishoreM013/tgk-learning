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
    if (operation === 'Insert') {
      const number = Number(input);
      if (!Number.isFinite(number)) {
        setMessage('Insert requires a finite numeric value.');
        return;
      }
      setValues((v) => [...v, number]);
      setMessage(`Insert ${number}: place it in the next available parent slot, then continue walking the level-order structure.`);
    }
    if (operation === 'Delete') {
      const number = Number(input);
      if (!Number.isFinite(number)) {
        setMessage('Delete requires a finite numeric value.');
        return;
      }
      if (values.length === 0) {
        setMessage('Delete: the tree is already empty.');
        return;
      }
      const targetIndex = values.indexOf(number);
      if (targetIndex < 0) {
        setMessage(`Delete ${number}: value not found, so the tree structure stays unchanged.`);
        return;
      }
      const next = [...values];
      const replacement = next.pop();
      if (targetIndex < next.length && replacement !== undefined) next[targetIndex] = replacement;
      setValues(next);
      setMessage(`Delete ${number}: replace it with the last level-order node and restore the complete tree shape.`);
    }
    if (operation === 'Traverse') {
      setMessage(values.length ? `Level-order traversal: ${values.join(' → ')}.` : 'The tree is empty.');
    }
    if (operation === 'Reset') { setValues([]); setMessage('Reset: tree cleared, so the traversal stack is empty.'); }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation === 'Insert' || operation === 'Delete' ? [{ label: 'Value', value: input, setValue: setInput, inputMode: 'numeric' }] : []} message={message}>
      <div className="tree-visual"><TreeNode node={root} /></div>
    </PlaygroundFrame>
  );
}
