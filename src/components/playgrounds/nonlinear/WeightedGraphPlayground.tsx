import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';
import GraphVisualizer, { GraphNode, GraphEdge } from './GraphVisualizer';

export default function WeightedGraphPlayground({ structure, onOperationChange }: any) {
  const [nodes, setNodes] = useState<GraphNode[]>([{"id":"A","x":250,"y":50,"label":"A"},{"id":"B","x":100,"y":150,"label":"B"},{"id":"C","x":400,"y":150,"label":"C"},{"id":"D","x":250,"y":250,"label":"D"}]);
  const [edges, setEdges] = useState<GraphEdge[]>([{"source":"A","target":"B","directed":true,"label":"4"},{"source":"A","target":"C","directed":true,"label":"1"},{"source":"C","target":"B","directed":true,"label":"2"},{"source":"B","target":"D","directed":true,"label":"3"},{"source":"C","target":"D","directed":true,"label":"5"}]);
  const [source, setSource] = useState('A');
  const [target, setTarget] = useState('B');
  const [weight, setWeight] = useState('4');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Graph loaded.');

  const act = () => {
    if (operation.includes('Add')) {
      if (source.trim() && target.trim() && weight.trim() && !Number.isNaN(Number(weight))) {
        setEdges((current) => [...current, { source: source.trim(), target: target.trim(), directed: true, label: weight.trim() }]);
        setMessage('Added weighted edge.');
      }
    } else if (operation.includes('Delete')) {
      if (source.trim() && target.trim()) {
        setEdges((current) => current.filter((edge) => !(edge.source === source.trim() && edge.target === target.trim() && edge.directed === true)));
        setMessage(`Deleted weighted edge ${source.trim()} → ${target.trim()}.`);
      }
    } else {
      setMessage('Operation triggered: ' + operation);
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation.includes('Add') ? [{ label: 'Source node', value: source, setValue: setSource }, { label: 'Target node', value: target, setValue: setTarget }, { label: 'Weight', value: weight, setValue: setWeight, inputMode: 'decimal' }] : operation.includes('Delete') ? [{ label: 'Source node', value: source, setValue: setSource }, { label: 'Target node', value: target, setValue: setTarget }] : []} message={message}>
      <GraphVisualizer nodes={nodes} edges={edges} />
    </PlaygroundFrame>
  );
}
