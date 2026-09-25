import { useEffect, useState } from "react";
import type { SearchFilter } from "./SearchHeader";
import type { Playlist, PlaylistFilters, PlaylistInclude, PlaylistSong } from "../../playlist/playlist.types";
import { routes } from "../../../shared/utils/routes";
import PlaylistCard from "./PlaylistCard";
import SearchItem from "./SearchItem";
import usePlayer from "../../player/hooks/usePlayer";
import playlistService from "../../playlist/services/playlist.service";
import { paginationMeta } from "../../../shared/data/search.data";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import Loader from "../../../shared/components/Loader";

interface PlaylistResultsProps {
  filter: SearchFilter;
  query: string;
  hoverId: string;
  setHoverId: React.Dispatch<React.SetStateAction<string>>;
}

const PlaylistResults = ({ filter, query, hoverId, setHoverId }: PlaylistResultsProps) => {
  const { queue, currentPlaylist, togglePlay, play, onPlaylistChange, setQueue, setQueueMeta } = usePlayer();
  const isPlaylistFilter = filter === 'playlists';

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [tracks, setTracks] = useState<PlaylistSong[]>([]);
  const [currentPlaylistId, setCurrentPlaylistId] = useState('');

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(paginationMeta);
  const filters: PlaylistFilters = {
    page: 1,
    name: query,
    limit: 10
  }

  const { loaderRef } = useInfiniteScroll(async () => {
    if (page === 1 || page < meta.totalPages) {
      const nextPage = page + 1;
      const data = await searchPlaylists({ ...filters, page: nextPage });
      data?.meta && setMeta(data.meta);
      setPage(nextPage);
    }
  });

  async function searchPlaylists(
    filters?: PlaylistFilters,
    include?: PlaylistInclude
  ) {
    const { data } = await playlistService.searchPublicPlaylists(filters, include);
    if (!data) return data;

    (filters?.page && filters.page > 1)
      ? setPlaylists([...playlists, ...data.items])
      : setPlaylists(data.items);

    return data;
  }

  async function onPlay({ playlist, isPlayingNow, queueMerge }: {
    playlist: Playlist;
    isPlayingNow: boolean;
    queueMerge?: boolean;
  }) {
    if (isPlayingNow) return togglePlay();
    setCurrentPlaylistId(playlist.id);

    const { data } = await playlistService.getPlaylistSongs(playlist.id);
    if (!data || !data.songs.length) return;

    setTracks(data.items);
    onPlaylistChange(playlist);

    if (queueMerge) {
      setQueue([...queue, ...data.songs]);
      setQueueMeta(data.meta);
      return;
    }

    play(data.songs, 0, data.meta);
  }

  useEffect(() => {
    setPage(1);
    query && searchPlaylists(filters).then((data) => data?.meta && setMeta(data.meta));
  }, [query]);

  return (
    <>
      {playlists.map((p) => {
        const isPlayingNow = p.id === currentPlaylist?.id;
        const cover = playlistService.playlistCover(p.id, p.cover);

        return (isPlaylistFilter ? (
          <PlaylistCard
            playable={p.id !== currentPlaylistId ? true : tracks.length > 0}
            playlist={p}
            key={p.id}
            onPlay={() => onPlay({
              isPlayingNow,
              playlist: p
            })}
          />
        ) : (
          <SearchItem
            type="playlist"
            payload={() => ({
              id: p.id,
              title: p.name,
              link: `${routes.playlists}/${p.id}`,
              sub: 'Lista',
              images: p.coverImages,
              isCover: !!cover
            })}
            isHover={hoverId === p.id}
            isPlayingNow={isPlayingNow}
            loadImage={() => (cover || p?.coverImages?.[0]?.url || '')}
            onPlay={() => onPlay({
              isPlayingNow,
              playlist: p
            })}
            addToQueue={() => !isPlayingNow && onPlay({
              isPlayingNow,
              playlist: p,
              queueMerge: true
            })}
            setHoverId={setHoverId}
            key={p.id}
          />
        ))
      })}

      {meta.hasNextPage && (
        <div
          className="flex-1 flex items-center justify-center"
          ref={loaderRef}
        >
          <Loader
            className="border-[#adaaaa5d] border-t-white"
            size={20}
            stroke={1}
          />
        </div>
      )}
    </>
  )
}

export default PlaylistResults;