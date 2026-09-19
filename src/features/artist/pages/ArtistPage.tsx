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
import BackgroundColor from "../../playlist/components/BackgroundColor";

const ArtistPage = () => {
  const [page, setPage] = useState(0);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [layout, setLayout] = useState<PlaylistLayout>(PlaylistLayout.LIST);

  const [openBgEditor, setOpenBgEditor] = useState(false);
  const [form, setForm] = useState({
    name: '',
    bgColor: '',
    gradientColor: ''
  });

  const { id } = useParams();
  const { play, onPlaylistChange } = usePlayer();
  const { tracks, trackMeta, searchTracks } = useTrack();

  const cover = artist ? artistService.artistImage(artist.id, artist.image) : null;
  const isDesktop = getDeviceType() === 'desktop';
  const textShadow = '0px 0px 4px rgba(0,0,0,0.3)';

  const colors = useMemo(() => ({
    bg: form.bgColor,
    base: form.gradientColor,
    base70: convertColor(form.gradientColor, 'hsl', 70)
  }), [form]);

  useEffect(() => {
    if (id) {
      searchTracks({ artistId: id });
      artistService.getArtist(id).then(({ data }) => {
        if (!data) return;
        setArtist(data);
        setForm({
          name: data.name,
          bgColor: data.bgColor || playlistBg.bgColor,
          gradientColor: data.bgBase || playlistBg.gradientColor
        });
      });
    }
  }, [id]);

  return (
    <div className={`${STYLES.maxHeightMain} text-white select-none relative overflow-hidden`}>
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
              className={`min-[500px]:mb-0 max-[500px]:mt-5 min-[500px]:truncate line-clamp-2 font-black ${window.innerWidth >= 500 ? 'playlist-title google-sans-flex-font text-4xl' : 'text-2xl google-sans-flex-font'}`}
              title={artist?.name}
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
          isOwner={false}
          playable={tracks.length > 0}
          setLayout={setLayout}
          setOpenBgEditor={setOpenBgEditor}
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

      <BackgroundColor
        open={openBgEditor}
        bgColor={form.bgColor}
        gradientColor={form.gradientColor}
        setForm={setForm as any}
        onClose={() => setOpenBgEditor(false)}
        onSave={async () => {
          if (!artist?.id) return;
          const { data } = await artistService.updateArtist(artist.id, {
            ...form,
            bgColor: form.bgColor,
            bgBase: form.gradientColor
          });
          if (data?.id) setOpenBgEditor(false);
        }}
      />
    </div>
  )
}

export default ArtistPage;