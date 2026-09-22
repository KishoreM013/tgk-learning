import { useState, useMemo } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

type TreeItem = { value: number; left?: TreeItem; right?: TreeItem };
function addTree(node: TreeItem | undefined, value: number): TreeItem { if (!node) return { value }; if (value < node.value) return { ...node, left: addTree(node.left, value) }; return { ...node, right: addTree(node.right, value) }; }
function findMin(node: TreeItem): TreeItem { while (node.left) node = node.left; return node; }
function deleteTree(node: TreeItem | undefined, value: number): TreeItem | undefined {
  if (!node) return node;
  if (value < node.value) return { ...node, left: deleteTree(node.left, value) };
  if (value > node.value) return { ...node, right: deleteTree(node.right, value) };
  if (!node.left) return node.right;
  if (!node.right) return node.left;
  const successor = findMin(node.right);
  return { ...node, value: successor.value, right: deleteTree(node.right, successor.value) };
}
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
      if (values.includes(number)) {
        setMessage(`Insert ${number}: value already exists; BST insertion stops once the duplicate is detected.`);
        return;
      }
      const path: string[] = [];
      let current = root;
      let target = 'root';
      while (current) {
        path.push(`${target}=${current.value}`);
        if (number < current.value) {
          target = 'left';
          if (!current.left) break;
          current = current.left;
        } else {
          target = 'right';
          if (!current.right) break;
          current = current.right;
        }
      }
      setValues((v) => [...v, number]);
      setMessage(`Insert ${number}: compare along the BST path ${path.join(' -> ')} -> insert at the first empty ${target} child.`);
    }
    if (operation === 'Delete') {
      if (!values.includes(number)) {
        setMessage(`Delete ${number}: not found, so no node is removed from the BST.`);
        return;
      }
      setValues((v) => v.filter((value) => value !== number));
      setMessage(`Delete ${number}: locate the node, then replace it using the in-order successor or predecessor to preserve BST ordering.`);
    }
    if (operation === 'Search') {
      const path: string[] = [];
      let current = root;
      while (current) {
        path.push(`${current.value}`);
        if (number === current.value) {
          setMessage(`Search ${number}: path ${path.join(' -> ')} finds the value at its exact BST node.`);
          return;
        }
        current = number < current.value ? current.left : current.right;
      }
      setMessage(`Search ${number}: path ${path.join(' -> ')} ends without a match, so the value is not in the BST.`);
    }
    if (operation === 'Traverse') {
      if (!values.includes(number)) {
        setMessage(`Traverse ${number}: not found in the BST, so the in-order walk ends without a match.`);
        return;
      }
      const sorted = [...values].sort((a, b) => a - b);
      setMessage(`Traverse ${number}: in-order walk visits ${sorted.join(' -> ')}; ${number} is found in the ordering and is part of the current BST path.`);
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
      <div className="tree-visual"><TreeNode node={root} /></div>
    </PlaygroundFrame>
  );
}
