import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';
import GraphVisualizer, { GraphNode, GraphEdge } from './GraphVisualizer';

export default function UndirectedGraphPlayground({ structure, onOperationChange }: any) {
  const [nodes, setNodes] = useState<GraphNode[]>([{"id":"A","x":250,"y":50,"label":"A"},{"id":"B","x":100,"y":150,"label":"B"},{"id":"C","x":400,"y":150,"label":"C"},{"id":"D","x":250,"y":250,"label":"D"}]);
  const [edges, setEdges] = useState<GraphEdge[]>([{"source":"A","target":"B","directed":false},{"source":"A","target":"C","directed":false},{"source":"B","target":"D","directed":false},{"source":"C","target":"D","directed":false}]);
  const [input, setInput] = useState('A,B');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Graph loaded.');

  const act = () => {
    
    const [from, to] = input.split(',').map((value) => value.trim());
    if (operation === 'Add edge') {
      if (!from || !to || !nodes.some((node) => node.id === from) || !nodes.some((node) => node.id === to)) { setMessage('Add edge requires two existing node IDs.'); return; }
      setEdges((current) => [...current, { source: from, target: to, directed: false }]);
      setMessage(`Added undirected edge ${from} -- ${to}.`);
    } else if (operation === 'Delete edge') {
      setEdges((current) => current.filter((edge) => !((edge.source === from && edge.target === to) || (edge.source === to && edge.target === from))));
      setMessage(`Deleted undirected edge ${from} -- ${to}.`);
    } else if (operation === 'DFS' || operation === 'BFS') {
      const visited = new Set<string>(); const order: string[] = []; const pending = ['A'];
      while (pending.length) { const current = operation === 'DFS' ? pending.pop()! : pending.shift()!; if (visited.has(current)) continue; visited.add(current); order.push(current); edges.filter((edge) => edge.source === current || edge.target === current).forEach((edge) => { const next = edge.source === current ? edge.target : edge.source; if (!visited.has(next)) pending.push(next); }); }
      setNodes((current) => current.map((node) => ({ ...node, bg: visited.has(node.id) ? 'hsl(var(--secondary))' : 'hsl(var(--card))' })));
      setMessage(`${operation} from A: ${order.join(' -> ')}.`);
    }

  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation.includes('edge') ? [{ label: 'Source node', value: input.split(',')[0]?.trim() ?? '', setValue: (value) => setInput(`${value},${input.split(',')[1]?.trim() ?? ''}`) }, { label: 'Target node', value: input.split(',')[1]?.trim() ?? '', setValue: (value) => setInput(`${input.split(',')[0]?.trim() ?? ''},${value}`) }] : []} message={message}>
      <GraphVisualizer nodes={nodes} edges={edges} />
    </PlaygroundFrame>
  );
}
