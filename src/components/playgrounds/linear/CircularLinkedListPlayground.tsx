import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

export default function CircularLinkedListPlayground({ structure, onOperationChange }: any) {
  const [values, setValues] = useState(['Node 1', 'Node 2', 'Node 3']);
  const [input, setInput] = useState('Node 4');
  const [operation, setOperation] = useState('Insert');
  const [message, setMessage] = useState('The tail points back to the head.');

  const act = () => {
    if (operation === 'Insert') {
      setValues((v) => [...v, input || 'Node']);
      setMessage(`Inserted ${input || 'Node'} into the circular list.`);
    }
    if (operation === 'Traverse') {
      setMessage(`Traversing infinitely: ${values.join(' → ')} → ${values[0]}...`);
    }
    if (operation === 'Reset') {
      setValues(['Node 1']);
      setMessage('Reset to a single node.');
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
      <div className="queue-visual" style={{ position: 'relative', display: 'flex', gap: 20, alignItems: 'center' }}>
        {values.map((value, i) => (
          <span key={`${value}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <span className="stack-cell">{value}</span>
            <span style={{ color: 'hsl(var(--muted-foreground))' }}>→</span>
          </span>
        ))}
        {values.length > 0 && (
          <div style={{ position: 'absolute', top: -30, left: 20, right: 20, height: 20, borderTop: '2px dashed hsl(var(--muted-foreground))', borderLeft: '2px dashed hsl(var(--muted-foreground))', borderRight: '2px dashed hsl(var(--muted-foreground))', borderRadius: '10px 10px 0 0' }}></div>
        )}
      </div>
    </PlaygroundFrame>
  );
}
