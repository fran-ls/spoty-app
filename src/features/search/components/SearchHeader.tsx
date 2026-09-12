import React, { useRef, useState } from "react";
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
  const [scrollLeft, setScrollLeft] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const content = contentRef.current;

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

  const style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 32,
    height: '100%',
    transition: 'opacity .15s ease-out',
    zIndex: 2
  }

  return (
    <div className="mb-4 text-white overflow-hidden relative">
      <div
        className="flex items-center gap-2 overflow-x-auto hide-scrollbar"
        onScroll={({ currentTarget }) => setScrollLeft(currentTarget.scrollLeft)}
        ref={contentRef}
      >
        {btns.map((btn) => (
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
        ))}
      </div>

      <div style={{
        ...style,
        display: scrollLeft > 0 ? 'block' : 'none',
        opacity: scrollLeft > 0 ? '1' : '0',
        left: 0,
        insetInlineStart: 0,
        background: 'linear-gradient(90deg, #131313 0%, transparent 100%)'
      }} />

      <div style={{
        ...style,
        display: content && scrollLeft >= content.scrollWidth - content.clientWidth - 1 ? 'none' : 'block',
        opacity: content && scrollLeft >= content.scrollWidth - content.clientWidth - 1 ? '0' : '1',
        right: 0,
        insetInlineEnd: 0,
        background: 'linear-gradient(-90deg, #131313 0%, transparent 100%)'
      }} />
    </div>
  )
}

export default SearchHeader;