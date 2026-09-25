import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

export default function SinglyLinkedListPlayground({ structure, onOperationChange }: any) {
  const [values, setValues] = useState(['Head', 'Node 1', 'Tail']);
  const [input, setInput] = useState('New Node');
  const [index, setIndex] = useState('0');
  const [operation, setOperation] = useState('Insert');
  const [message, setMessage] = useState('Nodes are connected sequentially.');

  const act = () => {
    if (operation === 'Insert') { setValues((v) => { const next = [...v]; next.splice(v.length - 1, 0, input || 'Node'); return next; }); setMessage(`Inserted ${input || 'Node'} into the list.`); }
    if (operation === 'Delete') {
      const target = Number(index);
      if (!Number.isInteger(target) || target < 0 || target >= values.length - 2) { setMessage('Delete requires a valid node index.'); return; }
      const removed = values[target + 1];
      setValues((v) => { const next = [...v]; next.splice(target + 1, 1); return next; });
      setMessage(`Deleted ${removed} at node index ${target}.`);
    }
    if (operation === 'Traverse') setMessage(`Traversed list of size ${values.length}.`);
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation === 'Insert' ? [{ label: 'Node value', value: input, setValue: setInput }] : operation === 'Delete' ? [{ label: 'Index', value: index, setValue: setIndex, inputMode: 'numeric' }] : []} message={message}>
      <div className="queue-visual">
        {values.map((value, i) => (
          <span key={`${value}-${i}`} style={{ display: 'flex', alignItems: 'center' }}>
            <span className="stack-cell">{value}</span>
            {i < values.length - 1 && <span style={{ padding: '0 10px', color: 'hsl(var(--muted-foreground))' }}>→</span>}
          </span>
        ))}
      </div>
    </PlaygroundFrame>
  );
}
