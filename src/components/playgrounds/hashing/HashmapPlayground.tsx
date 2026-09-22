import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';
import HashMapVisualizer, { HashEntry } from './HashMapVisualizer';

export default function HashmapPlayground({ structure, onOperationChange }: any) {
  const [entries, setEntries] = useState<HashEntry[]>([
    { key: 'apple', value: 'fruit' },
    { key: 'car', value: 'vehicle' },
    { key: 'dog', value: 'animal' }
  ]);
  const [key, setKey] = useState('cat');
  const [value, setValue] = useState('animal');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Hash structure initialized.');

  const act = () => {
    if (operation.includes('Reset') || operation.includes('Clear')) {
      setEntries([]);
      setMessage('Cleared all entries.');
      return;
    }
    
    const trimmedKey = key.trim();
    const trimmedValue = value.trim();

    if (!trimmedKey) {
      setMessage('Please enter a valid key.');
      return;
    }

    if (operation.includes('Add') || operation.includes('Set') || operation.includes('Put')) {
      if (!trimmedValue) {
        setMessage('A value is required when setting a key.');
        return;
      }
      const idx = entries.findIndex(e => e.key === trimmedKey);
      const newEntries = [...entries];
      if (idx >= 0) {
        newEntries[idx] = { key: trimmedKey, value: trimmedValue, color: 'hsl(var(--accent))' };
        setMessage(`Updated ${trimmedKey}.`);
      } else {
        newEntries.push({ key: trimmedKey, value: trimmedValue, color: 'hsl(var(--destructive))' });
        setMessage(`Added ${trimmedKey}.`);
      }
      // Reset colors of others
      newEntries.forEach(e => { if (e.key !== key) e.color = undefined; });
      setEntries(newEntries);
    } else if (operation.includes('Get') || operation.includes('Search') || operation.includes('Check') || operation.includes('Test')) {
      const found = entries.find(e => e.key === trimmedKey);
      if (found) {
        const newEntries = [...entries];
        newEntries.forEach(e => e.color = e.key === trimmedKey ? 'hsl(var(--accent))' : undefined);
        setEntries(newEntries);
        setMessage(`Found ${trimmedKey}${found.value ? ' -> ' + found.value : ''}.`);
      } else {
        setMessage(`${trimmedKey} not found.`);
      }
    } else if (operation.includes('Delete') || operation.includes('Remove')) {
      const filtered = entries.filter(e => e.key !== trimmedKey);
      if (filtered.length < entries.length) {
        setEntries(filtered);
        setMessage(`Removed ${trimmedKey}.`);
      } else {
        setMessage(`${trimmedKey} was not in the structure.`);
      }
    } else {
      setMessage(`Simulated ${operation} on ${trimmedKey}`);
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation.includes('Set') || operation.includes('Put') ? [{ label: 'Key', value: key, setValue: setKey }, { label: 'Value', value, setValue }] : operation.includes('Get') || operation.includes('Search') || operation.includes('Check') || operation.includes('Test') || operation.includes('Delete') || operation.includes('Remove') ? [{ label: 'Key', value: key, setValue: setKey }] : []} message={message}>
      <div style={{ paddingTop: 20 }}>
        <HashMapVisualizer entries={entries} />
      </div>
    </PlaygroundFrame>
  );
}
