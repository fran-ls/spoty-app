import { useState, useRef, useEffect } from "react";
import { CheckIcon, CloudUpload, Maximize2Icon, Minimize2Icon, XIcon } from "lucide-react";
import type { GradientEditorDirection, GradientEditorStop, GradientEditorStopKey } from "../gradientEditor.types";
import DraggableWidget from "../../../shared/components/DraggableWidget";
import { STYLE_PRESETS } from "../../../shared/data/stylePresets";

type Stop = GradientEditorStop & { label: string }

interface ColorStopProps {
  label: string;
  stop: GradientEditorStop;
  index: number;
  canRemove: boolean;
  onChange: (index: number, key: GradientEditorStopKey, value: string | number) => void;
  onRemove: (index: number) => void;
}

const DIRECTIONS: GradientEditorDirection[] = [
  { label: "↓ Vertical", value: "to bottom" },
  { label: "→ Horizontal", value: "to right" },
  { label: "↘ Diagonal", value: "135deg" },
  { label: "↗ Diagonal inv.", value: "45deg" },
  { label: "↑ Invertido", value: "to top" },
];

function ColorStop({ label, stop, index, canRemove, onRemove, onChange }: ColorStopProps) {
  return (
    <div>
      <div className="space-y-2">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <input
              type="color"
              value={stop.color}
              onChange={(e) => onChange(index, "color", e.target.value)}
              className="w-6 h-6.5 outline-none border-none rounded cursor-pointer bg-transparent"
            />
            <label className="text-xs font-semibold text-[#adaaaa]">
              {label}
            </label>
            <span style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
              marginLeft: "auto",
            }}>
              {stop.pos}%
            </span>
          </div>
          <input
            type="range"
            min={0} max={100} step={1}
            value={stop.pos}
            onChange={(e) => {
              const value = e.target.value;

              if (value.length < 8) {
                onChange(index, "pos", Number(e.target.value))
              }
            }}
            style={{
              width: "100%",
              accentColor: stop.color
            }}
          />
        </div>

        <input
          type="text"
          value={stop.color}
          onChange={(e) => onChange(index, "color", e.target.value)}
          className="bg-[#262626] w-full h-10 text-xs font-mono text-white text-center focus:outline-none border border-white/10 rounded"
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
            display: "none",
            alignItems: "center",
            justifyContent: "center"
          }}
          aria-label="Eliminar color"
          disabled
        >
          <XIcon size={16} />
        </button>
      )}
    </div>
  )
}

interface GradientEditorProps {
  isBackground: boolean;
  bgColor: string;
  gradientColor: string;
  setGradientCSS: React.Dispatch<React.SetStateAction<string>>;
  setBgColor: React.Dispatch<React.SetStateAction<string>>;
  setGradientColor: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onSave: () => void;
}

export default function GradientEditor(props: GradientEditorProps) {
  const {
    isBackground, bgColor, gradientColor, setGradientCSS, onClose,
    setBgColor, setGradientColor, onSave
  } = props;

  const divRef = useRef<HTMLDivElement>(null);

  const [direction, setDirection] = useState<string>("to bottom");
  const [stops, setStops] = useState<Stop[]>([
    { label: 'Sólido', color: bgColor, pos: 0 },
    { label: 'Gradiente', color: gradientColor, pos: 50 },
    { label: '', color: "#131313", pos: 100 }
  ]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const handleChange = (i: number, key: GradientEditorStopKey, val: string | number): void => {
    setStops((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));
  }

  const handleRemove = (i: number): void => {
    setStops((prev) => prev.filter((_, idx) => idx !== i));
  }

  // const handleAdd = (): void => {
  //   setStops((prev) => [...prev, { color: "#ffffff", pos: 50 }]);
  // }

  const handleWidgetSize = () => {
    const mobileWidth = 1024;

    setSize({
      width: isCollapsed ? 280 : window.innerWidth >= mobileWidth ? 535 : 300,
      height: isCollapsed ? 74 : window.innerWidth >= mobileWidth ? 390 : 390
    });
  }

  useEffect(() => {
    const sorted = [...stops].sort((a, b) => a.pos - b.pos);
    const gradientStops = sorted.map((s) => `${s.color} ${s.pos}%`).join(", ");
    const gradientCSS = `linear-gradient(${direction}, ${gradientStops})`;

    setGradientCSS(gradientCSS);
    setBgColor(sorted[0].color);
    setGradientColor(sorted[1].color);
  }, [stops, direction]);

  useEffect(() => { handleWidgetSize() }, [isCollapsed]);

  useEffect(() => {
    const handleScreenSize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleScreenSize);
    return () => window.removeEventListener('resize', handleScreenSize);
  }, []);

  useEffect(() => handleWidgetSize(), [screenWidth]);

  return (
    <DraggableWidget
      isBackground={isBackground}
      size={size}
    >
      <div
        className="bg-[#282828] min-w-full min-h-full h-full z-100 flex flex-col gap-4 border-white/5 p-6 rounded"
        ref={divRef}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center rounded-lg">
          <span className="text-sm font-black block">
            Color de fondo
          </span>

          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            style={{
              display: window.innerWidth >= 1024 && !isCollapsed ? 'inline-block' : 'none',
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.8)",
              borderRadius: 4,
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

          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className="text-xs font-bold p-1 rounded-full transition-all cursor-pointer text-[#adaaaa] hover:bg-white/10"
              title="Guardar"
              type="button"
            >
              <CloudUpload size={20} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapsed(!isCollapsed)
              }}
              className="text-xs font-bold p-1.5 rounded-full transition-all cursor-pointer text-[#adaaaa] hover:bg-white/10"
              title={isCollapsed ? 'Maximizar' : 'Minimizar'}
              type="button"
            >
              {!isCollapsed
                ? <Minimize2Icon size={16} />
                : <Maximize2Icon size={16} />}
            </button>

            <button
              onClick={onClose}
              className="text-xs font-bold p-1 rounded-full transition-all cursor-pointer text-[#adaaaa] hover:bg-white/10"
              title="Cerrar"
              type="button"
            >
              <XIcon size={20} />
            </button>
          </div>
        </div>

        {/* INPUTS */}
        <div className={`${isCollapsed ? 'mt-1' : 'mt-0'} grid grid-cols-2 gap-4 animate-scale-up`}>
          {stops.slice(0, 2).map((stop, i) => (
            <ColorStop
              key={i}
              stop={stop}
              index={i}
              onChange={handleChange}
              onRemove={handleRemove}
              canRemove={stops.length > 2}
              label={stop.label}
            />
          ))}
        </div>

        {/* PRESETS */}
        <div
          className="lg:overflow-hidden overflow-y-auto overflow-x-hidden"
          id="playlist-background-presets"
        >
          <div className="lg:grid-cols-4 grid grid-cols-2 max-h-35 animate-fade-in">
            {STYLE_PRESETS.map((preset) => {
              const isSelected = bgColor === preset.bgColor && gradientColor === preset.gradientColor;

              return (
                <button
                  onClick={() => {
                    setStops([
                      { label: 'Sólido', color: preset.bgColor, pos: 0 },
                      { label: 'Gradiente', color: preset.gradientColor, pos: 50 },
                      { label: '', color: "#131313", pos: 100 }
                    ]);

                    setBgColor(preset.bgColor);
                    setGradientColor(preset.gradientColor);
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${preset.bgColor} 0%, ${preset.gradientColor} 100%)`
                  }}
                  className="m-1 min-w-28 w-28 h-14 rounded-lg flex flex-col justify-end p-2 border border-white/10 hover:scale-105 active:scale-95 transition-all text-left relative group cursor-pointer shadow-md select-none"
                  key={preset.name}
                  type="button"
                >
                  <span className="text-[9.5px] font-black text-white bg-black/60 px-1.5 py-0.5 rounded tracking-wide leading-none select-none">
                    {preset.name}
                  </span>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 bg-primary text-black rounded-full p-0.5">
                      <CheckIcon size={10} strokeWidth={4} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

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
