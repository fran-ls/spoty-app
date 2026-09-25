import { useEffect, useMemo, useRef, useState } from "react";
import { EllipsisIcon, MusicIcon, PenIcon, PlusIcon } from "lucide-react";
import type { Playlist, PlaylistColors, PlaylistDTO } from "../playlist.types";
import SmartImage from "../../../shared/components/SmartImage";
import PlaylistCoverImgs from "./PlaylistCoverImgs";
import useLibrary from "../../library/hooks/useLibrary";
import usePlayer from "../../player/hooks/usePlayer";
import { getTimeParts } from "../../../shared/utils/formatTime";
import { playlistBg } from "../../../shared/data/stylePresets";

interface PlaylistCardProps {
  playlist: Playlist | null;
  isPlaylistOwner: boolean;
  form: PlaylistDTO;
  colors: PlaylistColors;
  coverInputRef: React.RefObject<HTMLInputElement | null>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setForm: React.Dispatch<React.SetStateAction<PlaylistDTO>>;
}

const PlaylistCard = (props: PlaylistCardProps) => {
  const { playlist, isPlaylistOwner, form, colors, coverInputRef, setIsEdit, setForm } = props;
  const { isQueue } = usePlayer();
  const { libraryStatus } = useLibrary();

  const [isCoverHover, setIsCoverHover] = useState(false);
  const [isError, setIsError] = useState(false);

  const [coverSize, setCoverSize] = useState<Record<string, string | number>>({});
  const [titleSize, setTitleSize] = useState('16px');

  const playlistWrapRef = useRef<HTMLDivElement>(null);

  const cover = form.fileUrl || form.cover;
  const username = playlist?.user?.username || 'Username';
  const isCoverImgs = playlist && playlist.coverImages && playlist.coverImages.length > 3;
  const bgBase = form.gradientColor !== playlistBg.gradientColor ? form.gradientColor : '#282828';

  const { trackCountText, trackCount } = useMemo(() => {
    const { hours, min, secs } = getTimeParts(playlist?.duration || 0);

    const durationText = (hours > 0
      ? `${hours} h ${min > 0 ? `${min} min` : ''}`
      : `${min > 0 ? `${min} min` : ''} ${secs > 0 ? `${secs} s` : ''}`.trim()
    );

    const trackCount = playlist?.trackCount || 0;
    const manyTracks = trackCount !== 1;

    return {
      trackCount,
      manyTracks,
      durationText,
      duration: playlist?.duration || 0,
      trackCountText: `${trackCount} ${manyTracks ? 'canciones' : 'canción'}${durationText ? `, ${durationText}` : ''}` // `${manyTracks ? 'canciones' : 'canción'}${trackCount ? ',' : ''}`
    }
  }, [playlist]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const fileUrl = form.fileUrl;
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    if (file) setForm({
      ...form, file,
      fileUrl: URL.createObjectURL(file)
    });
  }

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
        onPointerEnter={() => isPlaylistOwner && setIsCoverHover(true)}
        onMouseLeave={() => isPlaylistOwner && setIsCoverHover(false)}
        style={{
          ...(window.innerWidth >= 500 && coverSize),
          background: bgBase,
          maxWidth: '232px',
          maxHeight: '232px'
        }}
        className="min-[925px]:max-w-58 min-[925px]:max-h-58 min-w-40 min-h-40 w-[25vw] h-[25vw] min-[500px]:rounded bg-[#282828] overflow-hidden relative transition-all duration-100 shadow-[0_4px_60px_#00000080]"
      >
        <SmartImage
          wrapClassName="bg-transparent text-[#7f7f7f] w-full h-full"
          icon={<MusicIcon className="w-[30%] h-[30%]" />}
          url={cover || playlist?.coverImages?.[0]?.url || ''}
        />

        {(!cover && isCoverImgs) && (
          <PlaylistCoverImgs
            images={playlist.coverImages || []}
            onError={(ok) => setIsError(ok)}
          />
        )}

        {isCoverHover && (
          <>
            <button
              onClick={() => {
                if (!isPlaylistOwner) return;
                coverInputRef.current?.click();
                setIsEdit(true);
              }}
              className={`${((cover || isCoverImgs) && !isError) ? 'bg-black/50' : form.file ? 'bg-black/50' : 'bg-[#282828]'} hover:text-white w-full h-full flex flex-col items-center gap-1 justify-center absolute top-1/2 left-1/2 -translate-1/2`}
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
          onChange={onFileChange}
          ref={coverInputRef}
          className="hidden"
          accept="image/*"
          name="cover"
          type="file"
        />
      </div>

      <div className="overflow-hidden mt-auto w-full">
        <span className="min-[500px]:block hidden text-sm font-medium">
          Lista {form.isPublic ? 'pública' : 'privada'}
        </span>
        <h1
          onClick={() => isPlaylistOwner && setIsEdit(true)}
          className={`min-[500px]:mb-0 max-[500px]:mt-5 min-[500px]:truncate line-clamp-2 font-black ${window.innerWidth >= 500 ? 'playlist-title google-sans-flex-font' : 'text-2xl google-sans-flex-font'}`}
          title={form.name}
          style={{
            ...(window.innerWidth >= 500 && {
              fontSize: titleSize
            }),
            textShadow: '0px 0px 4px rgba(0,0,0,0.3)'
          }}
        >
          {form.name || 'Lista'}
        </h1>

        {form.description && (
          <div className="min-[500px]:block hidden text-sm text-slate-400">
            {form.description}
          </div>
        )}

        <div className="mt-2 flex items-center">
          <button
            className="bg-[#ffffff36] p-1 rounded-full"
            type="button"
          >
            <PlusIcon className="w-4 h-4" />
          </button>

          <a href="#" className="min-[500px]:inline-flex hidden hover:underline">
            <span className="text-sm ml-2 font-bold">
              {username}
            </span>
          </a>

          {(trackCount > 0) && (
            <>
              <span className="min-[500px]:inline-flex hidden text-sm ml-2 font-bold">
                •
              </span>
              <span className="min-[500px]:inline-flex hidden text-sm ml-2 text-nowrap">
                {trackCountText}
              </span>
            </>
          )}

          <div className="min-[500px]:hidden flex-wrap gap-2 flex w-full items-center justify-between">
            <div>
              <a href="#" className="hover:underline">
                <span className="text-sm ml-2 font-bold">
                  {username}
                </span>
              </a>
              <span className="text-sm mx-2 font-bold">
                •
              </span>
              <span className="text-sm font-medium">
                {form.isPublic ? 'Pública' : 'Privada'}
              </span>
            </div>
          </div>
        </div>

        {(trackCount > 0) && (
          <span className="min-[500px]:hidden block mt-5 text-sm text-nowrap mr-auto">
            {trackCountText}
          </span>
        )}
      </div>
    </div>
  )
}

export default PlaylistCard;