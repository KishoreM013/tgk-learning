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

  const removeNode = (node: NNode, value: string): NNode | undefined => {
    const children = node.children?.map((child) => removeNode(child, value)).filter((child): child is NNode => Boolean(child));
    if (node.value === value) {
      return undefined;
    }
    return children && children.length > 0 ? { ...node, children } : { ...node, children: children && children.length > 0 ? children : undefined };
  };

  const act = () => {
    if (operation === 'Insert') {
      setMessage(`Action triggered: ${operation} with ${input}`);
      return;
    }
    if (operation === 'Delete') {
      const target = input.trim();
      const next = removeNode(root, target);
      if (!next) {
        setMessage(`Could not delete ${target} from the tree.`);
        return;
      }
      setMessage(`Deleted ${target} from the N-ary tree.`);
      return;
    }
    setMessage(`Action triggered: ${operation} with ${input}`);
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
      <div className="tree-visual" style={{ minHeight: 300 }}><NTreeNode node={root} /></div>
    </PlaygroundFrame>
  );
}
