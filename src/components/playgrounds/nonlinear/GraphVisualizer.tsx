import { ReactNode } from 'react';

export type GraphNode = { id: string; x: number; y: number; label: string; color?: string; bg?: string };
export type GraphEdge = { source: string; target: string; label?: string; directed?: boolean; color?: string; dashed?: boolean };

export default function GraphVisualizer({ nodes, edges, width = 500, height = 300 }: { nodes: GraphNode[]; edges: GraphEdge[]; width?: number; height?: number }) {
  const getNode = (id: string) => nodes.find(n => n.id === id);

  return (
    <div style={{ position: 'relative', width, height, margin: '0 auto', border: '1px dashed hsl(var(--border))', borderRadius: 8 }}>
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--primary))" opacity="0.4" />
          </marker>
          <marker id="arrow-highlight" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--primary))" />
          </marker>
        </defs>
        {edges.map((e, i) => {
          const s = getNode(e.source);
          const t = getNode(e.target);
          if (!s || !t) return null;
          return (
            <g key={i}>
              <line x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke={e.color || 'hsl(var(--primary))'} strokeWidth="2" strokeDasharray={e.dashed ? '4' : '0'} strokeOpacity={e.color ? 1 : 0.4} markerEnd={e.directed ? (e.color ? 'url(#arrow-highlight)' : 'url(#arrow)') : undefined} />
              {e.label && (
                <text x={(s.x + t.x) / 2} y={(s.y + t.y) / 2 - 5} fill="hsl(var(--primary))" fontSize="12" textAnchor="middle" fontWeight="bold">
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {nodes.map(n => (
        <div key={n.id} style={{ position: 'absolute', top: n.y, left: n.x, transform: 'translate(-50%, -50%)', width: 36, height: 36, background: n.bg || 'hsl(var(--card))', border: `2px solid ${n.color || 'hsl(var(--primary))'}`, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 13, color: n.color || 'hsl(var(--primary))', zIndex: 2, fontWeight: 'bold' }}>
          {n.label}
        </div>
      ))}
    </div>
  );
}
