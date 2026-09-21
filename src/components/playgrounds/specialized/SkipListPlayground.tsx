import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

type SkipNode = { val: number; next: (SkipNode | null)[] };

export default function SkipListPlayground({ structure, onOperationChange }: any) {
  const [head, setHead] = useState<SkipNode>(() => ({ val: -Infinity, next: [null, null, null] }));
  const [input, setInput] = useState('42');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Skip List initialized with 3 levels.');

  const act = () => {
    const val = parseInt(input);
    if (isNaN(val)) return;

    if (operation === 'Insert') {
      const newHead = { ...head, next: [...head.next] };
      const update: SkipNode[] = [newHead, newHead, newHead];
      let current = newHead;

      for (let i = 2; i >= 0; i--) {
        while (current.next[i] && current.next[i]!.val < val) {
          current = current.next[i]!;
        }
        update[i] = current;
      }
      
      const currentAt0 = current.next[0];
      if (currentAt0 && currentAt0.val === val) {
        setMessage(`\${val} is already in the skip list.`);
        return;
      }
      
      let newLevel = 1;
      while (Math.random() < 0.5 && newLevel < 3) newLevel++;
      
      const newNode: SkipNode = { val, next: [null, null, null] };
      for (let i = 0; i < newLevel; i++) {
        newNode.next[i] = update[i].next[i];
        update[i].next[i] = newNode;
      }
      setHead(newHead);
      setMessage(`Inserted \${val} with height \${newLevel}.`);
    } else if (operation === 'Search') {
      let current = head;
      for (let i = 2; i >= 0; i--) {
        while (current.next[i] && current.next[i]!.val < val) current = current.next[i]!;
      }
      if (current.next[0] && current.next[0]!.val === val) setMessage(`Found \${val}.`);
      else setMessage(`\${val} not found.`);
    } else {
      setHead({ val: -Infinity, next: [null, null, null] });
      setMessage('Reset.');
    }
  };

  const getNodes = () => {
    const nodes: number[] = [];
    let curr = head.next[0];
    while (curr) { nodes.push(curr.val); curr = curr.next[0]; }
    return nodes;
  };
  const nodes = getNodes();

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
      <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 20, padding: 20, overflowX: 'auto' }}>
        {[0, 1, 2].map(level => {
          let curr = head.next[level];
          return (
            <div key={level} style={{ display: 'flex', gap: 20, minHeight: 40, alignItems: 'center' }}>
              <div style={{ width: 40, color: 'hsl(var(--muted-foreground))' }}>L{level}</div>
              <div style={{ width: 50, height: 30, background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', display: 'grid', placeItems: 'center', borderRadius: 4 }}>-∞</div>
              <div style={{ flex: 1, display: 'flex', gap: 20, position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: -20, right: 0, height: 2, background: 'hsl(var(--border))', zIndex: -1 }} />
                {nodes.map(n => {
                  const active = curr && curr.val === n;
                  if (active) curr = curr!.next[level];
                  return (
                    <div key={n} style={{ width: 50, height: 30, background: active ? 'hsl(var(--card))' : 'transparent', border: active ? '2px solid hsl(var(--primary))' : 'none', color: 'hsl(var(--primary))', display: 'grid', placeItems: 'center', borderRadius: 4 }}>
                      {active ? n : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </PlaygroundFrame>
  );
}
