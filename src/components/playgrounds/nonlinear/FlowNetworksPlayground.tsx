import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';
import GraphVisualizer, { GraphNode, GraphEdge } from './GraphVisualizer';

export default function FlowNetworksPlayground({ structure, onOperationChange }: any) {
  const [nodes, setNodes] = useState<GraphNode[]>([{"id":"A","x":250,"y":50,"label":"A"},{"id":"B","x":100,"y":150,"label":"B"},{"id":"C","x":400,"y":150,"label":"C"},{"id":"D","x":250,"y":250,"label":"D"}]);
  const [edges, setEdges] = useState<GraphEdge[]>([{"source":"A","target":"B","directed":true,"label":"4"},{"source":"A","target":"C","directed":true,"label":"1"},{"source":"C","target":"B","directed":true,"label":"2"},{"source":"B","target":"D","directed":true,"label":"3"},{"source":"C","target":"D","directed":true,"label":"5"}]);
  const [input, setInput] = useState('A,B');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Graph loaded.');

  const act = () => {
    
    if (operation.includes('edge')) {
      const parts = input.split(',');
      if (parts.length >= 3) {
        setEdges([...edges, { source: parts[0].trim(), target: parts[1].trim(), directed: true, label: parts[2].trim() }]);
        setMessage('Added weighted edge.');
      }
    } else {
      setMessage('Operation triggered: ' + operation);
    }

  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={[]} message={message}>
      <GraphVisualizer nodes={nodes} edges={edges} />
    </PlaygroundFrame>
  );
}
