import React, { useEffect, useRef, useState } from 'react';
import { MusicIcon, PenIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import type { PlayListDTO } from '../playlist.types';
import type { Song, SongCover } from '../../song/song.types';
import type { SearchMeta } from '../../../shared/types/common.types';
import EditData from '../components/EditData';
import GradientEditor from '../components/GradientEditor';
import Header from '../components/Header';
import { getTimeParts } from '../../../shared/utils/formatTime';
import SongList from '../../song/components/SongList';
import apiService from '../../../shared/services/api.service';
import SongListEmpty from '../../song/components/SongListEmpty';
import { usePlayer } from '../../../shared/context/PlayerContext';

const PlaylistPage: React.FC = () => {
  const { setQueueTotal } = usePlayer();

  const [gradientCSS, setGradientCSS] = useState<string>('');
  const [isPublic, setIsPublic] = useState(false);
  const [form, setForm] = useState<PlayListDTO>({
    name: 'Canciones',
    description: '',
    cover: '',
    isPublic: false,
    gradientColor: '',
    bgColor: '',
    userId: '',
    file: null
  });

  const [isBackground, setIsBackground] = useState(false);
  const [isSearch, _setIsSearch] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [query, setQuery] = useState('');

  const [page, setPage] = useState(0);
  const [songs, setSongs] = useState<Song[]>([]);
  const [searchMeta, setSearchMeta] = useState<SearchMeta>({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
    totalDuration: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [coverImages, setCoverImages] = useState<SongCover[]>([]);
  const duration = getTimeParts(searchMeta?.totalDuration ?? 0);

  const coverInputRef = useRef<HTMLInputElement>(null);

  async function getSongs(page: number) {
    const { data } = await apiService.searchSongs({ limit: 10, page });
    setSearchMeta(data.meta);

    if (page > 1) {
      setSongs((prev) => [...prev, ...data.items])
      return;
    }

    setQueueTotal(data.meta.total);
    setSongs(data.items);
  }

  const getPlaylistCover = () => {
    const images: SongCover[] = [];

    for (const song of songs) {
      if (song.cover) {
        images.push({ id: song.id, url: song.cover });
      }

      if (images.length === 4) {
        break;
      }
    }

    setCoverImages(images);
  }

  useEffect(() => { getSongs(1) }, []);
  useEffect(() => { getPlaylistCover() }, [songs]);

  return (
    // ${STYLES.minHeightMain} relative
    <div className="min-w-full text-white select-none scroll-smooth animate-fade-in">
      <div
        style={{ background: gradientCSS }}
        className="p-6 pb-44 flex items-center gap-6"
      >
        <div
          onPointerEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="min-[925px]:max-w-58 min-[925px]:max-h-58 min-[925px]:min-w-58 min-[925px]:min-h-58 w-[25vw] h-[25vw] min-w-[25vw] min-h-[25vw] rounded bg-[#262626] relative overflow-hidden"
        >
          {form.cover ? (
            <img
              className="object-cover w-full h-full"
              src={form.cover || 'lady-gaga.jpg'}
              alt=""
            />
          ) : (
            <MusicIcon className="w-1/4 h-1/4 absolute top-1/2 left-1/2 -translate-1/2" />
          )}

          {coverImages?.map((d, i) => {
            const className = i === 0
              ? 'top-0 left-0' : i === 1
                ? 'top-0 right-0' : i === 3
                  ? 'bottom-0 left-0' : 'bottom-0 right-0';

            return (
              <img
                className={`${className} absolute w-1/2 h-1/2 object-cover`}
                src={d.url}
                alt=""
                key={d.id}
              />
            )
          })}

          {isHover &&
            <button
              className={`${coverImages.length > 0 ? 'bg-black/50' : 'bg-[#262626]'} hover:text-white w-full h-full flex flex-col items-center gap-1 justify-center absolute top-1/2 left-1/2 -translate-1/2`}
              type="button"
            >
              <PenIcon className="w-10 h-10" />
              <span>Elegir foto</span>
            </button>
          }
        </div>

        <div className="mt-auto w-full">
          <span className="block text-sm font-medium">
            Lista {isPublic ? 'pública' : 'privada'}
          </span>
          <h1
            onClick={() => setIsEdit(true)}
            className="playlist-title font-black cursor-pointer google-sans-flex-font"
          >
            {form.name}
          </h1>

          <div className="mt-2 flex items-center">
            <button
              className="bg-[#ffffff36] p-1 rounded-full"
              type="button"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
            <a href="#">
              <span className="text-sm ml-2 font-bold">
                Fran Lemus
              </span>
              <span className="text-sm ml-2 font-bold">
                •
              </span>
              <span className="text-sm ml-2">
                {searchMeta.total || 0} canciones, {duration.min} min {duration.stringSecs}s
              </span>
            </a>
          </div>
        </div>
      </div>

      <div
        className="min-w-full absolute top-[calc(100%-150px)] bg-[#0a080820]"
        style={{
          // background: `linear-gradient(to bottom, ${gradientColor} 0%, #0e0e0e 100%)`,
        }}
      >
        <div className="p-6 space-y-6">
          <Header
            isPublic={isPublic}
            isBackground={isBackground}
            setIsEdit={setIsEdit}
            setIsPublic={setIsPublic}
            setIsBackground={setIsBackground}
          />

          {isSearch &&
            <>
              <div className="h-px bg-white/10" />

              <div className="my-4">
                <label className="my-3 text-[22px] font-bold block" htmlFor="query">
                  Encontremos algo para tu lista
                </label>
                <div className="text-[#adaaaa] px-3 py-2.5 text-sm w-full max-w-82 bg-[#1f1f1f] gap-2 flex items-center rounded">
                  <SearchIcon className="min-w-5 w-5 h-5" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full min-h-full"
                    placeholder="Buscar canciones"
                    name="query"
                    type="text"
                  />
                  {query &&
                    <button
                      onClick={() => setQuery('')}
                      type="button"
                    >
                      <XIcon className="min-w-5 w-5 h-5" />
                    </button>
                  }
                </div>
              </div>
            </>
          }
        </div>

        <div className="text-white select-none scroll-smooth animate-fade-in">
          {songs.length === 0 ? (
            <SongListEmpty />
          ) : (
            <SongList
              songs={songs}
              searchMeta={searchMeta}
              loadMore={() => {
                if (page < searchMeta.totalPages) {
                  const nextPage = page + 1;
                  getSongs(nextPage);
                  setPage(nextPage);
                }
              }}
            />
          )}
        </div>
      </div>

      {isEdit &&
        <EditData
          form={form}
          isPublic={isPublic}
          setForm={setForm}
          onChangeVisibility={() => setIsPublic(!isPublic)}
          coverInputRef={coverInputRef}
          onClose={() => setIsEdit(false)}
          onSavePlaylist={() => { }}
        />
      }

      <GradientEditor
        isBackground={isBackground}
        setGradientCSS={setGradientCSS}
        onClose={() => setIsBackground(false)}
      />
    </div>
  )
}

export default PlaylistPage;