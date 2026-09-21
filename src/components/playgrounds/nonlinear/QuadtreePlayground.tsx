import { useState } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

type Point = { x: number; y: number; id: number };
type Box = { x: number; y: number; w: number; h: number };

class QuadTree {
  points: Point[] = [];
  capacity = 1;
  divided = false;
  nw?: QuadTree; ne?: QuadTree; sw?: QuadTree; se?: QuadTree;
  
  constructor(public boundary: Box) {}
  
  insert(p: Point): boolean {
    if (p.x < this.boundary.x || p.x >= this.boundary.x + this.boundary.w || p.y < this.boundary.y || p.y >= this.boundary.y + this.boundary.h) return false;
    
    if (this.points.length < this.capacity && !this.divided) {
      this.points.push(p);
      return true;
    }
    
    if (!this.divided) this.subdivide();
    return this.nw!.insert(p) || this.ne!.insert(p) || this.sw!.insert(p) || this.se!.insert(p);
  }
  
  subdivide() {
    const { x, y, w, h } = this.boundary;
    const hw = w / 2; const hh = h / 2;
    this.nw = new QuadTree({ x, y, w: hw, h: hh });
    this.ne = new QuadTree({ x: x + hw, y, w: hw, h: hh });
    this.sw = new QuadTree({ x, y: y + hh, w: hw, h: hh });
    this.se = new QuadTree({ x: x + hw, y: y + hh, w: hw, h: hh });
    this.divided = true;
    // redistribute
    for (const p of this.points) {
      this.nw!.insert(p) || this.ne!.insert(p) || this.sw!.insert(p) || this.se!.insert(p);
    }
    this.points = [];
  }
}

function renderQuadTree(qt: QuadTree, key: string) {
  const { x, y, w, h } = qt.boundary;
  return (
    <div key={key} style={{ position: 'absolute', left: x, top: y, width: w, height: h, border: '1px solid hsl(var(--primary))' }}>
      {qt.divided && qt.nw && renderQuadTree(qt.nw, key + '-nw')}
      {qt.divided && qt.ne && renderQuadTree(qt.ne, key + '-ne')}
      {qt.divided && qt.sw && renderQuadTree(qt.sw, key + '-sw')}
      {qt.divided && qt.se && renderQuadTree(qt.se, key + '-se')}
    </div>
  );
}

export default function QuadtreePlayground({ structure, onOperationChange }: any) {
  const [points, setPoints] = useState<Point[]>([]);
  const [input, setInput] = useState('150, 150');
  const [operation, setOperation] = useState(structure.operations[0]);
  const [message, setMessage] = useState('Quadtree initialized (Capacity 1).');

  const qt = new QuadTree({ x: 0, y: 0, w: 300, h: 300 });
  points.forEach(p => qt.insert(p));

  const act = () => {
    if (operation.includes('Insert')) {
      const parts = input.split(',').map(Number);
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        const np = { x: Math.max(0, Math.min(300, parts[0])), y: Math.max(0, Math.min(300, parts[1])), id: Date.now() };
        setPoints([...points, np]);
        setMessage(`Inserted point at (\${np.x}, \${np.y}). Watch it subdivide if capacity exceeds 1.`);
      }
    } else {
      setPoints([]);
      setMessage('Reset Quadtree.');
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} input={input} setInput={setInput} message={message}>
      <div style={{ position: 'relative', width: 300, height: 300, margin: '20px auto', background: 'hsl(var(--card))' }}>
        {renderQuadTree(qt, 'root')}
        {points.map(p => (
          <div key={p.id} style={{ position: 'absolute', left: p.x - 3, top: p.y - 3, width: 6, height: 6, background: 'hsl(var(--destructive))', borderRadius: '50%' }} />
        ))}
      </div>
    </PlaygroundFrame>
  );
}
