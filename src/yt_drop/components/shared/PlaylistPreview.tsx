import type { Playlist } from "../../types/upload.types";
import SmartImage from "../../../shared/components/SmartImage";

const PlaylistPreview = ({ playlist }: { playlist: Playlist }) => {
  const cover = playlist.cover || playlist.coverUrl;

  return (
    <>
      <div
        className="gradient-preview w-full hidden"
        style={{
          background: `linear-gradient(in oklch to bottom, ${playlist.bgColor} 0%, ${playlist.gradientColor} 100%)`,
          marginTop: '10px'
        }}
        id="gradient-preview"
      />

      <div
        className="overflow-hidden p-2 rounded-lg flex gap-2 flex-1"
        style={{
          background: `linear-gradient(in oklch to bottom, ${playlist.bgColor} 0%, ${playlist.gradientColor} 100%)`,
          marginTop: 10,
          padding: 8
        }}
      >
        <SmartImage
          wrapClassName={`text-[#adaaaa] shadow-[0_4px_60px_#00000080] rounded min-h-12.5 min-w-12.5`}
          styles={{
            imgWrap: {
              background: playlist.bgColor
            }
          }}
          url={cover}
        />

        <div
          className="block h-fit overflow-hidden"
          style={{
            marginTop: 10
          }}
        >
          <span className="block text-[10px] m-0 text-[#adaaaa]">
            Lista pública
          </span>
          <h1
            className="text-xl google-sans-flex-font truncate"
            style={{
              lineHeight: 1
            }}
          >
            {playlist.name || 'Mi lista'}
          </h1>
        </div>
      </div>
    </>
  )
}

export default PlaylistPreview;