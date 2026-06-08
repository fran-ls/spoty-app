import React, { useState } from 'react';
import { MusicIcon, PenIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import type { PlayListDTO } from '../playlist.types';
import EditData from '../components/EditData';
import GradientEditor from '../components/GradientEditor';
import Header from '../components/Header';

interface NewPlaylistPageGradientProps {
  children?: React.ReactNode;
  isSearch?: boolean;
  gradientCSS: string;
  setGradientCSS: React.Dispatch<React.SetStateAction<string>>;
}

const NewPlaylistPageGradient: React.FC<NewPlaylistPageGradientProps> = (props) => {
  const { children, isSearch = true } = props;
  const [gradientCSS, setGradientCSS] = useState<string>('');

  const [form, setForm] = useState<PlayListDTO>({
    name: 'Lady Gaga',
    description: '',
    coverUrl: ''
  });

  const [isBackground, setIsBackground] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [query, setQuery] = useState('');

  const onFormChange = (field: keyof PlayListDTO, value: any) => {
    setForm({ ...form, [field]: value });
  }

  return (
    <div className="min-w-full text-white select-none animate-fade-in">
      <div
        style={{ background: gradientCSS }}
        className="p-6 pb-44 flex items-center gap-6"
      >
        <div
          onPointerEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="min-[925px]:max-w-58 min-[925px]:max-h-58 min-[925px]:min-w-58 min-[925px]:min-h-58 w-[25vw] h-[25vw] min-w-[25vw] min-h-[25vw] rounded bg-[#262626] relative overflow-hidden"
        >
          {/* {!isHover
            ?
            <MusicIcon className="w-1/4 h-1/4 absolute top-1/2 left-1/2 -translate-1/2" />
            :
            <button
              className="hover:text-white w-full h-full flex flex-col items-center gap-1 justify-center absolute top-1/2 left-1/2 -translate-1/2"
              type="button"
            >
              <PenIcon className="w-10 h-10" />
              <span>Elegir foto</span>
            </button>
          } */}
          <img
            className="object-cover w-full h-full"
            src="lady-gaga-1.jpg"
            alt=""
          />
        </div>

        <div className="mt-auto w-full">
          <span className="text-sm font-medium">
            Lista {isPrivate ? 'privada' : 'pública'}
          </span>
          <h1
            onClick={() => setIsEdit(true)}
            className="playlist-title font-black cursor-pointer"
          >
            Lady Gaga
          </h1>

          <div className="flex items-center">
            <button
              className="bg-[#ffffff36] p-1.5 rounded-full"
              type="button"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
            <a href="#">
              <span className="text-sm ml-2 font-bold">
                Fran Lemus
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="min-w-full absolute top-[calc(100%-150px)] bg-[#0a080820]">
        <div className="p-6 space-y-6">
          <Header
            isPrivate={isPrivate}
            isBackground={isBackground}
            setIsEdit={setIsEdit}
            setIsPrivate={setIsPrivate}
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

        {children && children}
      </div>

      {isEdit &&
        <EditData
          form={form}
          isPrivate={isPrivate}
          onFormChange={onFormChange}
          onChangeVisibility={() => setIsPrivate(!isPrivate)}
          onClose={() => setIsEdit(false)}
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

export default NewPlaylistPageGradient;