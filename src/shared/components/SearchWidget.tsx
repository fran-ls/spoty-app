import { useEffect, useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import type { SearchMeta } from "../types/common.types";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { getValue } from "../utils/getValue";
import Loader from "./Loader";

export interface WidgetSearch {
  query: string;
  page: number;
}

type SearchWidgetItem = {
  label: string;
  value: string;
  sub?: string;
  item?: any;
}

type Payload = SearchWidgetItem & { search: WidgetSearch }

interface SearchWidgetProps {
  label?: string
  keys: Omit<SearchWidgetItem, 'item'>;
  open: boolean;
  items: any[];
  meta: SearchMeta;
  isLoadMore?: boolean;
  bgColor?: string;
  loadMore?: (query: string, page: number) => Promise<void>;
  loadIcon?: (payload: any) => React.ReactElement;
  payload?: (data: Payload) => void;
  onClose: () => void;
}

const SearchWidget = (props: SearchWidgetProps) => {
  const {
    label = '', keys, open, items, meta, isLoadMore = false,
    bgColor = '#181818', loadMore, payload, loadIcon, onClose
  } = props;

  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');

  const { loaderRef } = useInfiniteScroll(async () => {
    if (!isLoadMore || !loadMore) return;
    await loadMore(query, page + 1);
    setPage(page + 1);
  });

  useEffect(() => { loadMore && setTimeout(() => loadMore(query, 0), 300) }, [query]);

  // useEffect(() => {
  //   payload?.({
  //     label: '',
  //     value: '',
  //     search: { query, page }
  //   })
  // }, [query]);

  return (
    <div
      style={{
        boxShadow: '0px 0px 5px 2px #0e0e0e',
        backgroundColor: bgColor
      }}
      className={`pb-10 ${open ? 'translate-y-0' : 'translate-y-[100vh]'} max-h-[calc(100vh-73px-56px)] h-100 p-5 text-gray-400 overflow-hidden w-full z-50 transition duration-150 absolute bottom-0 right-0`}
    >
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm">
            <span>
              {query ? `Resultados:` : (label || 'Buscar')}
            </span>

            {query &&
              <span className="ml-3">
                {items.length > 0 ? `${items.length} / ${meta.total}` : '0'}
              </span>
            }
          </div>

          <button
            onClick={onClose}
            className="p-1 cursor-pointer"
            type="button"
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <SearchIcon size={14} />
          </span>
          <input
            style={{ backgroundColor: bgColor }}
            className="w-full border border-white/5 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary text-white placeholder:text-gray-500 outline-none transition-all"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            placeholder="Buscar..."
            type="search"
          />
        </div>
      </div>

      <ul className="mt-4 overflow-y-auto max-h-66 search-widget-content">
        {items.map((it) => {
          const label = it[keys.label] ?? '';
          const value = it[keys.value] ?? '';
          const sub = keys.sub ? getValue(it, keys.sub) : '';

          return (
            <li
              onClick={() => {
                payload && payload({
                  label,
                  value,
                  item: it,
                  search: { query, page }
                });
                onClose();
              }}
              className="hover:bg-white/5 cursor-pointer py-2 px-3 flex items-center gap-3"
              key={it.id}
            >
              {loadIcon && loadIcon(it)}

              <div className="overflow-hidden flex flex-col gap-0.5">
                <h3
                  className="text-[13px] font-bold text-white group-hover:text-primary transition-colors truncate"
                  title={label}
                >
                  {label}
                </h3>

                {sub &&
                  <span className="text-[9px] text-gray-400 font-mono">
                    {sub}
                  </span>
                }
              </div>
            </li>
          )
        })}

        {isLoadMore && (
          <li className="flex items-center justify-center overflow-hidden py-1">
            <div
              className="flex-1 flex items-center justify-center"
              ref={loaderRef}
            >
              <Loader
                className="border-transparent border-t-slate-200"
                size={20}
                stroke={2}
              />
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}

export default SearchWidget;