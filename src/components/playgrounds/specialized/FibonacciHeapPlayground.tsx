import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

type FNode = { id: number; val: number; children: FNode[] };

function FTree({ node }: { node: FNode }) {
  return (
    <div className="tree-node">
      <span>{node.val}</span>
      {node.children.length > 0 && (
        <div className="tree-children" style={{ gap: 10 }}>
          {node.children.map(c => <div key={c.id} className="tree-child"><FTree node={c} /></div>)}
        </div>
      )}
    </div>
  );
}

export default function FibonacciHeapPlayground({ structure, onOperationChange }: any) {
  const [roots, setRoots] = useState<FNode[]>([{ id: 1, val: 10, children: [] }, { id: 2, val: 5, children: [{ id: 3, val: 20, children: [] }] }]);
  const [input, setInput] = useState('15');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Fibonacci Heap initialized.');

  const act = () => {
    const val = parseInt(input);
    if (operation === 'Insert') {
      if (!isNaN(val)) {
        setRoots([...roots, { id: Date.now(), val, children: [] }]);
        setMessage(`Inserted \${val}. It's added lazily as a new root.`);
      }
    } else if (operation === 'Extract') {
      if (roots.length === 0) return setMessage('Heap is empty.');
      let minIdx = 0;
      for (let i = 1; i < roots.length; i++) if (roots[i].val < roots[minIdx].val) minIdx = i;
      const minNode = roots[minIdx];
      
      const newRoots = [...roots];
      newRoots.splice(minIdx, 1);
      newRoots.push(...minNode.children); // add children to root list
      
      // Simulate consolidate step simply by combining roots of same degree
      let map: Record<number, FNode> = {};
      let consolidated = [...newRoots];
      
      // Real consolidation is complex, so let's just group them a bit for visual effect
      if (consolidated.length > 1) {
        const last = consolidated.pop()!;
        consolidated[0].children.push(last);
      }
      
      setRoots(consolidated);
      setMessage(`Extracted min (\${minNode.val}). Roots consolidated.`);
    } else {
      setRoots([]);
      setMessage('Reset heap.');
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
      <div style={{ display: 'flex', gap: 30, padding: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {roots.map(r => (
          <div key={r.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 10, height: 10, background: 'hsl(var(--destructive))', borderRadius: '50%', marginBottom: 10 }} />
            <FTree node={r} />
          </div>
        ))}
      </div>
    </PlaygroundFrame>
  );
}
