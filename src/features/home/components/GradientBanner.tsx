import type { Playlist } from "../../playlist/playlist.types";

interface GradientBannerProps {
  playlist: Playlist;
  bannerRef: React.RefObject<HTMLDivElement | null>;
}

const GradientBanner = ({ playlist, bannerRef }: GradientBannerProps) => {
  const banner = bannerRef.current;

  return (
    <div
      className="-z-1 w-full absolute top-0 left-0"
      style={{
        ...(banner && {
          height: banner.offsetHeight + 110
        })
      }}
    >
      <div className="w-full h-full relative">
        <div
          style={{
            ...(playlist ? {
              background: `linear-gradient(to bottom, ${playlist.bgColor} 0%, #131313 100%)`
            } : {
              background: `linear-gradient(to bottom, #282828 0%, #131313 100%)`
            })
          }}
          className="w-full h-full transition-all duration-[3s] absolute top-0 left-0"
        />

        <div
          style={{
            ...(playlist && {
              background: `linear-gradient(color-mix(in srgb, ${playlist.bgColor} 30%, #131313), #131313 100%)`
            })
          }}
          className="w-full h-full transition-all duration-[3s] absolute top-0 left-0"
        />
      </div>
    </div>
  )
}

export default GradientBanner;