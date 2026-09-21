import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';
import GraphVisualizer, { GraphNode, GraphEdge } from './GraphVisualizer';

export default function BfsPlayground({ structure, onOperationChange }: any) {
  const [nodes, setNodes] = useState<GraphNode[]>([{"id":"A","x":250,"y":50,"label":"A"},{"id":"B","x":100,"y":150,"label":"B"},{"id":"C","x":400,"y":150,"label":"C"},{"id":"D","x":250,"y":250,"label":"D"}]);
  const [edges, setEdges] = useState<GraphEdge[]>([{"source":"A","target":"B","directed":true},{"source":"A","target":"C","directed":true},{"source":"B","target":"D","directed":true},{"source":"C","target":"D","directed":true}]);
  const [input, setInput] = useState('A,B');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Graph loaded.');

  const act = () => { 
    if (operation === 'Start BFS') {
      const n = [...nodes];
      n.forEach(x => { x.bg = 'hsl(var(--card))'; x.color = 'hsl(var(--primary))'; });
      n[0].bg = 'hsl(var(--accent))';
      setNodes(n);
      setMessage('Started BFS at node A.');
    } else if (operation === 'Step') {
      const n = [...nodes];
      const unvisited = n.find(x => x.bg !== 'hsl(var(--accent))');
      if (unvisited) {
        unvisited.bg = 'hsl(var(--accent))';
        setNodes(n);
        setMessage('Visited node ' + unvisited.id);
      } else {
        setMessage('BFS complete.');
      }
    } else if (operation === 'Reset') {
      const n = [...nodes];
      n.forEach(x => { x.bg = 'hsl(var(--card))'; });
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
