import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

export default function LruCachePlayground({ structure, onOperationChange }: any) {
  const [items, setItems] = useState<{k: string, v: string}[]>([{k: 'A', v: '1'}, {k: 'B', v: '2'}, {k: 'C', v: '3'}]);
  const [input, setInput] = useState('D, 4');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('LRU Cache (Capacity: 4). Left is most recent, right is oldest.');

  const act = () => {
    const parts = input.split(',');
    const k = parts[0]?.trim();
    const v = parts[1]?.trim() || '';
    
    if (operation === 'Get') {
      const idx = items.findIndex(x => x.k === k);
      if (idx >= 0) {
        const copy = [...items];
        const [found] = copy.splice(idx, 1);
        setItems([found, ...copy]);
        setMessage(`Got \${k}. Moved to front.`);
      } else setMessage(`\${k} not in cache.`);
    } else if (operation === 'Set') {
      const idx = items.findIndex(x => x.k === k);
      let copy = [...items];
      if (idx >= 0) {
        copy.splice(idx, 1);
        copy = [{k, v}, ...copy];
        setMessage(`Updated \${k} and moved to front.`);
      } else {
        copy = [{k, v}, ...copy];
        if (copy.length > 4) {
          copy.pop();
          setMessage(`Added \${k}. Evicted oldest item to stay under capacity 4.`);
        } else {
          setMessage(`Added \${k}.`);
        }
      }
      setItems(copy);
    } else {
      if (items.length > 0) {
        setItems(items.slice(0, -1));
        setMessage('Evicted oldest item.');
      } else setMessage('Cache empty.');
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
      <div style={{ display: 'flex', gap: 10, padding: 20 }}>
        {items.map((it, i) => (
          <div key={it.k} style={{ padding: '10px 20px', background: i === 0 ? 'hsl(var(--accent))' : 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>{it.k}</span>
            <span style={{ fontSize: 12, opacity: 0.7 }}>{it.v}</span>
          </div>
        ))}
      </div>
    </PlaygroundFrame>
  );
}
