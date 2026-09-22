import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

export default function DynamicArrayPlayground({ structure, onOperationChange }: any) {
  const [values, setValues] = useState<string[]>(['1', '2']);
  const [capacity, setCapacity] = useState(4);
  const [input, setInput] = useState('42');
  const [operation, setOperation] = useState('Append');
  const [message, setMessage] = useState('Capacity doubles when full.');

  const act = () => {
    if (operation === 'Append') {
      const next = [...values, input || '0'];
      if (next.length > capacity) {
        setCapacity(capacity * 2);
        setMessage(`Array was full! Doubled capacity to ${capacity * 2} and appended ${input}.`);
      } else {
        setMessage(`Appended ${input}. Array is at ${next.length}/${capacity} capacity.`);
      }
      setValues(next);
    }
    if (operation === 'Remove') {
      if (values.length) {
        const next = values.slice(0, -1);
        setValues(next);
        setMessage(`Removed the last element. Array is at ${next.length}/${capacity} capacity.`);
      } else setMessage('Array is empty.');
    }
    if (operation === 'Search') {
      const found = values.indexOf(input);
      setMessage(found < 0 ? `${input} not found.` : `Found ${input} at index ${found}.`);
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation === 'Append' || operation === 'Search' ? [{ label: 'Value', value: input, setValue: setInput }] : []} message={message}>
      <div className="array-visual">
        {Array.from({ length: capacity }).map((_, i) => (
          <div className="array-cell" key={i} style={{ opacity: i < values.length ? 1 : 0.3, borderStyle: i < values.length ? 'solid' : 'dashed' }}>
            {i < values.length ? values[i] : <span style={{ color: 'transparent' }}>_</span>}
            <span className="array-index">[{i}]</span>
          </div>
        ))}
      </div>
    </PlaygroundFrame>
  );
}
