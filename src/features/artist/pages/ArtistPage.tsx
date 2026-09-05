import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckIcon } from "lucide-react";
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

const ArtistPage = () => {
  const [page, setPage] = useState(1);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [layout, setLayout] = useState<PlaylistLayout>(PlaylistLayout.LIST);

  const { id } = useParams();
  const { play, onPlaylistChange } = usePlayer();
  const { tracks, trackMeta, searchTracks } = useTrack();

  const cover = artist ? artistService.artistImage(artist.id, artist.image) : null;

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
    <div className={`${STYLES.maxHeightMain} ${STYLES.minHeightMain} text-white overflow-auto animate-fade-in relative`}>
      <div
        style={{
          background: `linear-gradient(in oklch to bottom, ${colors.bg} 0%, ${colors.base} 100%)`
        }}
        className="pt-10 min-[500px]:flex-row min-[500px]:pb-6 pb-3 p-6 flex-col flex items-center gap-x-6 overflow-hidden relative"
      >
        {cover && (
          <img
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={cover}
            onError={(e) => e.currentTarget.style.display = 'none'}
            alt="cover"
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          />
        )}

        <div className="z-2 overflow-hidden mt-auto w-full">
          <h1
            className={`text-4xl font-black truncate ${window.innerWidth >= 500 ? 'playlist-title google-sans-flex-font' : 'playlist-title-font'}`}
            title={artist?.name}
            style={{
              textShadow: '0px 0px 4px rgba(0,0,0,0.3)'
            }}
          >
            {artist?.name || 'Artista'}
          </h1>

          <div className="flex items-center gap-2">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="bg-primary text-[#131313] cursor-pointer rounded-full p-1 transition-transform hover:scale-110 active:scale-95"
            >
              <CheckIcon className="" size={16} />
            </div>

            <span className="text-sm font-medium">
              Artista
            </span>
          </div>

          <div className="mt-2 flex items-center">
            <span className="text-sm text-nowrap">
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
    </div>
  )
}

export default ArtistPage;