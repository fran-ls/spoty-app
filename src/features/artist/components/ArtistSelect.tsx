import { useEffect, useRef, useState } from "react";
import "../../../assets/css/select.css"
import type { Artist } from "../artist.types";
import Loader from "../../../shared/components/Loader";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";

type Option = {
  label: string;
  value: string;
  item?: Artist | null;
}

interface ArtistSelectProps {
  option?: Option;
  items: Artist[];
  isLoadMore?: boolean;
  bgColor?: string;
  loadMore?: () => void;
  payload?: (option: Option) => void;
}

const ArtistSelect = (props: ArtistSelectProps) => {
  const { option, items, isLoadMore = false, bgColor = '#181818', payload, loadMore } = props;

  const [isActive, setIsActive] = useState(false);
  const [item, setItem] = useState<Option>({
    label: 'Seleccionar',
    value: '',
  });

  const { loaderRef } = useInfiniteScroll(() => {
    if (loadMore) loadMore();
  });
  const wrapRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  const wrap = wrapRef.current!;
  const ul = ulRef.current!;

  useEffect(() => {
    if (ul && wrap) {
      wrap.style.width = `${ul.offsetWidth > wrap.offsetWidth ? ul.offsetWidth : wrap.offsetWidth}px`;
      ul.style.width = `${wrap.offsetWidth > ul.offsetWidth ? wrap.offsetWidth : ul.offsetWidth}px`;
    }
  }, []);

  return (
    <div
      className="accordion-wrap"
      ref={wrapRef}
    >
      <label
        style={{
          backgroundColor: bgColor,
          padding: '12px 16px',
          borderRadius: 12,
          border: '1px solid #ffffff0d'
        }}
        className="accordion-label p-4 rounded-lg"
      >
        <input
          onChange={(e) => setIsActive(e.currentTarget.checked)}
          checked={isActive}
          type="checkbox"
        />
        <span className="truncate">
          {option ? option.label : item.label}
        </span>
        <svg
          className="arrow"
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
        >
          <path
            d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
          ></path>
        </svg>
      </label>

      <div
        style={{
          height: isActive ? ul.offsetHeight : 0,
        }}
        className="accordion-ul-wrap"
      >
        <ul
          style={{
            maxHeight: '200px',
            overflowBlock: 'auto',
            backgroundColor: bgColor,
            border: '1px solid #ffffff0d',
            borderRadius: '12px'
          }}
          className="accordion-ul"
          ref={ulRef}
        >
          <li
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#424242a0';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onClick={() => {
              payload && payload({ label: 'Seleccionar', value: '', item: null });
              setItem({ label: 'Seleccionar', value: '', item: null });
              setIsActive(false);
            }}
            style={{ backgroundColor: bgColor }}
            className="accordion-option"
          >
            Seleccionar
          </li>

          {items.map((a) => (
            <li
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#424242a0';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => {
                payload && payload({ label: a.name, value: a.id, item: a });
                setItem({ label: a.name, value: a.id, item: a });
                setIsActive(false);
              }}
              style={{
                display: 'block',
                overflow: 'clip',
                width: '100%',
                backgroundColor: bgColor
              }}
              className="accordion-option truncate"
              title={a.name}
              key={a.id}
            >
              {a.name}
            </li>
          ))}

          {isLoadMore &&
            <li style={{ backgroundColor: bgColor }}>
              <div
                className="flex items-center justify-center overflow-hidden"
                ref={loaderRef}
              >
                <Loader
                  className="border-transparent border-t-slate-200"
                  size={20}
                  stroke={2}
                />
              </div>
            </li>
          }
        </ul>
      </div>
    </div>
  )
}

export default ArtistSelect;