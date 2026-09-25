import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

type BNode = { id: number; keys: number[]; children: BNode[] };

function renderBTree(node: BNode) {
  return (
    <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
      <div style={{ display: 'flex', border: '2px solid hsl(var(--primary))', borderRadius: 4, overflow: 'hidden' }}>
        {node.keys.map((k, i) => (
          <div key={i} style={{ padding: '8px 12px', borderRight: i < node.keys.length - 1 ? '1px solid hsl(var(--primary))' : 'none', background: 'hsl(var(--card))', color: 'hsl(var(--primary))', fontWeight: 'bold' }}>
            {k}
          </div>
        ))}
      </div>
      {node.children.length > 0 && (
        <div style={{ display: 'flex', gap: 20 }}>
          {node.children.map(c => renderBTree(c))}
        </div>
      )}
    </div>
  );
}

export default function BTreePlayground({ structure, onOperationChange }: any) {
  const [root, setRoot] = useState<BNode>({
    id: 1, keys: [20, 40], children: [
      { id: 2, keys: [5, 10, 15], children: [] },
      { id: 3, keys: [25, 30, 35], children: [] },
      { id: 4, keys: [45, 50, 55], children: [] }
    ]
  });
  const [input, setInput] = useState('42');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('B-Tree initialized (Degree 3).');

  const insertKey = (node: BNode, k: number): BNode => {
    // Highly simplified mock insertion that just drops it in a leaf
    if (node.children.length === 0) {
      const keys = [...node.keys, k].sort((a,b)=>a-b);
      return { ...node, keys };
    }
    const idx = node.keys.findIndex(x => k < x);
    const targetIdx = idx === -1 ? node.keys.length : idx;
    const newChildren = [...node.children];
    newChildren[targetIdx] = insertKey(newChildren[targetIdx], k);
    
    // Simulate split if child overflows
    if (newChildren[targetIdx].keys.length > 3) {
      const overflow = newChildren[targetIdx];
      const mid = overflow.keys[1];
      const left = { id: Date.now(), keys: [overflow.keys[0]], children: [] };
      const right = { id: Date.now()+1, keys: overflow.keys.slice(2), children: [] };
      const newKeys = [...node.keys, mid].sort((a,b)=>a-b);
      newChildren.splice(targetIdx, 1, left, right);
      return { ...node, keys: newKeys, children: newChildren };
    }
    
    return { ...node, children: newChildren };
  };

  const deleteKey = (node: BNode, k: number): BNode => {
    if (node.children.length === 0) {
      return { ...node, keys: node.keys.filter((value) => value !== k) };
    }
    const idx = node.keys.findIndex((value) => value >= k);
    const targetIndex = idx === -1 ? node.children.length - 1 : idx;
    const newChildren = [...node.children];
    newChildren[targetIndex] = deleteKey(newChildren[targetIndex], k);
    const updatedKeys = node.keys.filter((value) => value !== k);
    return { ...node, keys: updatedKeys, children: newChildren };
  };

  const act = () => {
    const val = parseInt(input);
    if (operation === 'Insert') {
      if (isNaN(val)) return;
      const newRoot = insertKey(root, val);
      if (newRoot.keys.length > 3) {
        const mid = newRoot.keys[1];
        const left = { id: Date.now(), keys: [newRoot.keys[0]], children: newRoot.children.slice(0, 2) };
        const right = { id: Date.now()+1, keys: newRoot.keys.slice(2), children: newRoot.children.slice(2) };
        setRoot({ id: Date.now()+2, keys: [mid], children: [left, right] });
        setMessage(`Inserted ${val}. Root overflowed and split!`);
      } else {
        setRoot(newRoot);
        setMessage(`Inserted ${val}.`);
      }
    } else if (operation === 'Delete') {
      if (isNaN(val)) return;
      setRoot(deleteKey(root, val));
      setMessage(`Deleted ${val} from the B-Tree.`);
    } else if (operation === 'Search') {
      setMessage(`Search ${val}: route through the sorted keys at each B-Tree node.`);
    } else {
      setMessage('Split: full nodes are divided around their middle key during insertion.');
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={['Insert', 'Delete', 'Search'].includes(operation) ? [{ label: 'Key', value: input, setValue: setInput, inputMode: 'numeric' }] : []} message={message}>
      <div className="tree-visual" style={{ paddingTop: 30 }}>
        {renderBTree(root)}
      </div>
    </PlaygroundFrame>
  );
}
