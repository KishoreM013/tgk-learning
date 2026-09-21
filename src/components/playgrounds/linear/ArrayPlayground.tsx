import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

export default function ArrayPlayground({ structure, onOperationChange }: any) {
  const [values, setValues] = useState(['12', '7', '24', '18']);
  const [input, setInput] = useState('42');
  const [index, setIndex] = useState('2');
  const [operation, setOperation] = useState('Insert');
  const [highlight, setHighlight] = useState<number | null>(null);
  const [message, setMessage] = useState('Ready for an experiment.');

  const act = () => {
    const i = Math.max(0, Math.min(values.length, Number(index) || 0));
    if (operation === 'Insert') { const next = [...values]; next.splice(i, 0, input || '0'); setValues(next); setMessage(`Inserted ${input || '0'} at index ${i}.`); }
    if (operation === 'Delete') { if (!values.length) return; const next = [...values]; const removed = next.splice(i >= values.length ? values.length - 1 : i, 1); setValues(next); setMessage(`Removed ${removed[0]} and shifted the rest.`); }
    if (operation === 'Search') { const found = values.indexOf(input); setHighlight(found < 0 ? null : found); setMessage(found < 0 ? `${input} is not in the array.` : `Found ${input} at index ${found}.`); }
    if (operation === 'Traverse') { setHighlight(null); setMessage(`Traversed ${values.length} cells from left to right.`); }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} index={index} setIndex={setIndex} message={message}>
      <div className="array-visual">
        {values.map((value, i) => (
          <div className={highlight === i ? 'array-cell highlight' : 'array-cell'} key={`${value}-${i}`}>
            {value}<span className="array-index">[{i}]</span>
          </div>
        ))}
      </div>
    </PlaygroundFrame>
  );
}
