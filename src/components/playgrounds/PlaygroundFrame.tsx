import { type PointerEvent as ReactPointerEvent, type ReactNode, useEffect, useRef, useState } from 'react';

export type PlaygroundField = { label: string; value: string; setValue: (value: string) => void; placeholder?: string; inputMode?: 'text' | 'numeric' | 'decimal' };

export default function PlaygroundFrame({ title, operation, setOperation, onOperationChange, operations, onAction, fields, input, setInput, index, setIndex, message, children }: { title: string; operation: string; setOperation: (v: string) => void; onOperationChange: (operation: string) => void; operations: string[]; onAction: () => void; fields?: PlaygroundField[]; input?: string; setInput?: (value: string) => void; index?: string; setIndex?: (value: string) => void; message: string; children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [history, setHistory] = useState<string[]>(() => [message]);
  const [stepIndex, setStepIndex] = useState(0);
  const lastMessageRef = useRef(message);
  const visibleFields = fields ?? [
    ...(input !== undefined && setInput ? [{ label: 'Value', value: input, setValue: setInput }] : []),
    ...(index !== undefined && setIndex ? [{ label: 'Index', value: index, setValue: setIndex, inputMode: 'numeric' as const }] : []),
  ];
  const appendHistory = (nextMessage: string) => {
    setHistory((previous) => {
      const next = previous[previous.length - 1] === nextMessage ? previous : [...previous, nextMessage];
      setStepIndex(next.length - 1);
      return next;
    });
  };

  const runAction = () => {
    const missingField = visibleFields.find((field) => !field.value.trim());
    if (missingField) {
      appendHistory(`Enter ${missingField.label.toLowerCase()} before running ${operation}.`);
      return;
    }
    onAction();
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (message === lastMessageRef.current) return;
    lastMessageRef.current = message;
    setHistory((previous) => {
      const last = previous[previous.length - 1];
      if (last === message) return previous;
      const next = [...previous, message];
      setStepIndex(next.length - 1);
      return next;
    });
  }, [message]);

  const currentMessage = history[stepIndex] ?? message;
  const canGoPrevious = stepIndex > 0;
  const canGoNext = stepIndex < history.length - 1;

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
    <div className="lab-controls">
      <label className="lab-control-field operation-field"><span>Operation</span><select className="field-select" value={operation} onChange={(e) => { setOperation(e.target.value); onOperationChange(e.target.value); }} aria-label={`${title} operation`} data-testid={`select-operation-${title.toLowerCase().replaceAll(' ', '-')}`}>{operations.map((item) => <option key={item}>{item}</option>)}</select></label>
      {visibleFields.map((field) => <label className="lab-control-field" key={field.label}><span>{field.label}</span><input className="field-input" value={field.value} onChange={(e) => field.setValue(e.target.value)} placeholder={field.placeholder} inputMode={field.inputMode} aria-label={field.label} data-testid={`input-playground-${field.label.toLowerCase().replaceAll(' ', '-').replaceAll(',', '')}`} /></label>)}
      <button className="button-primary lab-run-button" onClick={runAction} data-testid="button-run-operation">Run {operation}</button>
    </div>
    <div className="visual-stage visual-viewport" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} onWheel={handleWheel} onKeyDown={handleCanvasKeyDown} tabIndex={0} role="region" aria-label={`${title} infinite playground`} data-testid="playground-canvas">
      <div className="playground-plane" style={{ transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})` }}>{children}</div>
      <div className="canvas-hint">Drag to pan · Scroll to zoom · Arrow keys to move</div>
    </div>
    <div className="lab-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
        <div style={{ font: '10px var(--app-font-mono)', letterSpacing: '.08em', textTransform: 'uppercase', color: 'hsl(var(--muted-foreground))' }}>Step {Math.min(stepIndex + 1, history.length)} / {history.length}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="button-quiet" onClick={() => setStepIndex((index) => Math.max(0, index - 1))} disabled={!canGoPrevious} style={{ opacity: canGoPrevious ? 1 : 0.5, cursor: canGoPrevious ? 'pointer' : 'not-allowed', padding: '7px 10px', fontSize: 11 }} data-testid="button-prev-step">Prev</button>
          <button type="button" className="button-quiet" onClick={() => setStepIndex((index) => Math.min(history.length - 1, index + 1))} disabled={!canGoNext} style={{ opacity: canGoNext ? 1 : 0.5, cursor: canGoNext ? 'pointer' : 'not-allowed', padding: '7px 10px', fontSize: 11 }} data-testid="button-next-step">Next</button>
        </div>
      </div>
      <div className="status-line" data-testid="status-playground">{currentMessage}</div>
    </div>
  </div>;
}
