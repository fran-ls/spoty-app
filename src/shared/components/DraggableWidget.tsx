import { useCallback, useEffect, useRef, useState } from "react";
import type { DragOrigin, GradientEditorPos } from "../../features/playlist/gradientEditor.types";

interface DraggableWidgetProps {
  children: React.ReactNode;
  isBackground: boolean;
  size?: {
    width: string | number,
    height: string | number
  }
}

function DraggableWidget({ children, isBackground, size }: DraggableWidgetProps) {
  const [pos, setPos] = useState<GradientEditorPos>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<boolean>(false);
  const dragStart = useRef<DragOrigin | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("input, button, select")) return;
    e.preventDefault();
    setDragging(true);
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
    if ((e.target as HTMLElement).closest("input, button, select")) return;
    const t = e.touches[0];
    setDragging(true);
    dragStart.current = {
      mx: t.clientX,
      my: t.clientY,
      px: pos.x,
      py: pos.y
    }
  }, [pos]);

  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        transition: dragging ? "none" : "width 0.2s, height 0.2s, box-shadow 0.2s",
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: dragging ? 100 : 1,
        borderRadius: '4px',
        overflow: 'hidden',
        opacity: isBackground ? 1 : 0,
        ...(size && size)
      }}
    >
      {children}
    </div>
  )
}

export default DraggableWidget;