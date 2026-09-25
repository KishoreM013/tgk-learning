import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

export default function StackPlayground({ structure, onOperationChange }: any) {
  const [values, setValues] = useState(['base', 'parse', 'render']);
  const [input, setInput] = useState('commit');
  const [operation, setOperation] = useState('Push');
  const [message, setMessage] = useState('Top is the only door in.');

  const act = () => {
    if (operation === 'Push') { setValues((v) => [...v, input || 'item']); setMessage(`Pushed ${input || 'item'} onto the top.`); }
    if (operation === 'Pop') { if (values.length) { setMessage(`Popped ${values[values.length - 1]} from the top.`); setValues((v) => v.slice(0, -1)); } else setMessage('The stack is empty.'); }
    if (operation === 'Peek') setMessage(values.length ? `Peek sees ${values[values.length - 1]}.` : 'The stack is empty.');
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation === 'Push' ? [{ label: 'Item', value: input, setValue: setInput }] : []} message={message}>
      <div className="stack-visual">
        {values.map((value, i) => (
          <div className="stack-cell" key={`${value}-${i}`}>{value}</div>
        ))}
      </div>
    </PlaygroundFrame>
  );
}
