import {
  type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode,
  useCallback, useEffect, useRef, useState,
} from "react";

import "../../assets/css/custom_scrollbar.css";

type ScrollbarMode = "vertical" | "horizontal" | "both" | "none";

interface CustomScrollbarProps {
  children: ReactNode;
  scrollbar?: ScrollbarMode;
  className?: string;
  style?: CSSProperties;
  minThumbSize?: number;
}

export function CustomScrollbar(props: CustomScrollbarProps) {
  const {
    children,
    scrollbar = "both",
    className = "",
    style,
    minThumbSize = 30
  } = props;

  const viewportRef = useRef<HTMLDivElement>(null);

  const [isHover, setIsHover] = useState(false);
  const [state, setState] = useState({
    hasVerticalScroll: false,
    hasHorizontalScroll: false,

    verticalThumbSize: 0,
    verticalThumbPosition: 0,

    horizontalThumbSize: 0,
    horizontalThumbPosition: 0
  });

  const showVertical = scrollbar === "vertical" || scrollbar === "both";
  const showHorizontal = scrollbar === "horizontal" || scrollbar === "both";

  const updateScrollbars = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;

    const {
      scrollHeight,
      clientHeight,
      scrollWidth,
      clientWidth,
      scrollTop,
      scrollLeft,
    } = el;

    const hasVerticalScroll = showVertical && scrollHeight > clientHeight;
    const hasHorizontalScroll = showHorizontal && scrollWidth > clientWidth;

    // Vertical
    const verticalRatio = clientHeight / scrollHeight;

    const verticalThumbSize = hasVerticalScroll
      ? Math.max(clientHeight * verticalRatio, minThumbSize)
      : 0;

    const verticalTrackSize = clientHeight;
    const verticalAvailableSpace = verticalTrackSize - verticalThumbSize - 5;
    const maxScrollTop = scrollHeight - clientHeight;

    const verticalThumbPosition = maxScrollTop > 0
      ? (scrollTop / maxScrollTop) * verticalAvailableSpace
      : 0;

    // Horizontal
    const horizontalRatio = clientWidth / scrollWidth;

    const horizontalThumbSize = hasHorizontalScroll
      ? Math.max(clientWidth * horizontalRatio, minThumbSize)
      : 0;

    const horizontalTrackSize = clientWidth;
    const horizontalAvailableSpace = horizontalTrackSize - horizontalThumbSize;
    const maxScrollLeft = scrollWidth - clientWidth;

    const horizontalThumbPosition = maxScrollLeft > 0
      ? (scrollLeft / maxScrollLeft) * horizontalAvailableSpace
      : 0;

    setState({
      hasVerticalScroll,
      hasHorizontalScroll,

      verticalThumbSize,
      verticalThumbPosition,

      horizontalThumbSize,
      horizontalThumbPosition
    });
  }, [minThumbSize, showHorizontal, showVertical, isHover]);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;

    updateScrollbars();

    const resizeObserver = new ResizeObserver(() => {
      updateScrollbars();
    });

    resizeObserver.observe(element);

    // También observa cambios en el contenido.
    if (element.firstElementChild) {
      resizeObserver.observe(element.firstElementChild);
    }

    element.addEventListener("scroll", updateScrollbars, {
      passive: true,
    });

    return () => {
      resizeObserver.disconnect();
      element.removeEventListener("scroll", updateScrollbars);
    }
  }, [updateScrollbars]);

  const handleVerticalDrag = (ev: ReactPointerEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.stopPropagation();

    const viewport = viewportRef.current;
    if (!viewport) return;

    const startY = ev.clientY;
    const startScrollTop = viewport.scrollTop;

    const trackSize = viewport.clientHeight;
    const availableTrack = trackSize - state.verticalThumbSize;
    const maxScroll = viewport.scrollHeight - viewport.clientHeight;

    if (availableTrack <= 0 || maxScroll <= 0) {
      return;
    }

    const handlePointerMove = (ev: PointerEvent) => {
      const deltaY = ev.clientY - startY;
      const scrollDelta = (deltaY / availableTrack) * maxScroll;
      viewport.scrollTop = startScrollTop + scrollDelta;
    }

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  const handleHorizontalDrag = (ev: ReactPointerEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.stopPropagation();

    const viewport = viewportRef.current;
    if (!viewport) return;

    const startX = ev.clientX;
    const startScrollLeft = viewport.scrollLeft;

    const trackSize = viewport.clientWidth;
    const availableTrack = trackSize - state.horizontalThumbSize;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;

    if (availableTrack <= 0 || maxScroll <= 0) {
      return;
    }

    const handlePointerMove = (ev: PointerEvent) => {
      const deltaX = ev.clientX - startX;
      const scrollDelta = (deltaX / availableTrack) * maxScroll;
      viewport.scrollLeft = startScrollLeft + scrollDelta;
    }

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  const handleVerticalTrackClick = (ev: ReactPointerEvent<HTMLDivElement>) => {
    if (ev.target !== ev.currentTarget) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    const rect = ev.currentTarget.getBoundingClientRect();
    const position = ev.clientY - rect.top - state.verticalThumbSize / 2;
    const availableTrack = viewport.clientHeight - state.verticalThumbSize;

    const percentage = Math.max(0, Math.min(1, position / availableTrack));
    viewport.scrollTop = percentage * (viewport.scrollHeight - viewport.clientHeight);
  }

  const handleHorizontalTrackClick = (ev: ReactPointerEvent<HTMLDivElement>) => {
    if (ev.target !== ev.currentTarget) return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    const rect = ev.currentTarget.getBoundingClientRect();
    const position = ev.clientX - rect.left - state.horizontalThumbSize / 2;

    const availableTrack = viewport.clientWidth - state.horizontalThumbSize;
    const percentage = Math.max(0, Math.min(1, position / availableTrack));
    viewport.scrollLeft = percentage * (viewport.scrollWidth - viewport.clientWidth);
  }

  return (
    <div
      className={`custom-scrollbar ${className}`}
      style={style}
    >
      <div
        ref={viewportRef}
        onPointerOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}
        className="custom-scrollbar__viewport"
      >
        <div className="custom-scrollbar__content">
          {children}
        </div>
      </div>

      {state.hasVerticalScroll && (
        <div
          className="custom-scrollbar__track custom-scrollbar__track--vertical"
          onPointerDown={handleVerticalTrackClick}
        >
          <div
            className="custom-scrollbar__thumb custom-scrollbar__thumb--vertical"
            style={{
              height: state.verticalThumbSize,
              transform: `translateY(${state.verticalThumbPosition}px)`,
            }}
            onPointerDown={handleVerticalDrag}
          />
        </div>
      )}

      {state.hasHorizontalScroll && (
        <div
          className="custom-scrollbar__track custom-scrollbar__track--horizontal"
          onPointerDown={handleHorizontalTrackClick}
        >
          <div
            className="custom-scrollbar__thumb custom-scrollbar__thumb--horizontal"
            style={{
              width: state.horizontalThumbSize,
              transform: `translateX(${state.horizontalThumbPosition}px)`,
            }}
            onPointerDown={handleHorizontalDrag}
          />
        </div>
      )}
    </div>
  )
}