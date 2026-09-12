import { SearchIcon, XIcon } from "lucide-react";

interface SearchInputProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchInput = ({ query, setQuery }: SearchInputProps) => {
  return (
    <div className="mb-8 font-bold text-white">
      <span className="mb-2 text-xl block">
        Buscar
      </span>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`w-full bg-[#2a2a2a] rounded h-10 hover:bg-[#2a2a2a] px-4 py-1.5 text-sm flex items-center`}
      >
        <SearchIcon className="shrink-0 w-5 h-5" />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="font-medium placeholder-[#adaaaa] text-white text-[13px] w-full ml-2"
          placeholder="¿Qué quieres escuchar?"
          type="text"
        />

        {query && (
          <XIcon
            className="shrink-0 w-5 h-5"
            onClick={() => setQuery('')}
          />
        )}
      </div>
    </div>
  )
}

export default SearchInput;