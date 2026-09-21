import { ReactNode } from 'react';

export type HashEntry = { key: string; value: string; color?: string };

export default function HashMapVisualizer({ entries, buckets = 8 }: { entries: HashEntry[], buckets?: number }) {
  // Simple bucketing for visualization
  const grid = Array.from({ length: buckets }, () => [] as HashEntry[]);
  entries.forEach(e => {
    let hash = 0;
    for (let i = 0; i < e.key.length; i++) hash += e.key.charCodeAt(i);
    grid[hash % buckets].push(e);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 500, margin: '0 auto' }}>
      {grid.map((bucket, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 40, color: 'hsl(var(--muted-foreground))', font: '12px var(--app-font-mono)', textAlign: 'right' }}>
            [{i}]
          </div>
          <div style={{ flex: 1, display: 'flex', gap: 10, padding: 10, border: '1px solid hsl(var(--border))', borderRadius: 6, background: 'hsl(var(--card))', minHeight: 46 }}>
            {bucket.length === 0 ? <span style={{ opacity: 0.3, font: '12px var(--app-font-mono)' }}>empty</span> : bucket.map((entry, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', border: '1px solid hsl(var(--primary))', borderRadius: 4, overflow: 'hidden', font: '12px var(--app-font-mono)' }}>
                <div style={{ background: entry.color || 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))', padding: '4px 8px' }}>{entry.key}</div>
                {entry.value && <div style={{ padding: '4px 8px', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}>{entry.value}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
