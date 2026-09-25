import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

export default function DequePlayground({ structure, onOperationChange }: any) {
  const [values, setValues] = useState(['Item 1', 'Item 2']);
  const [input, setInput] = useState('Item 3');
  const [operation, setOperation] = useState('Push back');
  const [message, setMessage] = useState('Elements can be added or removed from either end.');

  const act = () => {
    if (operation === 'Push back') { setValues((v) => [...v, input || 'Item']); setMessage(`Pushed ${input || 'Item'} to the back.`); }
    if (operation === 'Push front') { setValues((v) => [input || 'Item', ...v]); setMessage(`Pushed ${input || 'Item'} to the front.`); }
    if (operation === 'Pop back') { if (values.length) { setMessage(`Popped ${values[values.length - 1]} from the back.`); setValues((v) => v.slice(0, -1)); } else setMessage('The deque is empty.'); }
    if (operation === 'Pop front') { if (values.length) { setMessage(`Popped ${values[0]} from the front.`); setValues((v) => v.slice(1)); } else setMessage('The deque is empty.'); }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation.includes('Push') ? [{ label: 'Item', value: input, setValue: setInput }] : []} message={message}>
      <div className="queue-visual">
        <span style={{ font: '10px var(--app-font-mono)', color: 'hsl(var(--muted-foreground))' }}>FRONT</span>
        {values.map((value, i) => <span className="queue-cell" key={`${value}-${i}`}>{value}</span>)}
        <span style={{ font: '10px var(--app-font-mono)', color: 'hsl(var(--muted-foreground))' }}>BACK</span>
      </div>
    </PlaygroundFrame>
  );
}
