import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckIcon, UserIcon } from "lucide-react";
import type { Artist } from "../artist.types";
import { STYLES } from "../../../shared/utils/styles";
import artistService from "../services/artist.service";
import ActionBar from "../components/ActionBar";
import useTrack from "../../song/hooks/useTrack";
import ArtistSongs from "../components/ArtistSongs";
import usePlayer from "../../player/hooks/usePlayer";
import { PlaylistLayout } from "../../library/library.types";
import { playlistBg } from "../../../shared/data/stylePresets";
import { convertColor } from "../../playlist/utils/convertColor";
import { CustomScrollbar } from "../../../shared/components/CustomScrollbar";
import SmartImage from "../../../shared/components/SmartImage";
import { getDeviceType } from "../../../shared/utils/getDeviceType";

const ArtistPage = () => {
  const [page, setPage] = useState(0);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [layout, setLayout] = useState<PlaylistLayout>(PlaylistLayout.LIST);

  const { id } = useParams();
  const { play, onPlaylistChange } = usePlayer();
  const { tracks, trackMeta, searchTracks } = useTrack();

  const cover = artist ? artistService.artistImage(artist.id, artist.image) : null;
  const isDesktop = getDeviceType() === 'desktop';
  const textShadow = '0px 0px 4px rgba(0,0,0,0.3)';

  const colors = useMemo(() => ({
    bg: playlistBg.bgColor,
    base: playlistBg.gradientColor,
    base70: convertColor(playlistBg.gradientColor, 'hsl', 70)
  }), []);

  useEffect(() => {
    if (id) {
      searchTracks({ artistId: id });
      artistService.getArtist(id).then(({ data }) => setArtist(data));
    }
  }, [id]);

  return (
    <CustomScrollbar
      scrollbarMode="vertical"
      viewport={{
        className: `${STYLES.maxHeightMain} ${STYLES.minHeightMain} text-white overflow-auto animate-fade-in relative`
      }}
    >
      <div
        style={{
          background: `linear-gradient(in oklch to bottom, ${colors.bg} 0%, ${colors.base} 100%)`
        }}
        className="pt-10 min-[500px]:flex-row min-[500px]:pb-6 pb-3 p-6 flex-col flex items-center gap-x-6 overflow-hidden relative"
      >
        <SmartImage
          styles={{
            imgWrap: "min-w-40 min-h-40 w-[25vw] h-[25vw] min-[500px]:hidden block text-[#7f7f7f] shadow-[0_4px_60px_#00000080] rounded-full object-cover"
          }}
          icon={<UserIcon className="w-[30%] h-[30%]" />}
          url={cover}
        />

        {cover && (
          <img
            className="min-[500px]:block hidden absolute top-0 left-0 w-full h-full object-cover"
            src={cover}
            onError={(e) => e.currentTarget.style.display = 'none'}
            alt="cover"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        )}

        <div className="z-2 overflow-hidden mt-auto w-full">
          <h1
            className={`max-[500px]:mt-5 max-[500px]:mb-2 text-4xl min-[500px]:font-black font-normal truncate ${window.innerWidth >= 500 ? 'playlist-title google-sans-flex-font' : 'playlist-title-font'}`}
            title={artist?.name}
            style={{ textShadow }}
          >
            {artist?.name || 'Artista'}
          </h1>

          {isDesktop && (
            <div className="flex items-center gap-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="bg-primary text-[#131313] cursor-pointer rounded-full p-1 transition-transform hover:scale-110 active:scale-95"
              >
                <CheckIcon className="" size={16} />
              </div>

              <span
                className="text-sm font-medium"
                style={{ textShadow }}
              >
                Artista
              </span>
            </div>
          )}

          <div className="mt-2 flex items-center">
            <span
              className="text-sm text-nowrap"
              style={{ textShadow }}
            >
              {tracks.length} {tracks.length !== 1 ? 'canciones' : 'canción'}
            </span>
          </div>
        </div>
      </div>

      <ActionBar
        layout={layout}
        artist={artist}
        colors={colors}
        playable={tracks.length > 0}
        setLayout={setLayout}
        onPlay={() => {
          play(tracks, 0, trackMeta);
          onPlaylistChange(null);
        }}
      />

      {(tracks.length > 0) && (
        <ArtistSongs
          layout={layout}
          items={tracks}
          paginationMeta={trackMeta}
          loadMore={async () => {
            if (page > trackMeta.totalPages) return;
            const nextPage = page + 1;
            await searchTracks({
              artistId: id,
              page: nextPage
            });
            setPage(nextPage);
          }}
        />
      )}
    </CustomScrollbar>
  )
}

export default ArtistPage;