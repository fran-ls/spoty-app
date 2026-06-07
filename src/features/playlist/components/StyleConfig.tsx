import { CheckIcon, XIcon } from "lucide-react";
import { STYLE_PRESETS } from "../../../shared/data/stylePresets";

interface StyleConfigProps {
  bgColor: string;
  gradientColor: string;
  setBgColor: React.Dispatch<React.SetStateAction<string>>;
  setGradientColor: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
}

const StyleConfig = (props: StyleConfigProps) => {
  const { bgColor, gradientColor, setBgColor, setGradientColor, onClose } = props;

  return (
    <div className=" bg-[#282828] z-100 flex flex-col gap-4 border-white/5 p-6 rounded absolute top-0 left-1/4">
      <div className="flex justify-between items-center rounded-lg">
        <span className="text-sm font-black block">
          Color de fondo
        </span>
        <button
          type="button"
          onClick={onClose}
          className={`text-xs font-bold p-1 rounded-full transition-all cursor-pointer text-[#adaaaa] hover:bg-white/10`}
        >
          <XIcon size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 animate-scale-up">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[#adaaaa]">
            Sólido primario (bgColor)
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
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="bg-[#262626] w-full text-xs font-mono text-white text-center focus:outline-none border border-white/10 rounded"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[#adaaaa]">
            Tinte de aura (gradientColor)
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
              value={gradientColor}
              onChange={(e) => setGradientColor(e.target.value)}
              className="bg-[#262626] w-full text-xs font-mono text-white text-center focus:outline-none border border-white/10 rounded"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5 animate-fade-in">
        {STYLE_PRESETS.map((preset) => {
          const isSelected = bgColor === preset.bgColor && gradientColor === preset.gradientColor;
          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                setBgColor(preset.bgColor);
                setGradientColor(preset.gradientColor);
              }}
              style={{
                background: `linear-gradient(135deg, ${preset.bgColor} 0%, ${preset.gradientColor} 100%)`
              }}
              className="h-14 rounded-lg flex flex-col justify-end p-2 border border-white/10 hover:scale-105 active:scale-95 transition-all text-left relative group cursor-pointer shadow-md select-none"
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
  )
}

export default StyleConfig;