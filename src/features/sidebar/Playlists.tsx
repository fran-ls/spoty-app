import { LibraryIcon, MusicIcon } from "lucide-react";

interface PlaylistsProps {
  isCollapsed: boolean;
  currentView: string;
  redirectTo: () => void;
}

const Playlists = ({ isCollapsed, currentView, redirectTo }: PlaylistsProps) => {
  return (
    <nav
      className={`${isCollapsed ? 'h-[calc(100vh-64px-88px-96px)]' : 'h-[calc(100vh-64px-88px-114px)]'} overflow-y-auto overflow-x-hidden relative`}
    >
      <ul className={`${isCollapsed ? 'pl-0 pb-4' : 'pl-2 pb-2'} w-full absolute top-0 left-0`}>
        <li className={`cursor-pointer p-2 text-[#adaaaa] hover:bg-[#1f1f1f] rounded-md gap-3 flex items-center`}>
          <button
            onClick={redirectTo}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-start py-3 px-4 gap-4'
              } rounded-lg font-headline text-sm font-bold tracking-tight transition-all duration-200 cursor-pointer ${currentView === 'songs'
                ? 'text-white active:scale-95'
                : 'text-[#adaaaa] hover:text-white hover:bg-white/5 active:scale-95'
              }`}
            title={isCollapsed ? "Canciones" : undefined}
          >
            <LibraryIcon size={22} className={currentView === 'songs' ? 'text-primary' : ''} />
            {!isCollapsed && <span>Canciones</span>}
          </button>
        </li>

        {Array.from({ length: 7 }, (_, i) => (
          <li key={i} className={`${isCollapsed ? 'justify-center' : 'justify-start'} p-2 cursor-pointer text-[#adaaaa] hover:bg-[#1f1f1f] rounded-md gap-3 flex items-center`}>
            <div className="min-w-12 w-12 h-12 bg-[#262626] rounded relative">
              <MusicIcon className="absolute top-1/2 left-1/2 -translate-1/2" />
            </div>
            {!isCollapsed &&
              <div>
                <h4 className="mt-1 text-white text-[15px] font-semibold">
                  Lady Gaga
                </h4>
                <div className="text-[13px] font-semibold">
                  <span>Lista</span> • <span>Fran Lemus</span>
                </div>
              </div>
            }
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Playlists;