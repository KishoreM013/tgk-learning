import { useState, useMemo } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

type TreeItem = { value: string | number; color?: string; left?: TreeItem; right?: TreeItem };
function TreeNode({ node }: { node?: TreeItem }) { if (!node) return <span style={{ color: 'hsl(var(--muted-foreground))', font: '11px var(--app-font-mono)', border: 'none', background: 'transparent' }}>empty</span>; return <div className="tree-node"><span style={{ borderColor: node.color, color: node.color }}>{node.value}</span><div className="tree-children"><div className="tree-child"><TreeNode node={node.left} /></div><div className="tree-child"><TreeNode node={node.right} /></div></div></div>; }

export default function FenwickTreePlayground({ structure, onOperationChange }: any) {
  const [input, setInput] = useState('10');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Tree initialized.');
  
  const [root, setRoot] = useState<TreeItem>({
    value: 50, color: 'hsl(var(--primary))',
    left: { value: 25, color: 'hsl(var(--destructive))', left: { value: 10 }, right: { value: 30 } },
    right: { value: 75, color: 'hsl(var(--primary))', left: { value: 60 }, right: { value: 90, color: 'hsl(var(--destructive))' } }
  });

  const cloneTree = (node?: TreeItem): TreeItem | undefined => {
    if (!node) return undefined;
    return { value: node.value, color: node.color, left: cloneTree(node.left), right: cloneTree(node.right) };
  };

  const act = () => {
    if (operation === 'Insert' || operation === 'Update' || operation === 'Build') {
      const val = parseInt(input) || Math.floor(Math.random() * 100);
      const newRoot = cloneTree(root);
      
      let current = newRoot;
      while (current) {
        if (val < (current.value as number)) {
          if (!current.left) {
            current.left = { value: val, color: 'hsl(var(--destructive))' };
            break;
          }
          current = current.left;
        } else {
          if (!current.right) {
            current.right = { value: val, color: 'hsl(var(--destructive))' };
            break;
          }
          current = current.right;
        }
      }
      setRoot(newRoot!);
      setMessage(`Inserted ${val} into the tree.`);
    } else if (operation === 'Reset') {
      setRoot({ value: 50, color: 'hsl(var(--primary))' });
      setMessage('Tree reset.');
    } else {
      setMessage(`Operation '${operation}' triggered with ${input}`);
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
      <div className="tree-visual"><TreeNode node={root} /></div>
    </PlaygroundFrame>
  );
}
