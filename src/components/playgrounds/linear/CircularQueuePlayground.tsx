import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

export default function CircularQueuePlayground({ structure, onOperationChange }: any) {
  const [buffer, setBuffer] = useState<(string | null)[]>([null, 'A', 'B', 'C', null]);
  const [head, setHead] = useState(1);
  const [tail, setTail] = useState(4); // tail is next insertion point
  const [input, setInput] = useState('D');
  const [operation, setOperation] = useState('Enqueue');
  const [message, setMessage] = useState('A fixed buffer that wraps around.');

  const act = () => {
    if (operation === 'Enqueue') {
      if ((tail + 1) % buffer.length === head) {
        setMessage('Queue is full!');
      } else {
        const next = [...buffer];
        next[tail] = input || 'X';
        setBuffer(next);
        setTail((tail + 1) % buffer.length);
        setMessage(`Enqueued ${input || 'X'} at index ${tail}.`);
      }
    }
    if (operation === 'Dequeue') {
      if (head === tail) {
        setMessage('Queue is empty!');
      } else {
        const next = [...buffer];
        const val = next[head];
        next[head] = null;
        setBuffer(next);
        setHead((head + 1) % buffer.length);
        setMessage(`Dequeued ${val} from index ${head}.`);
      }
    }
    if (operation === 'Wrap') {
      setMessage(`Head is at ${head}, Tail is at ${tail}.`);
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation === 'Enqueue' ? [{ label: 'Item', value: input, setValue: setInput }] : []} message={message}>
      <div className="array-visual">
        {buffer.map((val, i) => (
          <div key={i} className="array-cell" style={{ position: 'relative', borderStyle: (i === head || i === tail) ? 'dashed' : 'solid', borderColor: i === head ? 'green' : i === tail ? 'red' : undefined }}>
            {val || <span style={{ color: 'transparent' }}>_</span>}
            <span className="array-index">[{i}]</span>
            {i === head && <div style={{ fontSize: 10, color: 'green', position: 'absolute', top: -20, left: 0, width: '100%', textAlign: 'center' }}>HEAD</div>}
            {i === tail && <div style={{ fontSize: 10, color: 'red', position: 'absolute', top: -20, left: 0, width: '100%', textAlign: 'center' }}>TAIL</div>}
          </div>
        ))}
      </div>
    </PlaygroundFrame>
  );
}
