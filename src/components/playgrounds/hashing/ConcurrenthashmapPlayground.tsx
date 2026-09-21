import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';
import HashMapVisualizer, { HashEntry } from '../hashing/HashMapVisualizer';

export default function ConcurrenthashmapPlayground({ structure, onOperationChange }: any) {
  const [entries, setEntries] = useState<HashEntry[]>([
    { key: 'session1', value: 'active' },
  ]);
  const [input, setInput] = useState('session2, active');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Structure initialized.');

  const act = () => {
    if (operation.includes('Reset') || operation.includes('Clear')) {
      setEntries([]);
      setMessage('Cleared all entries.');
      return;
    }
    
    const parts = input.split(',');
    const key = parts[0]?.trim();
    const val = parts[1]?.trim() || '';

    if (!key) {
      setMessage('Please enter a valid key.');
      return;
    }

    if (operation.includes('Add') || operation.includes('Set') || operation.includes('Put')) {
      const idx = entries.findIndex(e => e.key === key);
      const newEntries = [...entries];
      if (idx >= 0) {
        newEntries[idx] = { key, value: val, color: 'hsl(var(--accent))' };
        setMessage(`Updated ${key}.`);
      } else {
        newEntries.push({ key, value: val, color: 'hsl(var(--destructive))' });
        setMessage(`Added ${key}.`);
      }
      newEntries.forEach(e => { if (e.key !== key) e.color = undefined; });
      setEntries(newEntries);
    } else {
      setMessage(`Simulated ${operation} on ${key}`);
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
      <div style={{ paddingTop: 20 }}>
        <HashMapVisualizer entries={entries} />
      </div>
    </PlaygroundFrame>
  );
}
