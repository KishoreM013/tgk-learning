import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';
import GraphVisualizer, { GraphNode, GraphEdge } from './GraphVisualizer';

export default function UnweightedGraphPlayground({ structure, onOperationChange }: any) {
  const [nodes, setNodes] = useState<GraphNode[]>([{"id":"A","x":250,"y":50,"label":"A"},{"id":"B","x":100,"y":150,"label":"B"},{"id":"C","x":400,"y":150,"label":"C"},{"id":"D","x":250,"y":250,"label":"D"}]);
  const [edges, setEdges] = useState<GraphEdge[]>([{"source":"A","target":"B","directed":false},{"source":"A","target":"C","directed":false},{"source":"B","target":"D","directed":false},{"source":"C","target":"D","directed":false}]);
  const [input, setInput] = useState('A,B');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Graph loaded.');

  const act = () => {
    if (operation.includes('Add')) {
      const parts = input.split(',');
      if (parts.length >= 2) {
        setEdges((current) => [...current, { source: parts[0].trim(), target: parts[1].trim(), directed: false }]);
        setMessage('Added unweighted edge.');
      }
    } else if (operation.includes('Delete')) {
      const parts = input.split(',');
      if (parts.length >= 2) {
        const source = parts[0].trim();
        const target = parts[1].trim();
        setEdges((current) => current.filter((edge) => !(edge.source === source && edge.target === target && edge.directed === false)));
        setMessage(`Deleted edge ${source} — ${target}.`);
      }
    } else {
      setMessage('Operation triggered: ' + operation);
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
      <GraphVisualizer nodes={nodes} edges={edges} />
    </PlaygroundFrame>
  );
}
