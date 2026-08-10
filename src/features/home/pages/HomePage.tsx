import { useRef, useState } from 'react';
import '../../../assets/css/home.css';
import UserPlaylistsSlider from '../components/UserPlaylistsSlider';
import ArtistSlider from '../components/ArtistSlider';
import RecentSlider from '../components/RecentSlider';
import LastPlaylistPlayed from '../components/LastPlaylistPlayed';
import GradientBanner from '../components/GradientBanner';

const HomePage = () => {
  const [playlist, setPlaylist] = useState<any>(null);

  const bannerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="pt-6 pb-10 min-h-full bg-[#131313] text-white select-none scroll-smooth animate-fade-in"
      id="spotify-home-stage"
    >
      <GradientBanner
        playlist={playlist}
        bannerRef={bannerRef}
      />

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