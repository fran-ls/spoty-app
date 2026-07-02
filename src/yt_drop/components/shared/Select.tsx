import { useEffect, useRef, useState } from "react";
import { getStyles } from "../../helpers/getStyles";

export type Item = {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface SelectOption {
  label?: string;
  items: Item[];
  activeIndex?: number;
  isHidden?: boolean;
  wrapId?: string;
  className?: string;
  option?: (payload: Item) => void;
  onOption?: (payload: Item) => void;
  deps?: any[];
}

const Select = (props: SelectOption) => {
  const {
    items, isHidden, className = '', wrapId = '',
    activeIndex = 0, deps, onOption
  } = props;

  const isHide = isHidden ?? false;
  const index = activeIndex > 0 && activeIndex < items.length ? activeIndex : 0;

  const labelRef = useRef<HTMLLabelElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  const [option, setOption] = useState<Item>({
    label: '',
    value: '',
    icon: null
  });

  function setNewHeight() {
    if (isHide) return;

    const label = labelRef.current;
    const wrap = wrapRef.current;
    const ul = ulRef.current;

    if (!label || !wrap || !ul) return;

    const ulStyles = getStyles({
      element: ul,
      styleList: 'border-width:true',
    });

    const borderWidth = ulStyles['border-width'];
    const newWidth = (ul.offsetWidth - borderWidth * 2) + 'px';

    label.style.width = newWidth;
    ul.style.width = newWidth;

    const wrapStyles = getStyles({
      element: wrap,
      styleList: 'padding-top:true',
    });

    wrap.style.height = ul.offsetHeight + wrapStyles['padding-top'] + 'px';
  }

  function resetHeight() {
    if (wrapRef.current) {
      wrapRef.current.style.height = '0';
    }
  }

  useEffect(() => { setOption(items[index]) }, [...(deps || [])]);
  useEffect(() => { props.option && props.option(option) }, [option]);

  return (
    <div
      className={`select-wrap ${isHide ? 'hidden' : ''}`}
      onPointerOver={setNewHeight}
      onMouseLeave={resetHeight}
      id={wrapId}
    >
      {option.label && (
        <>
          <p className="opt-label">{props.label}</p>
          <label
            className={`select-label ${className}`}
            ref={labelRef}
          >
            <input type="checkbox" />

            {option.icon &&
              <div className="select-icon-wrap">
                {option.icon}
              </div>
            }

            <span
              className="truncate opt-marked"
              data-value={option.value}
            >
              {option.label}
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
        </>
      )}

      <div
        style={{ paddingTop: isHide ? 0 : 8 }}
        className="select-ul-wrap"
        ref={wrapRef}
      >
        <ul
          style={{ gap: 0 }}
          className="select-ul"
          ref={ulRef}
        >
          {items.map((item, i) => (
            <li
              onClick={() => {
                setOption(item);
                onOption && onOption(item);
              }}
              style={{ borderRadius: 0, padding: '4px 8px' }}
              className="select-option"
              data-value={item.value}
              key={`idx-${i + 1}`}
            >
              {item.icon ? item.icon : null}
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Select;