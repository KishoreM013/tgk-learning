import { type PointerEvent as ReactPointerEvent, type ReactNode, useEffect, useRef, useState } from 'react';

export default function PlaygroundFrame({ title, operation, setOperation, onOperationChange, operations, onAction, input, setInput, index, setIndex, message, children }: { title: string; operation: string; setOperation: (v: string) => void; onOperationChange: (operation: string) => void; operations: string[]; onAction: () => void; input: string; setInput: (v: string) => void; index?: string; setIndex?: (v: string) => void; message: string; children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const zoomBy = (amount: number) => setView((current) => ({ ...current, scale: Math.min(2.2, Math.max(0.5, Number((current.scale + amount).toFixed(2)))) }));
  const resetView = () => setView({ x: 0, y: 0, scale: 1 });
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await frameRef.current?.requestFullscreen?.();
      else if (document.fullscreenElement === frameRef.current) await document.exitFullscreen();
    } catch {
      // Browsers can reject fullscreen when the permission is unavailable.
    }
  };
  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: view.x, originY: view.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const drag = dragRef.current;
    setView((current) => ({ ...current, x: drag.originX + event.clientX - drag.startX, y: drag.originY + event.clientY - drag.startY }));
  };
  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    zoomBy(event.deltaY > 0 ? -0.1 : 0.1);
  };
  const handleCanvasKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const movements: Record<string, { x: number; y: number }> = { ArrowLeft: { x: 36, y: 0 }, ArrowRight: { x: -36, y: 0 }, ArrowUp: { x: 0, y: 36 }, ArrowDown: { x: 0, y: -36 } };
    const movement = movements[event.key];
    if (!movement) return;
    event.preventDefault();
    setView((current) => ({ ...current, x: current.x + movement.x, y: current.y + movement.y }));
  };

  return <div ref={frameRef} className="panel playground">
    <div className="panel-heading">
      <div><h2>Interactive playground</h2><small>LOCAL STATE / SAFE TO BREAK</small></div>
      <div className="playground-actions">
        <div className="view-controls" aria-label="Canvas zoom controls">
          <button className="view-button" onClick={() => zoomBy(-0.1)} aria-label="Zoom out" data-testid="button-zoom-out">−</button>
          <button className="view-level" onClick={resetView} aria-label="Reset canvas view" data-testid="button-reset-view">{Math.round(view.scale * 100)}%</button>
          <button className="view-button" onClick={() => zoomBy(0.1)} aria-label="Zoom in" data-testid="button-zoom-in">+</button>
        </div>
        <button className="view-button view-reset" onClick={resetView} data-testid="button-reset-canvas">Reset view</button>
        <button className="view-button fullscreen-button" onClick={toggleFullscreen} data-testid="button-fullscreen">{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</button>
      </div>
    </div>
    <div className="lab-controls"><select className="field-select" style={{ width: 148 }} value={operation} onChange={(e) => { setOperation(e.target.value); onOperationChange(e.target.value); }} aria-label={`${title} operation`} data-testid={`select-operation-${title.toLowerCase().replaceAll(' ', '-')}`}>{operations.map((item) => <option key={item}>{item}</option>)}</select><input className="field-input" value={input} onChange={(e) => setInput(e.target.value)} aria-label="Value" data-testid="input-playground-value" />{setIndex && index !== undefined && <input className="field-input" value={index} onChange={(e) => setIndex(e.target.value)} aria-label="Index" data-testid="input-playground-index" /> }<button className="button-primary" onClick={onAction} data-testid="button-run-operation">Run {operation}</button></div>
    <div className="visual-stage visual-viewport" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onWheel={handleWheel} onKeyDown={handleCanvasKeyDown} tabIndex={0} role="region" aria-label={`${title} infinite playground`} data-testid="playground-canvas">
      <div className="playground-plane" style={{ transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})` }}>{children}</div>
      <div className="canvas-hint">Drag to pan · Scroll to zoom · Arrow keys to move</div>
    </div>
    <div className="lab-body"><div className="status-line" data-testid="status-playground">{message}</div></div>
  </div>;
}
