import { useEffect, useRef, useState } from "react";
import { CheckIcon, CloudUpload, Maximize2Icon, Minimize2Icon, XIcon } from "lucide-react";
import { STYLE_PRESETS } from "../../../shared/data/stylePresets";
import DraggableWidget from "../../../shared/components/DraggableWidget";

interface BackgroundColorProps {
  bgColor: string;
  gradientColor: string;
  isBackground: boolean;
  setBgColor: React.Dispatch<React.SetStateAction<string>>;
  setGradientColor: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onSave: () => void;
}

const BackgroundColor = (props: BackgroundColorProps) => {
  const { bgColor, gradientColor, isBackground, setBgColor, setGradientColor, onClose, onSave } = props;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [_wrapSize, setWrapSize] = useState({ width: 0, height: 0 });
  const [size, setSize] = useState({ width: 0, height: 0 });

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [bgColorValue, setBgColorValue] = useState(bgColor);
  const [gradientColorValue, setGradientColorValue] = useState(gradientColor);

  const divRef = useRef<HTMLDivElement>(null);

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

  const handleWidgetSize = () => {
    const mobileWidth = 768;

    setSize({
      width: isCollapsed ? 280 : window.innerWidth >= mobileWidth ? 535 : 300, // wrapSize.width,
      height: isCollapsed ? 74 : window.innerWidth >= mobileWidth ? 345 : 425, // wrapSize.height
    })
  }

  useEffect(() => {
    setWrapSize({
      width: divRef.current!.clientWidth,
      height: divRef.current!.clientHeight
    })
  }, [isCollapsed]);

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
        className="bg-[#282828] min-w-full min-h-full z-100 flex flex-col gap-4 border-white/5 p-6 rounded"
        ref={divRef}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center rounded-lg">
          <span className="text-sm font-black block">
            Color de fondo
          </span>

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

        {/* MOBILE */}
        <div className={`${isCollapsed ? 'mt-1' : 'mt-0'} md:hidden grid grid-cols-2 gap-4 animate-scale-up`}>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-6 h-6.5 outline-none border-none rounded cursor-pointer bg-transparent"
              />
              <label className="text-xs font-semibold text-[#adaaaa]">
                Sólido
              </label>
            </div>
            <input
              type="text"
              value={bgColorValue}
              onChange={(e) => onBgColorChange(e.target.value)}
              className="bg-[#262626] w-full h-10 text-xs font-mono text-white text-center focus:outline-none border border-white/10 rounded"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center gap-2">
              <input
                type="color"
                value={gradientColor}
                onChange={(e) => setGradientColor(e.target.value)}
                className="w-6 h-6.5 outline-none border-none rounded cursor-pointer bg-transparent"
              />
              <label className="text-xs font-semibold text-[#adaaaa]">
                Gradiente
              </label>
            </div>

            <input
              type="text"
              value={gradientColorValue}
              onChange={(e) => onGradientColorChange(e.target.value)}
              className="bg-[#262626] w-full h-10 text-xs font-mono text-white text-center focus:outline-none border border-white/10 rounded"
            />
          </div>
        </div>

        {/* DESKTOP */}
        <div className={`${isCollapsed ? 'mt-1' : 'mt-0'} md:grid hidden grid-cols-2 gap-4 animate-scale-up`}>
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
          className="md:overflow-hidden overflow-y-auto overflow-x-hidden"
          id="playlist-background-presets"
        >
          <div className="md:grid-cols-4 grid grid-cols-2 max-h-49.5 animate-fade-in">
            {STYLE_PRESETS.map((preset) => {
              const isSelected = bgColor === preset.bgColor && gradientColor === preset.gradientColor;

              return (
                <button
                  onClick={() => {
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
    </DraggableWidget >
  )
}

export default BackgroundColor;