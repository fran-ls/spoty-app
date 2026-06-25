import { useEffect, useRef, useState } from "react";
import "../../assets/css/select.css"

type Option<T = any> = {
  label: string;
  value: string;
  item?: T | null;
}

interface SelectProps {
  items: Option[];
  selectedIndex?: number;
  className?: string;
  styles?: React.CSSProperties;
  ulStyles?: React.CSSProperties;
  ulWrapStyles?: React.CSSProperties;
  liStyles?: React.CSSProperties;
  payload?: (option: Option) => void;
}

const Select = (props: SelectProps) => {
  const {
    styles, ulStyles, ulWrapStyles, items, liStyles,
    selectedIndex = undefined, className = '', payload
  } = props;

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

  useEffect(() => {
    if (selectedIndex !== undefined) setOption(items[selectedIndex]);
  }, []);
  useEffect(() => { if (payload) payload(option) }, [option]);

  return (
    <div
      className="accordion-wrap"
      ref={wrapRef}
    >
      <label
        className={`accordion-label p-4 rounded-lg ${className}`}
        style={styles}
      >
        <input
          onChange={(e) => setIsActive(e.currentTarget.checked)}
          checked={isActive}
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
        style={{
          height: isActive ? ul.offsetHeight : 0,
          ...ulWrapStyles
        }}
        className="accordion-ul-wrap"
      >
        <ul
          className="accordion-ul"
          style={ulStyles}
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
              setOption({ label: 'Seleccionar', value: '' });
              setIsActive(false);
            }}
            style={liStyles}
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
                setOption({
                  label: a.label,
                  value: a.value,
                  item: a
                });
                setIsActive(false);
              }}
              style={liStyles}
              className="accordion-option"
              key={a.value}
            >
              {a.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Select;