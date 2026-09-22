import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

export default function ArrayPlayground({ structure, onOperationChange }: any) {
  const [values, setValues] = useState(['12', '7', '24', '18']);
  const [input, setInput] = useState('42');
  const [index, setIndex] = useState('');
  const [operation, setOperation] = useState('Insert');
  const [highlight, setHighlight] = useState<number | null>(null);
  const [message, setMessage] = useState('Ready for an experiment.');

  const act = () => {
    if (operation === 'Insert') {
      const value = input.trim();
      const rawIndex = Number(index);
      if (!value) {
        setMessage('Insert requires a value before you can place it into the array.');
        return;
      }
      if (!Number.isInteger(rawIndex) || rawIndex < 0 || rawIndex > values.length) {
        setMessage('Insert requires a valid index within the array bounds.');
        return;
      }
      const next = [...values];
      next.splice(rawIndex, 0, value);
      setValues(next);
      setMessage(`Inserted ${value} at index ${rawIndex}.`);
      return;
    }
    if (operation === 'Delete') {
      if (!values.length) {
        setMessage('Delete: the array is empty.');
        return;
      }
      const rawIndex = Number(index);
      if (!Number.isInteger(rawIndex) || rawIndex < 0 || rawIndex >= values.length) {
        setMessage('Delete requires a valid index in the current array range.');
        return;
      }
      const next = [...values];
      const removed = next.splice(rawIndex, 1);
      setValues(next);
      setMessage(`Removed ${removed[0]} from index ${rawIndex} and shifted the rest.`);
      return;
    }
    if (operation === 'Search') {
      const value = input.trim();
      if (!value) {
        setMessage('Search requires a value to look up.');
        return;
      }
      const found = values.indexOf(value);
      setHighlight(found < 0 ? null : found);
      setMessage(found < 0 ? `${value} is not in the array.` : `Found ${value} at index ${found}.`);
      return;
    }
    if (operation === 'Traverse') {
      setHighlight(null);
      setMessage(`Traversed ${values.length} cells from left to right.`);
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation === 'Insert' ? [{ label: 'Value', value: input, setValue: setInput }, { label: 'Index', value: index, setValue: setIndex, inputMode: 'numeric' }] : operation === 'Delete' ? [{ label: 'Index', value: index, setValue: setIndex, inputMode: 'numeric' }] : operation === 'Search' ? [{ label: 'Value', value: input, setValue: setInput }] : []} message={message}>
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
