import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

export default function CopyonwritearraylistPlayground({ structure, onOperationChange }: any) {
  const [items, setItems] = useState<string[]>(['Version 1', 'Version 2']);
  const [input, setInput] = useState('Version 3');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Array initialized.');

  const act = () => {
    if (operation === 'Append') {
      const copy = [...items, input];
      setItems(copy);
      setMessage(`Appended ${input}. Under the hood, a full copy was made.`);
    } else if (operation === 'Snapshot') {
      setMessage(`Snapshot taken of ${items.length} items.`);
    } else {
      setItems([]);
      setMessage('Reset.');
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation === 'Append' ? [{ label: 'Value', value: input, setValue: setInput }] : []} message={message}>
      <div style={{ display: 'flex', gap: 10, padding: 20 }}>
        {items.map((it, i) => (
          <div key={i} style={{ padding: '10px 20px', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6 }}>
            {it}
          </div>
        ))}
      </div>
    </PlaygroundFrame>
  );
}
