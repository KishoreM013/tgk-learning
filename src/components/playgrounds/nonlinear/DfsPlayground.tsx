import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';
import GraphVisualizer, { GraphNode, GraphEdge } from './GraphVisualizer';

export default function DfsPlayground({ structure, onOperationChange }: any) {
  const [nodes, setNodes] = useState<GraphNode[]>([{"id":"A","x":250,"y":50,"label":"A"},{"id":"B","x":100,"y":150,"label":"B"},{"id":"C","x":400,"y":150,"label":"C"},{"id":"D","x":250,"y":250,"label":"D"}]);
  const [edges, setEdges] = useState<GraphEdge[]>([{"source":"A","target":"B","directed":true},{"source":"A","target":"C","directed":true},{"source":"B","target":"D","directed":true},{"source":"C","target":"D","directed":true}]);
  const [input, setInput] = useState('A,B');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Graph loaded.');

  const act = () => { 
    if (operation === 'Start DFS') {
      const n = [...nodes];
      n.forEach(x => { x.bg = 'hsl(var(--card))'; });
      n[0].bg = 'hsl(var(--destructive))';
      n[0].color = 'white';
      setNodes(n);
      setMessage('Started DFS at node A.');
    } else if (operation === 'Step') {
      const n = [...nodes];
      const unvisited = n.find(x => x.bg !== 'hsl(var(--destructive))');
      if (unvisited) {
        unvisited.bg = 'hsl(var(--destructive))';
        unvisited.color = 'white';
        setNodes(n);
        setMessage('Visited node ' + unvisited.id + ' deeply.');
      } else {
        setMessage('DFS complete.');
      }
    } else if (operation === 'Reset') {
      const n = [...nodes];
      n.forEach(x => { x.bg = 'hsl(var(--card))'; x.color = 'hsl(var(--primary))'; });
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
