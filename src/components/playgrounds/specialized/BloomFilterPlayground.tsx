import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

export default function BloomFilterPlayground({ structure, onOperationChange }: any) {
  const [bits, setBits] = useState<boolean[]>(new Array(16).fill(false));
  const [input, setInput] = useState('apple');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Bloom filter initialized.');

  const getHashes = (str: string) => {
    let h1 = 0, h2 = 0;
    for (let i = 0; i < str.length; i++) { h1 += str.charCodeAt(i); h2 += str.charCodeAt(i) * 3; }
    return [h1 % 16, h2 % 16, (h1 + h2) % 16];
  };

  const act = () => {
    if (!input) return;
    const indices = getHashes(input);
    if (operation === 'Add') {
      const copy = [...bits];
      indices.forEach(i => copy[i] = true);
      setBits(copy);
      setMessage(`Added "${input}". Hashed to bits: ${indices.join(', ')}`);
    } else if (operation === 'Check') {
      const found = indices.every(i => bits[i]);
      if (found) setMessage(`"${input}" is PROBABLY in the set (bits ${indices.join(', ')} are 1).`);
      else setMessage(`"${input}" is DEFINITELY NOT in the set.`);
    } else {
      setBits(new Array(16).fill(false));
      setMessage('Reset bloom filter.');
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation === 'Add' || operation === 'Check' ? [{ label: 'Value', value: input, setValue: setInput }] : []} message={message}>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', padding: 20 }}>
        {bits.map((b, i) => (
          <div key={i} style={{ width: 40, height: 40, background: b ? 'hsl(var(--primary))' : 'hsl(var(--card))', color: b ? 'hsl(var(--primary-foreground))' : 'hsl(var(--muted-foreground))', display: 'grid', placeItems: 'center', border: '1px solid hsl(var(--border))', borderRadius: 4, font: '12px var(--app-font-mono)' }}>
            {i}
          </div>
        ))}
      </div>
    </PlaygroundFrame>
  );
}
