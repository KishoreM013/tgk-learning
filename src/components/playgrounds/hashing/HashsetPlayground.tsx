import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';
import HashMapVisualizer, { HashEntry } from './HashMapVisualizer';

export default function HashsetPlayground({ structure, onOperationChange }: any) {
  const [entries, setEntries] = useState<HashEntry[]>([
    { key: 'apple', value: '' },
    { key: 'car', value: '' },
    { key: 'dog', value: '' }
  ]);
  const [input, setInput] = useState('cat');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Hash structure initialized.');

  const act = () => {
    if (operation.includes('Reset') || operation.includes('Clear')) {
      setEntries([]);
      setMessage('Cleared all entries.');
      return;
    }
    
    const key = input.trim();

    if (!key) {
      setMessage('Please enter a valid key.');
      return;
    }

    if (operation.includes('Add') || operation.includes('Set') || operation.includes('Put')) {
      const idx = entries.findIndex(e => e.key === key);
      const newEntries = [...entries];
      if (idx >= 0) {
        newEntries[idx] = { key, value: '', color: 'hsl(var(--accent))' };
        setMessage(`Updated ${key}.`);
      } else {
        newEntries.push({ key, value: '', color: 'hsl(var(--destructive))' });
        setMessage(`Added ${key}.`);
      }
      // Reset colors of others
      newEntries.forEach(e => { if (e.key !== key) e.color = undefined; });
      setEntries(newEntries);
    } else if (operation.includes('Get') || operation.includes('Search') || operation.includes('Check') || operation.includes('Test')) {
      const found = entries.find(e => e.key === key);
      if (found) {
        const newEntries = [...entries];
        newEntries.forEach(e => e.color = e.key === key ? 'hsl(var(--accent))' : undefined);
        setEntries(newEntries);
        setMessage(`Found ${key}${found.value ? ' -> ' + found.value : ''}.`);
      } else {
        setMessage(`${key} not found.`);
      }
    } else if (operation.includes('Delete') || operation.includes('Remove')) {
      const filtered = entries.filter(e => e.key !== key);
      if (filtered.length < entries.length) {
        setEntries(filtered);
        setMessage(`Removed ${key}.`);
      } else {
        setMessage(`${key} was not in the structure.`);
      }
    } else {
      setMessage(`Simulated ${operation} on ${key}`);
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation.includes('Add') || operation.includes('Has') || operation.includes('Delete') ? [{ label: 'Value', value: input, setValue: setInput }] : []} message={message}>
      <div style={{ paddingTop: 20 }}>
        <HashMapVisualizer entries={entries} />
      </div>
    </PlaygroundFrame>
  );
}
