import { useState, useMemo } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

type TreeItem = { value: number; left?: TreeItem; right?: TreeItem; height: number };

function height(node?: TreeItem) { return node ? node.height : 0; }
function updateHeight(node: TreeItem) { node.height = Math.max(height(node.left), height(node.right)) + 1; }
function balanceFactor(node: TreeItem) { return height(node.left) - height(node.right); }

function rightRotate(y: TreeItem) {
  const x = y.left!;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  updateHeight(y);
  updateHeight(x);
  return x;
}

function leftRotate(x: TreeItem) {
  const y = x.right!;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  updateHeight(x);
  updateHeight(y);
  return y;
}

function insertAVL(node: TreeItem | undefined, value: number): TreeItem {
  if (!node) return { value, height: 1 };
  if (value < node.value) node.left = insertAVL(node.left, value);
  else if (value > node.value) node.right = insertAVL(node.right, value);
  else return node;

  updateHeight(node);
  const balance = balanceFactor(node);

  if (balance > 1 && value < node.left!.value) return rightRotate(node);
  if (balance < -1 && value > node.right!.value) return leftRotate(node);
  if (balance > 1 && value > node.left!.value) {
    node.left = leftRotate(node.left!);
    return rightRotate(node);
  }
  if (balance < -1 && value < node.right!.value) {
    node.right = rightRotate(node.right!);
    return leftRotate(node);
  }

  return node;
}

function minValue(node: TreeItem): number {
  let current = node;
  while (current.left) current = current.left;
  return current.value;
}

function deleteAVL(node: TreeItem | undefined, value: number): TreeItem | undefined {
  if (!node) return node;
  if (value < node.value) node.left = deleteAVL(node.left, value);
  else if (value > node.value) node.right = deleteAVL(node.right, value);
  else {
    if (!node.left || !node.right) return node.left ?? node.right;
    const successor = minValue(node.right!);
    node.value = successor;
    node.right = deleteAVL(node.right, successor);
  }

  updateHeight(node);
  const balance = balanceFactor(node);

  if (balance > 1 && balanceFactor(node.left!) >= 0) return rightRotate(node);
  if (balance > 1 && balanceFactor(node.left!) < 0) {
    node.left = leftRotate(node.left!);
    return rightRotate(node);
  }
  if (balance < -1 && balanceFactor(node.right!) <= 0) return leftRotate(node);
  if (balance < -1 && balanceFactor(node.right!) > 0) {
    node.right = rightRotate(node.right!);
    return leftRotate(node);
  }

  return node;
}

function TreeNode({ node }: { node?: TreeItem }) {
  if (!node) return <span style={{ color: 'hsl(var(--muted-foreground))', font: '11px var(--app-font-mono)' }}>empty</span>;
  return (
    <div className="tree-node">
      <span style={{ position: 'relative' }}>{node.value} <small style={{fontSize: 10, opacity: 0.5, position: 'absolute', bottom: -20, whiteSpace: 'nowrap'}}>h:{node.height}</small></span>
      <div className="tree-children">
        <div className="tree-child"><TreeNode node={node.left} /></div>
        <div className="tree-child"><TreeNode node={node.right} /></div>
      </div>
    </div>
  );
}

export default function AvlTreePlayground({ structure, onOperationChange }: any) {
  const [values, setValues] = useState([10, 20, 30, 40, 50, 25]);
  const [input, setInput] = useState('60');
  const [operation, setOperation] = useState('Insert');
  const [message, setMessage] = useState('AVL trees rebalance automatically after insertions.');

  const root = useMemo(() => {
    let tree: TreeItem | undefined = undefined;
    for (const v of values) {
      tree = insertAVL(tree, v);
    }
    return tree;
  }, [values]);

  const act = () => {
    const num = Number(input);
    if (!Number.isFinite(num)) { setMessage('This operation requires a finite numeric value.'); return; }
    if (operation === 'Insert') {
      if (!values.includes(num)) {
        setValues([...values, num]);
        setMessage(`Inserted ${num} and rebalanced if necessary.`);
      } else setMessage(`${num} is already in the tree.`);
    }
    if (operation === 'Delete') {
      if (!values.includes(num)) {
        setMessage(`${num} is not in the tree.`);
        return;
      }
      setValues((current) => current.filter((value) => value !== num));
      setMessage(`Deleted ${num} and rebalanced the tree.`);
    }
    if (operation === 'Rotate') {
      setMessage('Rotations happen automatically on insert.');
    }
    if (operation === 'Search') {
      setMessage(values.includes(num) ? `Found ${num}.` : `${num} not found.`);
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={['Insert', 'Delete', 'Search'].includes(operation) ? [{ label: 'Value', value: input, setValue: setInput, inputMode: 'numeric' }] : []} message={message}>
      <div className="tree-visual">
        <TreeNode node={root} />
      </div>
    </PlaygroundFrame>
  );
}
