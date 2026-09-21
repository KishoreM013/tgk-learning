import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';
import GraphVisualizer, { GraphNode, GraphEdge } from './GraphVisualizer';

export default function DijkstraPlayground({ structure, onOperationChange }: any) {
  const [nodes, setNodes] = useState<GraphNode[]>([{"id":"A","x":250,"y":50,"label":"A"},{"id":"B","x":100,"y":150,"label":"B"},{"id":"C","x":400,"y":150,"label":"C"},{"id":"D","x":250,"y":250,"label":"D"}]);
  const [edges, setEdges] = useState<GraphEdge[]>([{"source":"A","target":"B","directed":true,"label":"4"},{"source":"A","target":"C","directed":true,"label":"1"},{"source":"C","target":"B","directed":true,"label":"2"},{"source":"B","target":"D","directed":true,"label":"3"},{"source":"C","target":"D","directed":true,"label":"5"}]);
  const [input, setInput] = useState('A,B');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Graph loaded.');

  const act = () => { 
    if (operation === 'Relax edge') {
      const e = [...edges];
      const unrelaxed = e.find(x => !x.color);
      if (unrelaxed) {
        unrelaxed.color = 'hsl(var(--destructive))';
        setEdges(e);
        setMessage('Relaxed edge ' + unrelaxed.source + ' -> ' + unrelaxed.target);
      }
    } else if (operation === 'Next node') {
      const n = [...nodes];
      const next = n.find(x => x.bg !== 'hsl(var(--destructive))');
      if (next) {
        next.bg = 'hsl(var(--destructive))';
        next.color = 'white';
        setNodes(n);
        setMessage('Settled node ' + next.id);
      }
    } else if (operation === 'Reset') {
      const e = [...edges];
      e.forEach(x => x.color = undefined);
      const n = [...nodes];
      n.forEach(x => { x.bg = 'hsl(var(--card))'; x.color = 'hsl(var(--primary))'; });
      setEdges(e);
      setNodes(n);
      setMessage('Reset graph.');
    }
 };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
      <GraphVisualizer nodes={nodes} edges={edges} />
    </PlaygroundFrame>
  );
}
