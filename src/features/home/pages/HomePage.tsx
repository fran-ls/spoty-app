import '../../../assets/css/home.css';
import UserPlaylistsSlider from '../components/UserPlaylistsSlider';
import ArtistSlider from '../components/ArtistSlider';
import RecentSlider from '../components/RecentSlider';
import LastPlaylistPlayed from '../components/LastPlaylistPlayed';

const HomePage = () => {
  return (
    <div
      className="pt-6 pb-10 min-h-full bg-[#131313] text-white select-none scroll-smooth animate-fade-in"
      // className="pt-6 pb-10 min-h-full bg-linear-to-b from-[#2a2a2a] via-[#1a1a1a] to-[#131313] text-white select-none scroll-smooth animate-fade-in"
      id="spotify-home-stage"
    >
      <LastPlaylistPlayed />

      <ArtistSlider />

      <RecentSlider />

      <UserPlaylistsSlider />
    </div>
  )
}

export default HomePage;