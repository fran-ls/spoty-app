import { useState, useRef, useCallback, useEffect } from "react";
import { XIcon } from "lucide-react";
import type { DragOrigin, GradientEditorDirection, GradientEditorPos, GradientEditorStop, GradientEditorStopKey } from "../gradientEditor.types";

interface ColorStopProps {
  stop: GradientEditorStop;
  index: number;
  canRemove: boolean;
  onChange: (index: number, key: GradientEditorStopKey, value: string | number) => void;
  onRemove: (index: number) => void;
}

interface DraggableWidgetProps {
  isBackground: boolean;
  children: React.ReactNode;
  divRef: React.RefObject<HTMLDivElement | null>;
}

const DIRECTIONS: GradientEditorDirection[] = [
  { label: "↓ Vertical", value: "to bottom" },
  { label: "→ Horizontal", value: "to right" },
  { label: "↘ Diagonal", value: "135deg" },
  { label: "↗ Diagonal inv.", value: "45deg" },
  { label: "↑ Invertido", value: "to top" },
];

function ColorStop({ stop, index, canRemove, onChange, onRemove }: ColorStopProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 12px",
      background: "rgba(255,255,255,0.04)",
      borderRadius: 10,
      border: "1px solid rgba(255,255,255,0.08)",
      marginBottom: 8
    }}>
      <input
        type="color"
        value={stop.color}
        onChange={(e) => onChange(index, "color", e.target.value)}
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          border: "2px solid rgba(255,255,255,0.15)",
          cursor: "pointer",
          background: "none",
          padding: 2
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4
        }}>
          <span style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "monospace"
          }}
          >
            {stop.color.toUpperCase()}
          </span>
          <span style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.5)"
          }}>
            {stop.pos}%
          </span>
        </div>
        <input
          type="range"
          min={0} max={100} step={1}
          value={stop.pos}
          onChange={(e) => onChange(index, "pos", Number(e.target.value))}
          style={{
            width: "100%",
            accentColor: stop.color
          }}
        />
      </div>

      {canRemove && (
        <button
          onClick={() => onRemove(index)}
          style={{
            background: "rgba(255,60,60,0.15)",
            border: "1px solid rgba(255,60,60,0.3)",
            color: "#ff6060",
            borderRadius: 8,
            width: 28,
            height: 28,
            cursor: "pointer",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          aria-label="Eliminar color"
        >
          <XIcon size={16} />
        </button>
      )}
    </div>
  )
}

function DraggableWidget({ children }: DraggableWidgetProps) {
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
        transition: dragging ? "none" : "box-shadow 0.2s",
        position: "absolute",
        top: 100,
        right: 20,
        zIndex: dragging ? 100 : 1,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}

interface GradientEditorProps {
  isBackground: boolean;
  onClose: () => void;
  setGradientCSS: React.Dispatch<React.SetStateAction<string>>;
}

export default function GradientEditor({ isBackground, setGradientCSS, onClose }: GradientEditorProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const [stops, setStops] = useState<GradientEditorStop[]>([
    { color: "#3a3a3a", pos: 0 },
    { color: "#121212", pos: 50 },
    { color: "#131313", pos: 100 },
  ]);
  const [direction, setDirection] = useState<string>("to bottom");

  const sorted = [...stops].sort((a, b) => a.pos - b.pos);
  const gradientStops = sorted.map((s) => `${s.color} ${s.pos}%`).join(", ");
  const gradientCSS = `linear-gradient(${direction}, ${gradientStops})`;

  const handleChange = (i: number, key: GradientEditorStopKey, val: string | number): void => {
    setStops((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));
  }

  const handleRemove = (i: number): void => {
    setStops((prev) => prev.filter((_, idx) => idx !== i));
  }

  const handleAdd = (): void => {
    setStops((prev) => [...prev, { color: "#ffffff", pos: 50 }]);
  }

  useEffect(() => { setGradientCSS(gradientCSS) }, [stops, direction]);

  return (
    <DraggableWidget
      divRef={divRef}
      isBackground={isBackground}
    >
      <div
        style={{
          background: "rgba(10,10,10,0.72)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 20,
          border: isBackground ? "1px solid rgba(255,255,255,0.1)" : "none",
          padding: isBackground ? 20 : 0,
          boxSizing: "border-box",
          width: isBackground ? 340 : 0,
          height: isBackground ? 250 : 0,
        }}
        ref={divRef}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          gap: 12
        }}>
          <span style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.4)",
            textTransform: "uppercase"
          }}>
            ⠿ Fondo
          </span>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.8)",
              borderRadius: 8,
              padding: "4px 8px",
              fontSize: 12,
              cursor: "pointer"
            }}
          >
            {DIRECTIONS.map((d) => (
              <option
                style={{ background: "#262626" }}
                value={d.value}
                key={d.value}
              >
                {d.label}
              </option>
            ))}
          </select>
          <button
            onClick={onClose}
            className="text-[#adaaaa]"
            type="button"
          >
            <XIcon size={20} />
          </button>
        </div>

        <div style={{ marginBottom: 14 }}>
          {stops.slice(0, 2).map((stop, i) => (
            <ColorStop
              key={i}
              stop={stop}
              index={i}
              onChange={handleChange}
              onRemove={handleRemove}
              canRemove={stops.length > 2}
            />
          ))}
        </div>

        <button
          onClick={handleAdd}
          style={{
            width: "100%",
            padding: "8px 0",
            background: "rgba(255,255,255,0.05)",
            border: "1px dashed rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.5)",
            borderRadius: 10,
            cursor: "pointer",
            fontSize: 13,
            marginBottom: 14,
            transition: "background 0.15s, color 0.15s"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.09)";
            e.currentTarget.style.color = "rgba(255,255,255,0.8)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
          }}
          className="hidden opacity-0"
          disabled
        >
          + Añadir color
        </button>

        <p style={{
          textAlign: "center",
          fontSize: 11,
          marginTop: 12,
          marginBottom: 0,
          color: "rgba(255,255,255,0.5)"
        }}>
          Arrastra el panel para moverlo
        </p>
      </div>
    </DraggableWidget>
  )
}
