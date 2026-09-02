import { useState } from 'react';
import { MusicIcon, SearchIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { TrackFilters } from '../../song/song.types';
import type { Playlist, PlaylistSongDTO, PlaylistSongInclude } from '../playlist.types';
import SmartImage from '../../../shared/components/SmartImage';
import SearchSongList from './SearchSongList';
import useTrack from '../../song/hooks/useTrack';

interface SearchSongsForPlaylistProps {
  playlist: Pick<Playlist, 'id' | 'name' | 'cover'>;
  addSongToPlaylist: (dto: PlaylistSongDTO, include?: PlaylistSongInclude) => Promise<any>;
  setIsSongSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchSongsForPlaylist = (props: SearchSongsForPlaylistProps) => {
  const { playlist, addSongToPlaylist, setIsSongSearch } = props;
  const { tracks, trackMeta, searchTracks, setTracks } = useTrack();

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TrackFilters>({
    title: '',
    orderBy: 'createdAt',
    order: 'desc'
  });

  return (
    <section className="min-h-[75vh] sm:p-6 px-3 pb-6 pt-0 space-y-6 relative">
      <div className="h-px bg-white/10" />

      <div className="mb-8 relative animate-fade-in">
        <label className="my-3 min-[460px]:text-[22px] text-[18px] font-bold block" htmlFor="query">
          {window.innerWidth >= 360 ? 'Encontremos algo para tu lista' : 'Busca algo'}
        </label>
        <div className="text-[#adaaaa] px-3 py-2.5 text-sm w-full min-[460px]:max-w-82 bg-[#262626] gap-2 flex items-center rounded">
          <SearchIcon className="min-w-5 w-5 h-5" />
          <input
            value={filters.title || ''}
            onChange={(e) => {
              const value = e.target.value;
              setFilters({ ...filters, title: value });

              value
                ?
                setTimeout(() => searchTracks({
                  ...filters, title: value, page: 1,
                }), 300)
                :
                setTracks([]);
            }}
            className="w-full min-h-full"
            placeholder="Buscar canciones"
            name="query"
            type="text"
          />
          {filters.title && (
            <button
              onClick={() => {
                setFilters({ ...filters, title: '', page: 1 });
                setTracks([]);
              }}
              type="button"
            >
              <XIcon className="min-w-5 w-5 h-5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setIsSongSearch(false)}
          className="text-[#adaaaa] bg-[#131313] absolute min-[460px]:top-1/2 top-0 right-0 min-[460px]:-translate-1/2"
          type="button"
        >
          <XIcon className="w-7 h-7 min-[460px]:w-8 min-[460px]:h-8" strokeWidth={1.5} />
        </button>
      </div>

      <SearchSongList
        songs={tracks}
        paginationMeta={trackMeta}
        loadMore={async () => {
          if (page > trackMeta.page) return;

          const nextPage = page + 1;
          await searchTracks({ ...filters, page: nextPage });
          setPage(nextPage);
        }}
        addSongToPlaylist={async (id) => {
          const { status } = await addSongToPlaylist({ playlistId: playlist.id, songId: id });

          if (status === 201) toast(
            <div className="flex items-center gap-2 p-2 pr-3 min-w-10 rounded bg-black">
              <div className="bg-[#262626] min-w-8 w-8 h-8 rounded overflow-hidden relative">
                <SmartImage
                  url={playlist.cover}
                  wrapClassName="w-full h-full"
                  icon={<MusicIcon size={16} />}
                />
              </div>
              <span>
                Añadido a {playlist.name}
              </span>
            </div>
          );
        }}
      />
    </section>
  )
}

export default SearchSongsForPlaylist;