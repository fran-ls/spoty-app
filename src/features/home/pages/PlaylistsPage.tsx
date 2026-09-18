import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Playlist, PlaylistFilters } from "../../playlist/playlist.types";
import type { IncludeArgs } from "../../../shared/types/common.types";
import SmartImage from "../../../shared/components/SmartImage";
import PlaylistCoverImgs from "../../playlist/components/PlaylistCoverImgs";
import { PauseIcon, PlayIcon } from "lucide-react";
import usePlayer from "../../player/hooks/usePlayer";
import { routes } from "../../../shared/utils/routes";
import playlistService from "../../playlist/services/playlist.service";
import libraryService from "../../library/services/library.service";
import Loader from "../../../shared/components/Loader";
import { paginationMeta } from "../../../shared/data/search.data";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";

const PlaylistsPage = () => {
  const { isPlaying, currentPlaylist, play, togglePlay, onPlaylistChange } = usePlayer();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [meta, setMeta] = useState(paginationMeta);
  const [page, setPage] = useState(1);

  const filters: PlaylistFilters = {
    page,
    orderBy: 'createdAt',
    order: 'desc'
  }

  const navigate = useNavigate();

  const { loaderRef } = useInfiniteScroll(async () => {
    if (page === 1 || paginationMeta.hasNextPage) {
      await getPlaylists(filters);
      setPage(page + 1);
    }
  });

  async function getPlaylists(
    filters?: PlaylistFilters,
    include?: Record<string, IncludeArgs>
  ) {
    const { data } = await libraryService.getUserPlaylists(filters, include);
    if (!data) return data;

    setMeta({
      ...paginationMeta,
      ...data.meta
    });

    (filters?.page && filters.page > 1)
      ? setPlaylists([...playlists, ...data.items])
      : setPlaylists(data.items);

    return data;
  }

  async function onPlay({ playlist, isCurrent }: {
    playlist: Playlist;
    playable: boolean;
    isCurrent: boolean;
  }) {
    if (isCurrent) {
      togglePlay();
      return true;
    }

    const { data } = await playlistService.getPlaylistSongs(playlist.id);
    if (!data || !data.songs.length) return false;

    play(data.songs, 0, data.meta);
    onPlaylistChange(playlist);
    return true;
  }

  useEffect(() => { getPlaylists(filters) }, []);

  return (
    <div className="overflow-hidden w-full h-full text-[#adaaaa] relative py-10">
      <div className="mb-8 overflow-auto max-h-[calc(100vh-64px-88px)] md:px-8 px-2">
        <h1 className="mx-auto md:text-3xl text-2xl font-bold text-white">
          Tus listas
        </h1>
      </div>

      <div className="gap-y-3 md:px-6 px-2 grid grid-cols-2 min-[500px]:grid-cols-3 min-[700px]:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]">
        {playlists.map((it) => {
          const cover = playlistService.playlistCover(it.id, it.cover);
          const isCurrent = it.id === currentPlaylist?.id;
          const isCoverImgs = it.coverImages && it.coverImages.length > 3;
          const redirectTo = `${routes.playlists}/${it.id}`;

          let playable = true;

          return (
            <div
              className="group h-fit group hover:bg-[#1f1f1f] p-3 rounded-lg transition-all duration-300 flex flex-col playlist-item cursor-pointer"
              onClick={() => navigate(redirectTo)}
              key={it.id}
            >
              <div className="shadow-[0_8px_24px_#00000080] relative mb-2 aspect-square rounded-md overflow-hidden bg-[#333333]">
                <SmartImage
                  wrapClassName="bg-transparent"
                  referrerPolicy="no-referrer"
                  url={cover}
                  styles={{
                    imgWrap: 'w-full h-full bg-transparent',
                    icon: 'w-[40%] h-[40%]'
                  }}
                />

                {!cover && isCoverImgs && (
                  <PlaylistCoverImgs images={it.coverImages || []} />
                )}

                {playable && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      playable = await onPlay({
                        isCurrent,
                        playlist: it,
                        playable: it.trackCount > 0
                      });
                    }}
                    className={`shadow-[0_8px_8px_rgba(0,0,0,0.3)] absolute bottom-3 right-3 bg-primary text-black p-3 rounded-full opacity-0 ${isPlaying && isCurrent ? 'translate-y-0 opacity-100' : 'translate-y-3'} group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-105`}
                    type="button"
                  >
                    {isPlaying && isCurrent
                      ? <PauseIcon size={24} fill="currentColor" stroke="none" />
                      : <PlayIcon size={24} fill="currentColor" stroke="none" />
                    }
                  </button>
                )}
              </div>

              <Link
                className="hover:underline"
                onClick={(e) => e.stopPropagation()}
                to={redirectTo}
              >
                <h3
                  className="font-light text-white mb-0 truncate text-sm sm:text-base google-sans-flex-font"
                  title={it.name}
                >
                  {it.name}
                </h3>
              </Link>

              <p className="text-sm text-[#adaaaa] line-clamp-2 leading-relaxed">
                Lista
              </p>
            </div>
          )
        })}

        {meta.hasNextPage && (
          <div
            className="flex items-center justify-center"
            ref={loaderRef}
          >
            <Loader
              className="border-[#adaaaa5d] border-t-white"
              size={20}
              stroke={1}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaylistsPage;