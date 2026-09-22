import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

export default function QueuePlayground({ structure, onOperationChange }: any) {
  const [values, setValues] = useState(['Ada', 'Linus', 'Grace']);
  const [input, setInput] = useState('Katherine');
  const [operation, setOperation] = useState('Enqueue');
  const [message, setMessage] = useState('The oldest arrival leaves first.');

  const act = () => {
    if (operation === 'Enqueue') { setValues((v) => [...v, input || 'guest']); setMessage(`${input || 'guest'} joined at the tail.`); }
    if (operation === 'Dequeue') { if (values.length) { setMessage(`${values[0]} left from the head.`); setValues((v) => v.slice(1)); } }
    if (operation === 'Peek') setMessage(values.length ? `${values[0]} is next.` : 'The queue is empty.');
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation === 'Enqueue' ? [{ label: 'Item', value: input, setValue: setInput }] : []} message={message}>
      <div className="queue-visual">
        <span style={{ font: '10px var(--app-font-mono)', color: 'hsl(var(--muted-foreground))' }}>HEAD</span>
        {values.map((value, i) => <span className="queue-cell" key={`${value}-${i}`}>{value}</span>)}
        <span style={{ font: '10px var(--app-font-mono)', color: 'hsl(var(--muted-foreground))' }}>TAIL</span>
      </div>
    </PlaygroundFrame>
  );
}
