import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { EllipsisIcon, MusicIcon, PenIcon, UserIcon } from "lucide-react";
import type { PlaylistColors } from "../../playlist/playlist.types";
import type { Song } from "../song.types";
import SmartImage from "../../../shared/components/SmartImage";
import useLibrary from "../../library/hooks/useLibrary";
import usePlayer from "../../player/hooks/usePlayer";
import { playlistBg } from "../../../shared/data/stylePresets";
import { formatTime } from "../../../shared/utils/formatTime";
import { routes } from "../../../shared/utils/routes";
import artistService from "../../artist/services/artist.service";

interface SongCardProps {
  song: Song | null;
  colors: PlaylistColors;
  coverInputRef: React.RefObject<HTMLInputElement | null>;
}

const SongCard = (props: SongCardProps) => {
  const { song, colors, coverInputRef } = props;
  const { isQueue } = usePlayer();
  const { libraryStatus } = useLibrary();

  const [form, setForm] = useState<any>({});

  const [isCoverHover, setIsCoverHover] = useState(false);
  const [isError, setIsError] = useState(false);

  const [coverSize, setCoverSize] = useState<Record<string, string | number>>({});
  const [titleSize, setTitleSize] = useState('16px');

  const playlistWrapRef = useRef<HTMLDivElement>(null);

  const cover = song?.cover || null;
  const artistCover = artistService.artistImage(song?.artistId || '', song?.artist?.image);
  const artistName = song?.artist?.name || 'Artista';
  const bgBase = colors.base !== playlistBg.gradientColor ? colors.base : '#282828';

  const handleResize = () => {
    const wrap = playlistWrapRef.current;
    if (!wrap) return;

    const imgSize = `${wrap.offsetWidth * 0.25}px`;
    const imgMaxSize = '232px';

    const fontSize = window.innerWidth >= 1280 ? 96 : wrap.offsetWidth * (
      window.innerWidth >= 640 ? 0.10 : 0.08
    );

    setCoverSize({
      width: imgSize,
      height: imgSize,
      minWidth: imgSize,
      minHeight: imgSize,
      maxWidth: imgMaxSize,
      maxHeight: imgMaxSize,
      ...(window.innerWidth >= 1280 && {
        minWidth: imgMaxSize,
        minHeight: imgMaxSize
      })
    });

    setTitleSize(`${fontSize}px`);
  }

  useEffect(() => { handleResize() }, [libraryStatus.collapsed, isQueue]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{
        background: `linear-gradient(in oklch to bottom, ${colors.bg} 0%, ${colors.base} 100%)`
      }}
      className="min-[500px]:flex-row min-[500px]:pb-6 pb-3 p-6 flex-col flex items-center gap-x-6 overflow-auto hide-scrollbar max-[500px]:relative"
      ref={playlistWrapRef}
    >
      <div
        onPointerEnter={() => setIsCoverHover(false)}
        onMouseLeave={() => setIsCoverHover(false)}
        style={{
          ...(window.innerWidth >= 500 && coverSize),
          background: bgBase,
          maxWidth: '232px',
          maxHeight: '232px'
        }}
        className="min-[925px]:max-w-58 min-[925px]:max-h-58 min-w-40 min-h-40 w-[25vw] h-[25vw] min-[500px]:rounded bg-[#282828] overflow-hidden relative transition-all duration-100 shadow-[0_4px_60px_#00000080]"
      >
        <SmartImage
          onError={() => setIsError(true)}
          wrapClassName="bg-transparent text-[#7f7f7f] w-full h-full"
          icon={<MusicIcon className="w-[30%] h-[30%]" />}
          url={cover}
        />

        {isCoverHover && (
          <>
            <button
              className={`${(cover && !isError) ? 'bg-black/50' : form.file ? 'bg-black/50' : 'bg-[#282828]'} hover:text-white w-full h-full flex flex-col items-center gap-1 justify-center absolute top-1/2 left-1/2 -translate-1/2`}
              onClick={() => { }}
              style={{
                background: bgBase
              }}
              type="button"
            >
              <PenIcon className="w-1/4 h-1/4 sm:max-w-11 sm:max-h-11" />
              <span className="">
                Elegir foto
              </span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (form.fileUrl) URL.revokeObjectURL(form.fileUrl);
                setForm({
                  ...form,
                  file: null,
                  fileUrl: ''
                });
              }}
              className="hover:text-white bg-black max-w-7 max-h-7 w-[18%] h-[18%] rounded-full flex flex-col items-center gap-1 justify-center absolute top-3 right-3"
              type="button"
            >
              <EllipsisIcon className="w-[75%] h-[75%]" />
            </button>
          </>
        )}

        <input
          onChange={() => { }}
          ref={coverInputRef}
          className="hidden"
          accept="image/*"
          name="cover"
          type="file"
        />
      </div>

      <div className="overflow-hidden mt-auto w-full">
        <span className="min-[500px]:block hidden text-sm font-semibold">
          Canción
        </span>
        <h1
          style={{
            fontSize: titleSize,
            textShadow: '0px 0px 4px rgba(0,0,0,0.3)'
          }}
          className={`min-[500px]:mb-0 max-[500px]:mt-2 font-black truncate ${window.innerWidth >= 500 ? 'playlist-title google-sans-flex-font' : 'playlist-title-font'}`}
          title={song?.title}
        >
          {song?.title || 'Canción'}
        </h1>

        <div className="mt-2 flex items-center">
          <SmartImage
            onError={() => setIsError(true)}
            wrapClassName="w-6 h-6 shrink-0 text-[#7f7f7f] rounded-full"
            icon={<UserIcon className="w-[40%] h-[40%]" />}
            url={artistCover}
          />

          <Link
            className="hover:underline"
            to={`${routes.artists}/${song?.artistId || ''}`}
          >
            <span className="text-sm ml-2 font-bold">
              {artistName}
            </span>
          </Link>

          {/* {(song?.title) && (
            <>
              <span className="min-[500px]:inline-flex hidden text-sm ml-2 font-bold">
                •
              </span>
              <span className="min-[500px]:inline-flex hidden text-sm ml-2 text-nowrap">
                {song?.title}
              </span>
            </>
          )} */}

          {song?.createdAt && (
            <>
              <span className="text-[#adaaaa] text-sm ml-2">
                •
              </span>
              <span className="text-[#adaaaa] ml-2 text-sm font-medium">
                {new Date(song.createdAt).getFullYear()}
              </span>
            </>
          )}

          {song?.duration && (
            <>
              <span className="text-[#adaaaa] text-sm ml-2">
                •
              </span>
              <span className="text-[#adaaaa] ml-2 text-sm font-medium">
                {formatTime(song.duration)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SongCard;