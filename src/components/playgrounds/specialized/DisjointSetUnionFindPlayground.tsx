import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

export default function DisjointSetUnionFindPlayground({ structure, onOperationChange }: any) {
  const [parent, setParent] = useState<Record<string, string>>({'A': 'A', 'B': 'A', 'C': 'C', 'D': 'C'});
  const [input, setInput] = useState('B, D');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Forest initialized.');

  const find = (p: Record<string, string>, i: string): string => {
    if (p[i] === i) return i;
    return find(p, p[i]);
  };

  const act = () => {
    const parts = input.split(',').map(s => s.trim()).filter(Boolean);
    if (operation === 'Find') {
      if (!parts[0] || !parent[parts[0]]) { setMessage('Find requires an existing item.'); return; }
      const p = find(parent, parts[0]);
      setMessage(`Root of ${parts[0]} is ${p}. Path compression points it directly to the root.`);
    } else if (operation === 'Union') {
      if (parts.length < 2 || !parent[parts[0]] || !parent[parts[1]]) { setMessage('Union requires two existing items.'); return; }
      const root1 = find(parent, parts[0]);
      const root2 = find(parent, parts[1]);
      if (root1 !== root2) {
        setParent((current) => ({...current, [root2]: root1}));
        setMessage(`Union ${parts[0]} and ${parts[1]}. ${root2} now points to ${root1}.`);
      } else setMessage('Already in same set.');
    } else {
      setParent({'A': 'A', 'B': 'B', 'C': 'C', 'D': 'D'});
      setMessage('Reset.');
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation === 'Find' ? [{ label: 'Item', value: input, setValue: setInput }] : operation === 'Union' ? [{ label: 'First, second', value: input, setValue: setInput, placeholder: 'A, B' }] : []} message={message}>
      <div style={{ display: 'flex', gap: 20, padding: 20 }}>
        {Object.entries(parent).map(([node, p]) => (
          <div key={node} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, border: '2px solid hsl(var(--primary))', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>{node}</div>
            <div style={{ fontSize: 20 }}>↓</div>
            <div style={{ width: 40, height: 40, background: 'hsl(var(--card))', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>{p}</div>
          </div>
        ))}
      </div>
    </PlaygroundFrame>
  );
}
