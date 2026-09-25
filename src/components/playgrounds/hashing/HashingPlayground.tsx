import { useMemo, useState } from 'react';
import PlaygroundFrame, { type PlaygroundField } from '../PlaygroundFrame';

type Entry = { key: string; value: string };
type HashMode = 'sum' | 'djb2' | 'length';

const hashDetails: Record<HashMode, { label: string; formula: string }> = {
  sum: { label: 'Character sum', formula: 'sum(charCode(key)) mod bucketCount' },
  djb2: { label: 'DJB2', formula: 'hash = hash * 33 + charCode(key) mod bucketCount' },
  length: { label: 'Length mix', formula: 'key.length * 31 mod bucketCount' },
};

function hashKey(key: string, mode: HashMode, bucketCount: number) {
  if (mode === 'length') return (key.length * 31) % bucketCount;
  let hash = mode === 'djb2' ? 5381 : 0;
  for (const char of key) hash = mode === 'djb2' ? hash * 33 + char.charCodeAt(0) : hash + char.charCodeAt(0);
  return Math.abs(hash) % bucketCount;
}

export default function HashingPlayground({ structure, onOperationChange }: any) {
  const title = structure.title as string;
  const isSet = /Set$/.test(title) || title === 'BitSet';
  const isMultiset = title === 'Multiset';
  const isMultimap = title === 'Multimap';
  const [entries, setEntries] = useState<Entry[]>([
    { key: 'apple', value: isSet ? '' : 'fruit' },
    { key: 'car', value: isSet ? '' : 'vehicle' },
    { key: 'dog', value: isSet ? '' : 'animal' },
  ]);
  const [key, setKey] = useState(isSet || title === 'BitSet' ? '5' : 'cat');
  const [value, setValue] = useState(isMultiset ? '1' : 'animal');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [hashMode, setHashMode] = useState<HashMode>('sum');
  const [bucketCount, setBucketCount] = useState('8');
  const [message, setMessage] = useState('Hash table initialized. Try keys such as "ab" and "ba" to create a collision.');
  const buckets = Math.max(2, Math.min(32, Number(bucketCount) || 8));

  const bucketed = useMemo(() => Array.from({ length: buckets }, (_, index) => ({ index, entries: entries.filter((entry) => hashKey(entry.key, hashMode, buckets) === index) })), [buckets, entries, hashMode]);
  const fieldList: PlaygroundField[] = (() => {
    if (operation === 'Reset' || operation === 'Clear' || operation === 'First' || operation === 'Range') return [];
    if (isMultimap && (operation === 'Add value' || operation === 'Delete value')) return [{ label: 'Key', value: key, setValue: setKey }, { label: 'Value', value, setValue }];
    if ((isSet || title === 'BitSet') && (operation === 'Add' || operation === 'Set bit' || operation === 'Test bit' || operation === 'Clear bit')) return [{ label: title === 'BitSet' ? 'Bit index' : 'Value', value: key, setValue: setKey, inputMode: 'numeric' }];
    if (isMultiset && operation === 'Add count') return [{ label: 'Value', value: key, setValue: setKey }, { label: 'Count', value, setValue, inputMode: 'numeric' }];
    if (isMultiset && operation === 'Count') return [{ label: 'Value', value: key, setValue: setKey }];
    if (operation.includes('Set') || operation.includes('Put')) return [{ label: 'Key', value: key, setValue: setKey }, { label: 'Value', value, setValue }];
    return [{ label: isSet || title === 'BitSet' ? 'Value' : 'Key', value: key, setValue: setKey, inputMode: title === 'BitSet' ? 'numeric' : 'text' }];
  })();

  const act = () => {
    const trimmedKey = key.trim();
    const trimmedValue = value.trim();
    if (!trimmedKey && operation !== 'Reset' && operation !== 'Clear') { setMessage('This operation requires a non-empty key or value.'); return; }
    if (operation === 'Reset' || operation === 'Clear') { setEntries([]); setMessage('Cleared every bucket.'); return; }
    if (operation === 'First') { const first = [...entries].sort((a, b) => a.key.localeCompare(b.key))[0]; setMessage(first ? `First ordered key: ${first.key}.` : 'The structure is empty.'); return; }
    if (operation === 'Range') { setMessage(`Ordered range view: ${[...entries].sort((a, b) => a.key.localeCompare(b.key)).map((entry) => entry.key).join(' -> ') || 'empty'}.`); return; }
    if (operation === 'Set bit' || operation === 'Test bit' || operation === 'Clear bit') {
      const bit = Number(trimmedKey);
      if (!Number.isInteger(bit) || bit < 0 || bit >= 32) { setMessage('Bit index must be an integer from 0 to 31.'); return; }
      const exists = entries.some((entry) => entry.key === String(bit));
      if (operation === 'Set bit') setEntries((current) => exists ? current : [...current, { key: String(bit), value: '' }]);
      if (operation === 'Clear bit') setEntries((current) => current.filter((entry) => entry.key !== String(bit)));
      setMessage(operation === 'Test bit' ? `Bit ${bit} is ${exists ? 'set' : 'clear'}.` : operation === 'Clear bit' ? `Cleared bit ${bit}.` : `Set bit ${bit}.`);
      return;
    }
    if (operation === 'Add count') {
      const count = Number(trimmedValue);
      if (!Number.isInteger(count) || count <= 0) { setMessage('Count must be a positive integer.'); return; }
      setEntries((current) => { const existing = current.find((entry) => entry.key === trimmedKey); return existing ? current.map((entry) => entry.key === trimmedKey ? { ...entry, value: String(Number(entry.value) + count) } : entry) : [...current, { key: trimmedKey, value: String(count) }]; });
      setMessage(`Added ${count} occurrence${count === 1 ? '' : 's'} of ${trimmedKey}.`);
      return;
    }
    if (operation === 'Count') { setMessage(`${trimmedKey} appears ${entries.find((entry) => entry.key === trimmedKey)?.value ?? '0'} time(s).`); return; }
    if (operation === 'Add value') { setEntries((current) => [...current, { key: trimmedKey, value: trimmedValue }]); setMessage(`Added value ${trimmedValue} under key ${trimmedKey}.`); return; }
    if (operation === 'Delete value') { const index = entries.findIndex((entry) => entry.key === trimmedKey && entry.value === trimmedValue); if (index < 0) { setMessage(`No value ${trimmedValue} exists under ${trimmedKey}.`); return; } setEntries((current) => current.filter((_, entryIndex) => entryIndex !== index)); setMessage(`Deleted value ${trimmedValue} from ${trimmedKey}.`); return; }
    if (operation.includes('Set') || operation.includes('Put')) { setEntries((current) => current.some((entry) => entry.key === trimmedKey) ? current.map((entry) => entry.key === trimmedKey ? { key: trimmedKey, value: trimmedValue } : entry) : [...current, { key: trimmedKey, value: trimmedValue }]); setMessage(`Stored ${trimmedKey} in bucket ${hashKey(trimmedKey, hashMode, buckets)}.`); return; }
    if (operation.includes('Get') || operation.includes('Read') || operation.includes('Has') || operation.includes('Check') || operation.includes('Search')) { const found = entries.filter((entry) => entry.key === trimmedKey); setMessage(found.length ? `Found ${trimmedKey}${found[0].value ? ` -> ${found.map((entry) => entry.value).join(', ')}` : ''} in bucket ${hashKey(trimmedKey, hashMode, buckets)}.` : `${trimmedKey} was not found.`); return; }
    if (operation.includes('Delete') || operation.includes('Remove')) { const next = entries.filter((entry) => entry.key !== trimmedKey); setEntries(next); setMessage(next.length === entries.length ? `${trimmedKey} was not present.` : `Removed ${trimmedKey}.`); return; }
    setMessage(`${operation} completed for ${trimmedKey}.`);
  };

  return <PlaygroundFrame title={title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={fieldList} message={message}>
    <div style={{ display: 'grid', gap: 14, width: 'min(680px, 100%)', padding: 20 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'end' }}>
        <label className="lab-control-field"><span>Hash function</span><select className="field-select" value={hashMode} onChange={(event) => setHashMode(event.target.value as HashMode)}><option value="sum">Character sum</option><option value="djb2">DJB2</option><option value="length">Length mix</option></select></label>
        <label className="lab-control-field"><span>Bucket count</span><input className="field-input" type="number" min="2" max="32" value={bucketCount} onChange={(event) => setBucketCount(event.target.value)} /></label>
        <div style={{ color: 'hsl(var(--muted-foreground))', font: '11px/1.5 var(--app-font-mono)', maxWidth: 360 }}>{hashDetails[hashMode].formula}</div>
      </div>
      {bucketed.map((bucket) => <div key={bucket.index} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 10, alignItems: 'center' }}><span style={{ color: 'hsl(var(--muted-foreground))', font: '11px var(--app-font-mono)' }}>[{bucket.index}]</span><div style={{ minHeight: 44, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', padding: 8, border: '1px solid hsl(var(--border))', borderRadius: 6, background: 'hsl(var(--card))' }}>{bucket.entries.length ? bucket.entries.map((entry, index) => <span key={`${entry.key}-${index}`} style={{ padding: '5px 8px', borderRadius: 4, color: 'hsl(var(--primary-foreground))', background: index > 0 ? 'hsl(var(--accent))' : 'hsl(var(--primary))', font: '11px var(--app-font-mono)' }}>{entry.key}{entry.value ? `: ${entry.value}` : ''}</span>) : <span style={{ opacity: .35, font: '11px var(--app-font-mono)' }}>empty</span>}</div></div>)}
      <div style={{ color: 'hsl(var(--muted-foreground))', font: '11px var(--app-font-mono)' }}>Collisions are shown as multiple entries in one bucket. Changing the hash function or bucket count changes where keys land.</div>
    </div>
  </PlaygroundFrame>;
}
