import { useState, useMemo } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

type NNode = { value: string; children?: NNode[] };
function NTreeNode({ node }: { node: NNode }) {
  return (
    <div className="tree-node">
      <span>{node.value}</span>
      {node.children && node.children.length > 0 && (
        <div className="tree-children" style={{ gap: 20 }}>
          {node.children.map((child, i) => (
            <div key={i} className="tree-child"><NTreeNode node={child} /></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NAryTreePlayground({ structure, onOperationChange }: any) {
  const [input, setInput] = useState('Node');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Tree initialized.');
  
  const root: NNode = useMemo(() => ({
    value: 'Root',
    children: [
      { value: 'A', children: [{ value: 'A1' }, { value: 'A2' }] },
      { value: 'B', children: [{ value: 'B1' }] },
      { value: 'C' }
    ]
  }), []);

  const act = () => {
    setMessage(`Action triggered: ${operation} with ${input}`);
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
      <div className="tree-visual" style={{ minHeight: 300 }}><NTreeNode node={root} /></div>
    </PlaygroundFrame>
  );
}
