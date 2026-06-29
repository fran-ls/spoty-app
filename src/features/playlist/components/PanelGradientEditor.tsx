import { useEffect, useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import type { GradientEditorStop } from "../gradientEditor.types";
import { STYLE_PRESETS } from "../../../shared/data/stylePresets";

type Stop = GradientEditorStop & { label: string }

interface PanelGradientEditorProps {
  isActive: boolean;
  bgColor: string;
  gradientColor: string;
  setBgColor: React.Dispatch<React.SetStateAction<string>>;
  setGradientColor: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onSave: () => void;
}

const PanelGradientEditor = (props: PanelGradientEditorProps) => {
  const { isActive, bgColor, gradientColor, setBgColor, setGradientColor, onClose } = props;

  const [bgColorValue, setBgColorValue] = useState(bgColor);
  const [gradientColorValue, setGradientColorValue] = useState(gradientColor);

  const [direction] = useState<string>("to bottom");
  const [stops, setStops] = useState<Stop[]>([
    { label: 'Sólido', color: bgColor, pos: 0 },
    { label: 'Gradiente', color: gradientColor, pos: 50 },
    { label: '', color: "#131313", pos: 100 }
  ]);

  const onBgColorChange = (value: string) => {
    setBgColorValue(value);

    if (value.length === 7) {
      setBgColor(value);
    }
  }

  const onGradientColorChange = (value: string) => {
    setGradientColorValue(value);

    if (value.length === 7) {
      setGradientColor(value);
    }
  }

  useEffect(() => {
    const sorted = [...stops].sort((a, b) => a.pos - b.pos);
    setBgColor(sorted[0].color);
    setGradientColor(sorted[1].color);
  }, [stops, direction]);

  return (
    <div className={`${isActive ? 'translate-y-0' : 'translate-y-[100vh]'} absolute left-0 bottom-0 z-50 transition duration-150 bg-[#282828] min-w-full flex flex-col gap-4 border-white/5 p-6 rounded`}>
      {/* HEADER */}
      <div className="flex justify-between items-center rounded-lg">
        <span className="text-[#adaaaa] text-sm font-black block">
          Color de fondo
        </span>

        <div className="flex items-center gap-2">
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

      {/* DESKTOP */}
      <div className="md:grid hidden grid-cols-2 gap-4 animate-scale-up">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[#adaaaa]">
            Sólido
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-10 outline-none border-none rounded cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={bgColorValue}
              onChange={(e) => onBgColorChange(e.target.value)}
              className="bg-[#262626] w-full text-xs font-mono text-white text-center focus:outline-none border border-white/10 rounded"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[#adaaaa]">
            Gradiente
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={gradientColor}
              onChange={(e) => setGradientColor(e.target.value)}
              className="w-10 h-10 outline-none border-none rounded cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={gradientColorValue}
              onChange={(e) => onGradientColorChange(e.target.value)}
              className="bg-[#262626] w-full text-xs font-mono text-white text-center focus:outline-none border border-white/10 rounded"
            />
          </div>
        </div>
      </div>

      {/* PRESETS */}
      <div
        className="lg:overflow-hidden overflow-y-auto overflow-x-hidden"
        id="playlist-background-presets"
      >
        <div className="md:grid-cols-3 grid grid-cols-2 max-h-50 animate-fade-in">
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

                  onBgColorChange(preset.bgColor);
                  onGradientColorChange(preset.gradientColor);
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
    </div>
  )
}

export default PanelGradientEditor;