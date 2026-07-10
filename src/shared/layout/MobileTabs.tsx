import { useState } from "react";
import { Link } from "react-router-dom";
import { BookshelfFilledIcon, BookshelfIcon, House2Icon, House3Icon, SearchFilledIcon, SearchIcon } from "../components/Icons";
import { routes } from "../utils/routes";

const MobileTabs = () => {
  const [tab, setTab] = useState('home');

  return (
    <footer className="text-white bg-black/70 px-2 py-1 grid grid-cols-3 w-full z-50 place-items-center fixed bottom-0 left-0">
      <Link
        to={routes.home}
        className="w-full p-1 flex flex-col items-center justify-center"
        onClick={() => setTab('home')}
      >
        {tab === 'home'
          ? <House3Icon size={25} />
          : <House2Icon fill="#ffffff" size={25} />
        }

        <span className="mx-auto text-[10px]">Inicio</span>
      </Link>

      <Link
        to={routes.search}
        className="w-full p-1 flex flex-col items-center justify-center"
        onClick={() => setTab('search')}
      >
        {tab === 'search'
          ? <SearchFilledIcon className="mb-px mr-px" fill="#ffffff" size={24} />
          : <SearchIcon stroke="#ffffff" size={25} />
        }

        <span className={`mx-auto text-[10px] block ${tab === 'search' ? 'mt--[5px]' : 'mb--[3px]'}`}>Buscar</span>
      </Link>

      <Link
        to={routes.library}
        className="w-full p-1 flex flex-col items-center justify-center"
        onClick={() => setTab('library')}
      >
        {tab === 'library'
          ? <BookshelfFilledIcon fill="#ffffff" size={25} />
          : <BookshelfIcon fill="#ffffff" size={25} />
        }

        <span className="mx-auto text-[10px]">Tu biblioteca</span>
      </Link>
    </footer>
  )
}

export default MobileTabs;