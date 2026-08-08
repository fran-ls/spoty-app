import { useRef } from 'react';
import usePlayer from '../hooks/usePlayer';
import Playing from './Playing';
import Queue from './Queue';

export const Player = () => {
  const { isPlayer } = usePlayer();

  const asideRef = useRef<HTMLDivElement>(null);

  const isCollapsed = !isPlayer;

  return (
    <aside
      className={`${isCollapsed ? 'w-11' : 'w-72'} min-h-[calc(100vh-64px-88px)] max-h-[calc(100vh-64px-88px)] rounded-lg hidden md:flex h-full overflow-hidden flex-col bg-[#131313] border-none select-none shrink-0 relative`}
      ref={asideRef}
      id="spotify-sidebar"
    >
      <Playing asideRef={asideRef} />
      <Queue />
    </aside>
  )
}
