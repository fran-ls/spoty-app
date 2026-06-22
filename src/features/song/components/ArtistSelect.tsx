import { useEffect, useRef, useState } from "react";
import "../../../assets/css/artist_select.css"
import type { Artist } from "../artist.types";

type Option = {
  label: string;
  value: string;
  item?: Artist | null;
}

interface ArtistSelectProps {
  items: Artist[];
  payload?: (option: Option) => void;
}

const ArtistSelect = ({ items, payload }: ArtistSelectProps) => {
  const [isActive, setIsActive] = useState(false);
  const [option, setOption] = useState<Option>({
    label: 'Seleccionar',
    value: '',
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

  useEffect(() => { if (payload) payload(option) }, [option]);

  return (
    <div
      className="accordion-wrap"
      ref={wrapRef}
    >
      <label className="accordion-label p-4 rounded-lg">
        <input
          onClick={(e) => setIsActive(e.currentTarget.checked)}
          type="checkbox"
        />
        <span className="truncate">{option.label}</span>
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
        style={{ height: isActive ? ul.offsetHeight : 0 }}
        className="accordion-ul-wrap"
      >
        <ul
          className="accordion-ul"
          ref={ulRef}
        >
          <li
            className="accordion-option"
            onClick={() => setOption({ label: 'Seleccionar', value: '' })}
          >
            Seleccionar
          </li>

          {items.map((a) => (
            <li
              className="accordion-option"
              onClick={() => setOption({ label: a.name, value: a.id, item: a })}
              key={a.id}
            >
              {a.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ArtistSelect;