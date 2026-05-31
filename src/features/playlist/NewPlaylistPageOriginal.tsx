import React, { useState } from 'react';
import { usePlayer } from '../../shared/context/PlayerContext';
import { Sparkles, Image as ImageIcon, Check, ArrowLeft, Paintbrush } from 'lucide-react';

const COVER_PRESETS = [
  { id: 'pres1', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80', label: 'Electronic Neon' },
  { id: 'pres2', url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&q=80', label: 'Retro Festival' },
  { id: 'pres3', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80', label: 'Acoustic Soul' },
  { id: 'pres4', url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80', label: 'Live Rock Arena' },
  { id: 'pres5', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80', label: 'Cosmic Synth' },
  { id: 'pres6', url: 'https://images.unsplash.com/photo-1487180142328-054b783fc471?w=400&q=80', label: 'Classic Vinyl' }
];

const STYLE_PRESETS = [
  { name: 'Deep Space', bgColor: '#16192b', gradientColor: '#090a10' },
  { name: 'Sunset Fusion', bgColor: '#bf226e', gradientColor: '#300f2e' },
  { name: 'Forest Calm', bgColor: '#0e4a36', gradientColor: '#051d14' },
  { name: 'Crimson Storm', bgColor: '#8b1321', gradientColor: '#1d0205' },
  { name: 'Gold Luxury', bgColor: '#d4af37', gradientColor: '#1c1704' },
  { name: 'Cyberpunk Neon', bgColor: '#7928ca', gradientColor: '#0b0c10' },
  { name: 'Arctic Ice', bgColor: '#2575fc', gradientColor: '#12192a' },
  { name: 'Obsidian Matte', bgColor: '#3b3b3b', gradientColor: '#111111' }
];

const NewPlaylistPage: React.FC = () => {
  const { createPlaylist, openPlaylist, setView } = usePlayer();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState(COVER_PRESETS[0].url);
  const [bgColor, setBgColor] = useState(STYLE_PRESETS[0].bgColor);
  const [gradientColor, setGradientColor] = useState(STYLE_PRESETS[0].gradientColor);
  const [customColorsMode, setCustomColorsMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'My Curated Playlist';
    const finalDesc = description.trim() || 'Custom playlist styled by me.';

    const newId = createPlaylist(
      finalName,
      finalDesc,
      coverUrl,
      bgColor,
      gradientColor
    );

    // Jump straight to the newly styled playlist viewport!
    openPlaylist(newId);
  }

  return (
    <div className="px-8 pt-8 pb-32 min-h-full text-white select-none animate-fade-in bg-surface">
      {/* Return Row */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setView('library')}
          className="flex items-center gap-2 text-sm font-bold text-[#adaaaa] hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Library
        </button>
        <span className="text-white/20 select-none">|</span>
        <h1 className="text-lg font-headline font-bold">New Playlist Workshop</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_450px] gap-10 items-start">
        {/* Left Form controls */}
        <form onSubmit={handleSubmit} className="bg-[#131313] border border-white/5 p-8 rounded-2xl shadow-xl flex flex-col gap-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-2">
            <Paintbrush className="text-primary animate-pulse" size={20} />
            <span className="text-sm uppercase tracking-wider font-extrabold text-primary font-headline">
              Configure Playlist Visual Identity & Details
            </span>
          </div>

          {/* Title input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#adaaaa] uppercase tracking-wider">Playlist Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Morning Lofi Beats"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#262626] text-white border border-white/5 focus:border-primary/50 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Description input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-[#adaaaa] uppercase tracking-wider">Description</label>
            <textarea
              rows={3}
              placeholder="Give your playlist a lovely curated description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#262626] text-white border border-white/5 focus:border-primary/50 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {/* Color Styling Configuration Section */}
          <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
            <div className="flex justify-between items-center bg-white/3 p-3.5 rounded-lg border border-white/5">
              <div>
                <span className="text-xs font-black block">Playlist Mood Colors</span>
                <span className="text-[11px] text-[#adaaaa] leading-none">Determine the gradient aura of the playlist banner</span>
              </div>
              <button
                type="button"
                onClick={() => setCustomColorsMode(!customColorsMode)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer ${customColorsMode ? 'bg-primary text-black' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
              >
                {customColorsMode ? 'Use Presets' : 'Custom Specs (HEX)'}
              </button>
            </div>

            {customColorsMode ? (
              <div className="grid grid-cols-2 gap-4 animate-scale-up">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#adaaaa]">Primary Solid (bgColor)</label>
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
                  <label className="text-xs font-semibold text-[#adaaaa]">Aura Tint (gradientColor)</label>
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
            ) : (
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
                          <Check size={10} strokeWidth={4} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cover option */}
          <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#adaaaa] uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon size={14} /> Playlist Artwork Selection
              </label>
              <input
                type="text"
                placeholder="Paste an Unsplash image URL or click a preset below"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="bg-[#262626] text-white border border-white/5 focus:border-primary/50 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {COVER_PRESETS.map((preset) => {
                const isSelected = coverUrl === preset.url;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setCoverUrl(preset.url)}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? 'border-primary scale-[1.03] shadow-lg' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-102'
                      }`}
                    title={preset.label}
                  >
                    <img
                      src={preset.url}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Check className="text-primary font-black" size={18} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit action */}
          <div className="flex justify-end gap-3 border-t border-white/5 pt-6">
            <button
              type="button"
              onClick={() => setView('library')}
              className="px-6 py-3 bg-transparent hover:bg-white/5 text-white text-xs font-extrabold rounded-full transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-primary hover:bg-[#63ef82] text-black font-black text-xs rounded-full transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
            >
              <Sparkles size={14} fill="currentColor" stroke="none" />
              Build Playlist
            </button>
          </div>
        </form>

        {/* Right Preview Card */}
        <div className="bg-[#131313] border border-white/5 rounded-2xl p-6 shadow-xl sticky top-24 select-none">
          <p className="text-xs uppercase font-extrabold tracking-widest text-[#adaaaa] mb-4">Real-time Banner Preview</p>

          <div
            style={{
              background: `linear-gradient(to bottom, ${bgColor} 0%, #131313 100%)`
            }}
            className="rounded-xl overflow-hidden p-6 aspect-4/3 flex flex-col justify-end gap-4 shadow-2xl relative border border-white/5 transition-all duration-500"
          >
            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-[10px] text-primary font-bold px-2 py-1 rounded border border-white/5 uppercase select-none">
              In Design Mode
            </div>

            <div className="flex gap-4 items-end z-10 select-none">
              {/* Cover layout */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-[#262626] shadow-2xl overflow-hidden shrink-0 border border-white/10">
                <img
                  src={coverUrl}
                  alt="Artwork preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title descriptions */}
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <span className="text-[9px] uppercase font-extrabold tracking-widest text-white/80">Curated Playlist</span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-headline tracking-tighter truncate leading-none text-white shadow-sm">
                  {name || 'My Playlist Title'}
                </h2>
                <p className="text-[#adaaaa] text-[10.5px] font-medium leading-relaxed mt-1 line-clamp-2">
                  {description || 'Choose colors and details on the left block to live preview this customized design layout.'}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#adaaaa]/80 mt-1">
                  <span className="text-white hover:underline">franklemus</span>
                  <span>•</span>
                  <span>0 songs</span>
                  <span>•</span>
                  <span className="text-white/40">0 min</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 bg-[#262626]/40 p-4 rounded-xl border border-white/5 text-xs text-[#adaaaa]">
            <p className="font-bold text-white uppercase tracking-wider text-[10px] flex items-center gap-1">
              💡 Pro Tip:
            </p>
            <p className="leading-relaxed">
              Once created, search for any song under the <strong>Search Tab</strong> or homepage sections, and click the row context trigger to add the track straight to this customized card style!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPlaylistPage;