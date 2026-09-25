import { useState, useMemo } from 'react';
import PlaygroundFrame from '../PlaygroundFrame';

type TreeItem = { value: string; p: number; left?: TreeItem; right?: TreeItem };

function TreeNode({ node }: { node?: TreeItem }) { 
  if (!node) return <span style={{ color: 'hsl(var(--muted-foreground))', font: '11px var(--app-font-mono)' }}>empty</span>; 
  return (
    <div className="tree-node">
      <span style={{ position: 'relative' }}>{node.p} <small style={{fontSize: 10, opacity: 0.5, position: 'absolute', bottom: -20, whiteSpace: 'nowrap'}}>{node.value}</small></span>
      <div className="tree-children">
        <div className="tree-child"><TreeNode node={node.left} /></div>
        <div className="tree-child"><TreeNode node={node.right} /></div>
      </div>
    </div>
  ); 
}

export default function PriorityQueuePlayground({ structure, onOperationChange }: any) {
  const [isMinHeap, setIsMinHeap] = useState(true);
  const [heap, setHeap] = useState<{val: string, p: number}[]>([
    {val: 'Critical', p: 1}, 
    {val: 'High', p: 2}, 
    {val: 'Low', p: 5},
    {val: 'Task A', p: 3},
    {val: 'Task B', p: 4}
  ]);
  const [input, setInput] = useState('Medium, 2');
  const [operation, setOperation] = useState('Insert');
  const [message, setMessage] = useState('Priority queue visualized as a Min-Heap tree.');

  const compare = (a: number, b: number) => isMinHeap ? a < b : a > b;

  const root = useMemo(() => {
    if (!heap.length) return undefined;
    const nodes: TreeItem[] = heap.map(item => ({ value: item.val, p: item.p }));
    for (let i = 0; i < nodes.length; i++) {
      if (2 * i + 1 < nodes.length) nodes[i].left = nodes[2 * i + 1];
      if (2 * i + 2 < nodes.length) nodes[i].right = nodes[2 * i + 2];
    }
    return nodes[0];
  }, [heap]);

  const toggleHeapType = () => {
    const newIsMin = !isMinHeap;
    setIsMinHeap(newIsMin);
    
    const newHeap = [...heap];
    const newCompare = (a: number, b: number) => newIsMin ? a < b : a > b;
    // O(N) heapify
    for (let i = Math.floor(newHeap.length / 2) - 1; i >= 0; i--) {
      let currentIdx = i;
      while (true) {
        let leftChildIdx = 2 * currentIdx + 1;
        let rightChildIdx = 2 * currentIdx + 2;
        let bestIdx = currentIdx;
        
        if (leftChildIdx < newHeap.length && newCompare(newHeap[leftChildIdx].p, newHeap[bestIdx].p)) bestIdx = leftChildIdx;
        if (rightChildIdx < newHeap.length && newCompare(newHeap[rightChildIdx].p, newHeap[bestIdx].p)) bestIdx = rightChildIdx;
        
        if (bestIdx === currentIdx) break;
        
        const temp = newHeap[currentIdx];
        newHeap[currentIdx] = newHeap[bestIdx];
        newHeap[bestIdx] = temp;
        currentIdx = bestIdx;
      }
    }
    setHeap(newHeap);
    setMessage(`Switched to ${newIsMin ? 'Min-Heap' : 'Max-Heap'} and re-heapified.`);
  };

  const act = () => {
    if (operation === 'Insert') {
      const [rawValue, rawPriority, ...extra] = input.split(',').map((part) => part.trim());
      const val = rawValue || 'Task';
      const p = Number(rawPriority);
      if (!rawPriority || extra.length > 0 || !Number.isInteger(p)) {
        setMessage('Insert expects one value and one integer priority, for example Task C, 2.');
        return;
      }
      
      const newHeap = [...heap, {val, p}];
      let currentIdx = newHeap.length - 1;
      
      while (currentIdx > 0) {
        const parentIdx = Math.floor((currentIdx - 1) / 2);
        if (compare(newHeap[parentIdx].p, newHeap[currentIdx].p) || newHeap[parentIdx].p === newHeap[currentIdx].p) break;
        const temp = newHeap[parentIdx];
        newHeap[parentIdx] = newHeap[currentIdx];
        newHeap[currentIdx] = temp;
        currentIdx = parentIdx;
      }
      
      setHeap(newHeap);
      setMessage(`Inserted ${val} with priority ${p} and bubbled up.`);
    }
    
    if (operation === 'Extract') {
      if (heap.length === 0) {
        setMessage('Queue is empty.');
        return;
      }
      if (heap.length === 1) {
        setMessage(`Extracted ${heap[0].val}.`);
        setHeap([]);
        return;
      }
      
      const newHeap = [...heap];
      const extracted = newHeap[0];
      newHeap[0] = newHeap.pop()!;
      
      let currentIdx = 0;
      while (true) {
        let leftChildIdx = 2 * currentIdx + 1;
        let rightChildIdx = 2 * currentIdx + 2;
        let bestIdx = currentIdx;
        
        if (leftChildIdx < newHeap.length && compare(newHeap[leftChildIdx].p, newHeap[bestIdx].p)) bestIdx = leftChildIdx;
        if (rightChildIdx < newHeap.length && compare(newHeap[rightChildIdx].p, newHeap[bestIdx].p)) bestIdx = rightChildIdx;
        
        if (bestIdx === currentIdx) break;
        
        const temp = newHeap[currentIdx];
        newHeap[currentIdx] = newHeap[bestIdx];
        newHeap[bestIdx] = temp;
        currentIdx = bestIdx;
      }
      
      setHeap(newHeap);
      setMessage(`Extracted ${extracted.val} (priority ${extracted.p}) and bubbled down.`);
    }
    
    if (operation === 'Peek') {
      if (heap.length) setMessage(`Highest priority is ${heap[0].val} (priority ${heap[0].p}).`);
      else setMessage('Queue is empty.');
    }
  };

  return (
    <PlaygroundFrame title={structure.title} operation={operation} setOperation={setOperation} onOperationChange={onOperationChange} operations={structure.operations} onAction={act} fields={operation === 'Insert' ? [{ label: 'Value, priority', value: input, setValue: setInput, placeholder: 'Task C, 2' }] : []} message={message}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onClick={toggleHeapType} style={{ marginBottom: 30, padding: '6px 12px', background: 'hsl(var(--accent))', color: 'hsl(var(--foreground))', border: '1px solid hsl(var(--border))', borderRadius: 4, cursor: 'pointer', font: '12px var(--app-font-mono)' }}>
          Mode: {isMinHeap ? 'Min-Heap (Lowest Number First)' : 'Max-Heap (Highest Number First)'}
        </button>
        <div className="tree-visual" style={{ minHeight: 'auto' }}>
          <TreeNode node={root} />
        </div>
      </div>
    </PlaygroundFrame>
  );
}
