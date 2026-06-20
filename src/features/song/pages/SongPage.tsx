import React, { useEffect, useRef, useState } from 'react';
import { MusicIcon, PenIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import type { PlaylistDTO } from '../../playlist/playlist.types';
import type { Song, SongCover } from '../song.types';
import type { SearchMeta } from '../../../shared/types/common.types';
import EditData from '../../playlist/components/EditData';
import GradientEditor from '../../playlist/components/GradientEditor';
import Footer from '../../playlist/components/Footer';
import { getTimeParts } from '../../../shared/utils/formatTime';
import SongList from '../components/SongList';
import songService from '../services/song.service';
import SongListEmpty from '../components/SongListEmpty';
import { usePlayer } from '../../../shared/context/PlayerContext';
import useAuth from '../../auth/hooks/useAuth';
import { GRADIENT_CSS } from '../../../shared/data/gradientColors.data';

const SongPage: React.FC = () => {
  const { user } = useAuth();
  const { setQueueMeta } = usePlayer();

  const [gradientCSS, setGradientCSS] = useState<string>('');
  const [bgColor, setBgColor] = useState('#3b3b3b');
  const [gradientColor, setGradientColor] = useState('#111111');
  const [isPublic, setIsPublic] = useState(false);

  const [form, setForm] = useState<PlaylistDTO>({
    name: 'Canciones',
    description: 'Todas las canciones',
    cover: '',
    isPublic,
    gradientColor,
    bgColor,
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
    const { data } = await songService.searchSongs({ limit: 10, page });
    if (!data) return;

    setSearchMeta(data.meta);

    if (page > 1) {
      setSongs((prev) => [...prev, ...data.items])
      return;
    }

    setQueueMeta({
      ...data.meta,
      playlistId: '',
      totalDuration: 0
    });
    setSongs(data.items);
  }

  const getPlaylistCover = () => {
    const images: SongCover[] = [];

    for (const song of songs) {
      if (song.cover) {
        const coverUrl = songService.songCoverUrl(song.id, song.cover);
        images.push({ id: song.id, url: coverUrl });
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
    <div className="min-w-full text-white select-none scroll-smooth">
      <div className="animate-fade-in">
        <div
          style={{
            background: gradientCSS || GRADIENT_CSS
          }}
          className="p-6 pb-44 flex items-center gap-6 overflow-x-auto hide-scrollbar"
        >
          <div
            onPointerEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className="min-[925px]:max-w-58 min-[925px]:max-h-58 min-[925px]:min-w-58 min-[925px]:min-h-58 w-[25vw] h-[25vw] min-w-[25vw] min-h-[25vw] rounded bg-[#262626] relative"
          >
            {form.cover ? (
              <img
                className="object-cover w-full h-full"
                src={form.cover}
                alt=""
              />
            ) : (
              <MusicIcon className="w-1/4 h-1/4 absolute top-1/2 left-1/2 -translate-1/2" />
            )}

            {coverImages.length > 3 && coverImages.map((d, i) => {
              const className = i === 0
                ? 'top-0 left-0' : i === 1
                  ? 'top-0 right-0' : i === 3
                    ? 'bottom-0 left-0' : 'bottom-0 right-0';

              return (
                <img
                  className={`${className} absolute w-1/2 h-1/2 object-cover`}
                  crossOrigin="anonymous"
                  src={d.url}
                  alt=""
                  key={d.id}
                />
              )
            })}

            {isHover &&
              <button
                className={`${(form.cover || coverImages.length > 3) ? 'bg-black/50' : 'bg-[#262626]'} hover:text-white w-full h-full flex flex-col items-center gap-1 justify-center absolute top-1/2 left-1/2 -translate-1/2`}
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
              {form.name || 'Mi lista'}
            </h1>

            {form.description &&
              <div className="text-sm text-slate-400">
                {form.description}
              </div>
            }

            <div className="mt-2 flex items-center">
              <button
                className="bg-[#ffffff36] p-1 rounded-full"
                type="button"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
              <a href="#">
                <span className="text-sm ml-2 font-bold">
                  {user?.username}
                </span>
                <span className="text-sm ml-2 font-bold">
                  •
                </span>
                <span className="text-sm ml-2 text-nowrap">
                  {searchMeta.total || 0} canciones, {duration.min} min {duration.stringSecs}s
                </span>
              </a>
            </div>
          </div>
        </div>

        <div
          className="min-w-full w-full absolute top-[calc(100%-150px)] bg-[#0a080820] overflow-hidden"
          style={{
            // background: `linear-gradient(to bottom, ${gradientColor} 0%, #0e0e0e 100%)`,
          }}
        >
          <div className="p-6 space-y-6">
            <Footer
              songs={songs}
              songMeta={searchMeta}
              isPlay={songs.length > 0}
              isPublic={isPublic}
              isBackground={isBackground}
              setIsEdit={setIsEdit}
              setIsBackground={setIsBackground}
              onChangeVisibility={() => { }}
              setIsRemove={() => { }}
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

        {isBackground &&
          <GradientEditor
            bgColor={bgColor}
            gradientColor={gradientColor}
            isBackground={isBackground}
            setBgColor={setBgColor}
            setGradientColor={setGradientColor}
            setGradientCSS={setGradientCSS}
            onClose={() => setIsBackground(false)}
            onSave={async () => {
              // const data = await onSavePlaylist({ ...form, bgColor, gradientColor });
              // if (data?.id) setIsBackground(false);
            }}
          />
        }
      </div>

      {isEdit &&
        <EditData
          form={form}
          isPublic={isPublic}
          coverImages={coverImages}
          currentCover={''}
          setForm={setForm}
          onChangeVisibility={() => setIsPublic(!isPublic)}
          coverInputRef={coverInputRef}
          onClose={() => setIsEdit(false)}
          onSave={() => { }}
        />
      }
    </div>
  )
}

export default SongPage;