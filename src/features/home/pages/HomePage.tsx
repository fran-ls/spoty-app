import { useMemo, useRef, useState } from 'react';
import '../../../assets/css/home.css';
import UserPlaylistsSlider from '../components/UserPlaylistsSlider';
import ArtistSlider from '../components/ArtistSlider';
import RecentSlider from '../components/RecentSlider';
import LastPlaylistPlayed from '../components/LastPlaylistPlayed';
import GradientBanner from '../components/GradientBanner';
import { getFmtDate } from '../../../shared/utils/getFormatDate';
import useAuth from '../../auth/hooks/useAuth';
import { getDeviceType } from '../../../shared/utils/getDeviceType';

const HomePage = () => {
  const { user } = useAuth();
  const isDesktop = getDeviceType() === 'desktop';

  const [playlist, setPlaylist] = useState<any>(null);

  const bannerRef = useRef<HTMLDivElement>(null);

  const welcome = useMemo(() => {
    const hour = Number(getFmtDate(new Date(), 'HH'));
    return hour >= 18 ? `¡Buenas noches ${user?.username}!` : `¡Buen día ${user?.username}!`;
  }, []);

  return (
    <div
      className="pt-8 pb-10 min-h-full bg-[#131313] text-white select-none scroll-smooth animate-fade-in"
      id="spotify-home-stage"
    >
      <GradientBanner
        playlist={playlist}
        bannerRef={bannerRef}
      />

      <h2
        className={`${isDesktop ? 'px-8 mb-6' : 'px-4 mb-12'} text-xl md:text-2xl lg:text-3xl font-headline tracking-tight text-white select-none google-sans-flex-font`}
        style={{
          fontWeight: window.innerWidth >= 786 ? '' : 600
        }}
      >
        {welcome}
      </h2>

      <LastPlaylistPlayed
        setPlaylist={setPlaylist}
        bannerRef={bannerRef}
      />

      <ArtistSlider />

      <RecentSlider />

      <UserPlaylistsSlider />
    </div>
  )
}

export default HomePage;