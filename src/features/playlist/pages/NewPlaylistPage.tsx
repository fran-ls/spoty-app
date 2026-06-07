import React, { useState } from 'react';
import { EllipsisIcon, ListIcon, MusicIcon, PenIcon, PlusIcon, SearchIcon, XIcon } from 'lucide-react';
import type { PlayListDTO } from '../playlist.type';
import LayoutMenu from '../components/LayoutMenu';
import ActionMenu from '../components/ActionMenu';
import EditData from '../components/EditData';
import StyleConfig from '../components/StyleConfig';

const NewPlaylistPage: React.FC = () => {
  const [form, setForm] = useState<PlayListDTO>({
    name: '',
    description: '',
    coverUrl: ''
  });

  const [bgColor, setBgColor] = useState('#3a3a3a');
  const [gradientColor, setGradientColor] = useState('#121212');

  const [isBackground, setIsBackground] = useState(false);
  const [isOpenAction, setIsOpenAction] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [query, setQuery] = useState('');

  const onFormChange = (field: keyof PlayListDTO, value: any) => {
    setForm({ ...form, [field]: value });
  }

  /*const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = form.name.trim() || 'My Curated Playlist';
    const finalDesc = form.description.trim() || 'Custom playlist styled by me.';
    // save
  }*/

  return (
    <div className="min-h-full text-white select-none animate-fade-in bg-surface">
      <div
        style={{
          background: `linear-gradient(to bottom, ${bgColor} 0%, ${gradientColor || '#121212'} 100%)`,
        }}
        className="p-6 flex items-center gap-6"
      >
        <div
          onPointerEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          className="md:min-w-58 md:w-58 md:h-58 w-[25vw] h-[25vw] min-w-37.5 min-h-37.5 rounded bg-[#262626] relative"
        >
          {!isHover
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
          }
        </div>

        <div className="mt-auto w-full">
          <span className="block mb-3 text-sm font-semibol">
            Lista {isPrivate ? 'privada' : 'pública'}
          </span>
          <h1
            onClick={() => setIsEdit(true)}
            className="text-6xl md:text-7xl lg:text-8xl font-black cursor-pointer"
          >
            Mi lista  #6
          </h1>

          <div className="mt-5 flex items-center">
            <button
              className="bg-[#ffffff36] p-1.5 rounded-full"
              type="button"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
            <span className="text-sm ml-2 font-medium">
              <a href="#">Fran Lemus</a>
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 relative">
        <div
          // style={{
          //   background: `linear-gradient(to bottom, ${gradientColor} 0%, #0e0e0e 100%)`,
          // }}
          className="text-sm text-[#adaaaa] flex items-center justify-between relative"
        >
          <div className="relative">
            <button
              onClick={() => setIsOpenAction(!isOpenAction)}
              className="h-8 px-2 hover:text-white cursor-pointer"
              type="button"
            >
              <EllipsisIcon className="w-8 h-8" />
            </button>
            {isOpenAction &&
              <ActionMenu
                isPrivate={isPrivate}
                onIsEdit={() => {
                  setIsEdit(true);
                  setIsOpenAction(false);
                  setIsBackground(false);
                }}
                onChangeVisibility={() => setIsPrivate(!isPrivate)}
                onClose={() => setIsOpenAction(!isOpenAction)}
                onIsBackground={() => setIsBackground(!isBackground)}
              />
            }
          </div>

          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="font-semibold hover:text-white cursor-pointer h-8 px-2 flex items-center gap-2"
              type="button"
            >
              <span>Lista</span>
              <ListIcon className="inline-flex w-5 h-5" />
            </button>
            {isOpen &&
              <LayoutMenu onClose={() => setIsOpen(!isOpen)} />
            }
          </div>
        </div>

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

        {isBackground &&
          <StyleConfig
            bgColor={bgColor}
            gradientColor={gradientColor}
            setBgColor={setBgColor}
            setGradientColor={setGradientColor}
            onClose={() => setIsBackground(false)}
          />}
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
    </div>
  )
}

export default NewPlaylistPage;