import { useCallback, useEffect, useRef, useState, type HTMLAttributes } from "react";
import type { DragOrigin, GradientEditorPos } from "../../features/playlist/gradientEditor.types";

interface DraggableWidgetProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isOpen: boolean;
}

function DraggableWidget({ children, isOpen, style, draggable = true, ...props }: DraggableWidgetProps) {
  const [pos, setPos] = useState<GradientEditorPos>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<boolean>(false);
  const [dragged, setDragged] = useState<boolean>(false);

  const dragStart = useRef<DragOrigin | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("input, button, select") || !draggable) {
      return;
    }

    e.preventDefault();
    setDragging(true);
    setDragged(true);

    dragStart.current = {
      mx: e.clientX,
      my: e.clientY,
      px: pos.x,
      py: pos.y
    }
  }, [pos]);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) => {
      if (!dragStart.current) return;
      setPos({
        x: dragStart.current.px + (e.clientX - dragStart.current.mx),
        y: dragStart.current.py + (e.clientY - dragStart.current.my),
      });
    }

    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
  }, [dragging]);

  useEffect(() => {
    if (!dragging) return;

    const onTouch = (e: TouchEvent) => {
      if (!dragStart.current) return;
      const t = e.touches[0];
      setPos({
        x: dragStart.current.px + (t.clientX - dragStart.current.mx),
        y: dragStart.current.py + (t.clientY - dragStart.current.my),
      });
    }

    const onTouchEnd = () => setDragging(false);
    window.addEventListener("touchmove", onTouch);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
    }
  }, [dragging]);

  const onTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("input, button, select") || !draggable) {
      return;
    }

    const t = e.touches[0];
    setDragging(true);
    dragStart.current = {
      mx: t.clientX,
      my: t.clientY,
      px: pos.x,
      py: pos.y
    }
  }, [pos]);

  useEffect(() => {
    return () => {
      setPos({ x: 0, y: 0 });
    }
  }, []);

  return (
    <div
      {...props}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
        // display: isOpen ? "block" : "none",
        transform: !isOpen ? "translate(0%, 100%)" : dragging ? `translate(${pos.x}px, ${pos.y}px)` : dragged ? `translate(${pos.x}px, ${pos.y}px)` : "translate(0%, 0%)",
        cursor: dragging ? "grabbing" : draggable ? "grab" : "",
        userSelect: "none",
        transition: dragging ? "none" : dragged && !isOpen ? "none" : "all 0.2s", //"width 0.2s, height 0.2s, box-shadow 0.2s",
        position: "absolute",
        bottom: 0,
        right: 0,
        zIndex: dragging ? 100 : 1,
        borderRadius: '4px',
        overflow: 'hidden',
        opacity: isOpen ? 1 : 0,
        width: '100%',
        ...(style && style)
      }}
    >
      {children}
    </div>
  )
}

export default DraggableWidget;