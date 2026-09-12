import { useEffect, useRef, useState } from "react";
import { CheckIcon, CloudUpload, Maximize2Icon, Minimize2Icon, XIcon } from "lucide-react";
import { STYLE_PRESETS } from "../../../shared/data/stylePresets";
import DraggableWidget from "../../../shared/components/DraggableWidget";
import type { PlaylistDTO } from "../playlist.types";

interface BackgroundColorProps {
  bgColor: string;
  gradientColor: string;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  setForm: React.Dispatch<React.SetStateAction<PlaylistDTO>>;
}

const BackgroundColor = (props: BackgroundColorProps) => {
  const { bgColor, gradientColor, open, setForm, onClose, onSave } = props;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [draggable, setDraggable] = useState(window.innerWidth >= 500);

  const [wrapSize, setWrapSize] = useState({
    width: '100%' as string | number,
    height: '100%' as string | number
  });

  const contentRef = useRef<HTMLDivElement>(null);

  const handleWidgetSize = () => {
    const mobileWidth = 768;

    setWrapSize({
      width: isCollapsed ? window.innerWidth >= 535 ? 280 : '100vw' : window.innerWidth >= mobileWidth ? 535 : '100vw',
      height: isCollapsed ? 74 : window.innerWidth >= mobileWidth ? 345 : 243
    });

    setDraggable(window.innerWidth >= 500);
  }

  useEffect(() => { handleWidgetSize() }, [isCollapsed]);

  useEffect(() => {
    window.addEventListener('resize', handleWidgetSize);
    return () => window.removeEventListener('resize', handleWidgetSize);
  }, []);

  return (
    <DraggableWidget
      draggable={draggable}
      isOpen={open}
      style={{
        ...wrapSize,
        maxWidth: 535,
        zIndex: 10
      }}
    >
      <div
        className="max-w-133.75 bg-[#282828] z-100 flex flex-col gap-4 border-white/5 p-6 rounded"
        ref={contentRef}
      >
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

        <div className={`${isCollapsed ? 'mt-1' : 'mt-0'} grid grid-cols-2 gap-3.5`}>
          {[
            {
              label: 'Sólido',
              value: bgColor,
              onChange: (e: any) => setForm((prev) => ({
                ...prev,
                bgColor: e.target.value
              }))
            },
            {
              label: 'Gradiente',
              value: gradientColor,
              onChange: (e: any) => setForm((prev) => ({
                ...prev,
                gradientColor: e.target.value
              }))
            },
          ].map((input, i) => (
            <div className="flex flex-col gap-2" key={input.label || i}>
              <label className="text-xs font-semibold text-[#adaaaa]">
                {input.label}
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={input.value}
                  onChange={input.onChange}
                  className="shrink-0 w-9 h-10 outline-none border-none rounded cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={input.value}
                  onChange={input.onChange}
                  className="bg-[#262626] w-full text-xs font-mono text-white text-center focus:outline-none border border-white/10 rounded"
                />
              </div>
            </div>
          ))}
        </div>

        <div
          className="md:overflow-hidden overflow-x-auto"
          id="playlist-background-presets"
        >
          <div className="md:grid md:grid-cols-4 flex max-h-35 animate-fade-in">
            {STYLE_PRESETS.map((preset) => {
              const isSelected = bgColor === preset.bgColor && gradientColor === preset.gradientColor;

              return (
                <button
                  onClick={() => setForm((prev) => ({
                    ...prev,
                    bgColor: preset.bgColor,
                    gradientColor: preset.gradientColor
                  }))}
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

        <p
          className="hidden md:block mt-3 mb-0 text-[11px] text-center"
          style={{
            color: "rgba(255,255,255,0.5)"
          }}
        >
          Arrastra el panel para moverlo
        </p>
      </div>
    </DraggableWidget >
  )
}

export default BackgroundColor;