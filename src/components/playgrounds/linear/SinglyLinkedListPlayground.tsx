import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

export default function SinglyLinkedListPlayground({ structure, onOperationChange }: any) {
  const [values, setValues] = useState(['Head', 'Node 1', 'Tail']);
  const [input, setInput] = useState('New Node');
  const [operation, setOperation] = useState('Insert');
  const [message, setMessage] = useState('Nodes are connected sequentially.');

  const act = () => {
    if (operation === 'Insert') { setValues((v) => { const next = [...v]; next.splice(v.length - 1, 0, input || 'Node'); return next; }); setMessage(`Inserted ${input || 'Node'} into the list.`); }
    if (operation === 'Delete') { if (values.length > 2) { setValues((v) => { const next = [...v]; next.splice(v.length - 2, 1); return next; }); setMessage('Deleted a node from the list.'); } else setMessage('List is too short to delete.'); }
    if (operation === 'Traverse') setMessage(`Traversed list of size ${values.length}.`);
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
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
