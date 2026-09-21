import { useState } from 'react';
import PlaygroundFrame from './PlaygroundFrame';

export default function SharedPlayground({ structure, onOperationChange }: { structure: any; onOperationChange: (operation: string) => void }) {
  const [values, setValues] = useState(['node A', 'node B', 'node C']); const [input, setInput] = useState('node D'); const [operation, setOperation] = useState(structure.operations[0]); const [message, setMessage] = useState('This visualizer keeps the core idea in view.');
  const act = () => { if (/insert|add|append|push|set|put/i.test(operation)) { setValues((v) => [...v, input || 'new value']); setMessage(`Applied ${operation.toLowerCase()} with ${input || 'new value'}.`); } else if (/delete|remove|extract|evict|clear/i.test(operation)) { setValues((v) => v.slice(0, -1)); setMessage(`Applied ${operation.toLowerCase()} to the latest item.`); } else setMessage(`${operation} inspected the current state.`); };
  return <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}><div className="shared-visual"><div className="shared-visual-mark"><span>{values.join('  ·  ') || 'empty structure'}</span></div><p>State changes stay local to this browser session so you can experiment freely.</p></div></PlaygroundFrame>;
}
