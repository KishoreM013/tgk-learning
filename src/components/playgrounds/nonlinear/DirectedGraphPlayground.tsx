import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';
import GraphVisualizer, { GraphNode, GraphEdge } from './GraphVisualizer';

export default function DirectedGraphPlayground({ structure, onOperationChange }: any) {
  const [nodes, setNodes] = useState<GraphNode[]>([{"id":"A","x":250,"y":50,"label":"A"},{"id":"B","x":100,"y":150,"label":"B"},{"id":"C","x":400,"y":150,"label":"C"},{"id":"D","x":250,"y":250,"label":"D"}]);
  const [edges, setEdges] = useState<GraphEdge[]>([{"source":"A","target":"B","directed":true},{"source":"A","target":"C","directed":true},{"source":"B","target":"D","directed":true},{"source":"C","target":"D","directed":true}]);
  const [source, setSource] = useState('A');
  const [target, setTarget] = useState('B');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Graph loaded.');

  const act = () => {
    const from = source.trim();
    const to = target.trim();
    if (operation === 'Add edge') {
      if (!from || !to || !nodes.some((node) => node.id === from) || !nodes.some((node) => node.id === to)) { setMessage('Add edge requires two existing node IDs.'); return; }
      if (edges.some((edge) => edge.source === from && edge.target === to)) { setMessage('That directed edge already exists.'); return; }
      setEdges((current) => [...current, { source: from, target: to, directed: true }]);
      setMessage(`Added directed edge ${from} -> ${to}.`);
    } else if (operation === 'Delete edge') {
      const next = edges.filter((edge) => !(edge.source === from && edge.target === to));
      setEdges(next);
      setMessage(next.length === edges.length ? `Edge ${from} -> ${to} was not found.` : `Deleted edge ${from} -> ${to}.`);
    } else if (operation === 'DFS' || operation === 'BFS') {
      const visited = new Set<string>();
      const order: string[] = [];
      const pending = ['A'];
      while (pending.length) {
        const current = operation === 'DFS' ? pending.pop()! : pending.shift()!;
        if (visited.has(current)) continue;
        visited.add(current); order.push(current);
        edges.filter((edge) => edge.source === current).reverse().forEach((edge) => { if (!visited.has(edge.target)) pending.push(edge.target); });
      }
      setNodes((current) => current.map((node) => ({ ...node, bg: visited.has(node.id) ? 'hsl(var(--accent))' : 'hsl(var(--card))' })));
      setMessage(`${operation} from A: ${order.join(' -> ')}.`);
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation.includes('Add') || operation.includes('Delete') ? [{ label: 'Source node', value: source, setValue: setSource }, { label: 'Target node', value: target, setValue: setTarget }] : []} message={message}>
      <GraphVisualizer nodes={nodes} edges={edges} />
    </PlaygroundFrame>
  );
}
