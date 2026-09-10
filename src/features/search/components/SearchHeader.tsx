import { routes } from "../../../shared/utils/routes";

export type SearchFilter = 'playlists' | 'artists' | 'tracks' | 'all';

type Btn = {
  label: string;
  filter: SearchFilter;
  link: string;
}

interface SearchHeaderProps {
  query: string;
  filter: SearchFilter;
  setFilter: React.Dispatch<React.SetStateAction<SearchFilter>>;
}

const SearchHeader = ({ filter, setFilter }: SearchHeaderProps) => {
  const btns: Btn[] = [
    {
      label: 'Todo',
      filter: 'all',
      link: ''
    },
    {
      label: 'Artistas',
      filter: 'artists',
      link: routes.artists
    },
    {
      label: 'Canciones',
      filter: 'tracks',
      link: routes.tracks
    },
    {
      label: 'Listas',
      filter: 'playlists',
      link: routes.playlists
    }
  ];

  return (
    <div className="mb-4 text-white flex items-center gap-2">
      {btns.map((btn) => {
        // const q = query.trim().replaceAll(' ', '-');
        // const redirectTo = !query ? btn.link : `${btn.link}?q=${q}`;

        return (
          <button
            className="hover:bg-[#282828] font-semibold text-[13px] px-3.5 py-1.5 rounded-full cursor-pointer"
            onClick={() => setFilter(btn.filter)}
            key={btn.filter}
            type="button"
            style={{
              background: btn.filter === filter ? '#fff' : '#ffffff1a',
              color: btn.filter === filter ? '#262626' : '#fff'
            }}
          >
            <span className="mt-px block">
              {btn.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default SearchHeader;