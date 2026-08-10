import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PauseIcon, PlayIcon } from "lucide-react";
import type { HistoryPlaylist } from "../../player/playHistory.types";
import type { Playlist } from "../../playlist/playlist.types";
import playHistoryService from "../../player/services/playHistory.service";
import useAuth from "../../auth/hooks/useAuth";
import playlistService from "../../playlist/services/playlist.service";
import SmartImage from "../../../shared/components/SmartImage";
import { routes } from "../../../shared/utils/routes";
import usePlayer from "../../player/hooks/usePlayer";

const LastPlaylistPlayed = () => {
  const { user } = useAuth();
  const { isPlaying, currentPlaylist, togglePlay, play, onPlaylistChange } = usePlayer();

  // Grid collection matching exact prompt mockup
  const quickAccessGrid = [
    { id: 'techno_bunker', name: 'Techno Bunker', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf1NaZTBitthIYfInIVbfS2EMzCcOVEfx8RZtsIcS4Ein_62b1kNGDwWQpfUKEYDAalo32tp2eSQHw3PaqfrNXd84sEQhjL-TRBN3IN9FVO6dcczBJaa1UiCeH5VWDxRJXUlKhBifdlg9iPXlF1YX4G3BZFYfR1ZZDtfFdV7uPB8H5IAoABjFz7FnuV9rKn46qKW224Hzv4w6nvZLMU09Xqc_dv2k21qnExKXizI4o3QeIglQ3tlB9W_uElVN_JAhC6A4KSCFIAxhJ' },
    { id: 'electronic_focus', name: 'Electronic Focus', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJTLGfWQfO8AEdntUIEA2I1sNV8qgzM_8jSFt81xsnKsxfmn6O__UZV6jvLC_aKkfBB4QmAfqAi8iSBdUDyOY6oO9chio6J4Hz_PWt2d_UZdUDZMu2cKIz0T5QlHVPLf73FphX9z9JF_JfucZ3HVTnTRN2n2KjyqcW_MkccT_2FEIGQiPE44ZMxlzuOtzJMkNx1eRwOXTlvHtlBpyNlvqkLnCRARztZntBfvm9E2EeuJwCcxI4JSTAii_D09lplGr1XzliVaBqjpK8' },
    { id: 'late_night_jazz', name: 'Late Night Jazz', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaxm-x5ZwdSIp1o1iTt2RgQJo8-cN-FRYs8ANlBTpPp2z8m437BmqyrBpMgz40_UB_YJDEyVvKpH9_Kp56CUvhSb0ghUhwj_j6VjX3HwW9Xs5CgGSZdca1VoeLbq_Wy7rjFUvgg0kghxqWE-UHRGGMgv3-uEhj-7XMAEHO7G5crSxhg3shqNHSQcBchHpJzKmye8KvdQSi_hzh3DQxQPXgDTDQntM9_9htmG6FpheYxITRl2jEP2xIzYqNFtvCaVv_gyf_TdcrYAY0' },
    { id: 'live_classics', name: 'Live Classics', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_Hr-SlYkAMb02-s5Po7vNxWxt45o9l4c8OQDf4TXw7tGASfgd900L6dvLeGYQrftnE3xBOnVdYHe8ylJjU5eNM3_23ZB47U2yVPdHs6bVp-d5ErjZtBpEMSBsp1i7NYFiZZzwli2ceNP3pP_AjSeHnnyzvZ-_Iv5AE-t4Q2U65GDPJFew68AmLL_gjnzBwfHwRzyMnKVz2PkeXzu7m1pyvxaAaF1-_RX6MxrS0tkfujt6a0jJJbJ2BxEHyvJMp4LH86ODwgpSAZPy' },
    { id: 'discover_weekly', name: 'Discover Weekly', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeNxYUiH_xh1-AtH2KnNXdaeRkrI1cDW_a3vWxxMX58tNb-k5WWt_ey_j5xtU2glHodotxWSLPCiQvZxJvx3ccK243dptlJ5AdHpB3VTEAeH_HVxXO3v1UyU6wO9Gy_V8Jw5ekl1jWfYZbRy9-shE8p_ZEghMvZ9XR0HimSRsiZl0B31K-mhA8YqYm9HwO5qsst0_0pVgfs5oJfQM4eRpN5fERko43Z2DKkRTzTVkyA5ucsD4Hkr-cbMrYKAMj5rPBg-aSvdJ6kdWb' },
    { id: 'daily_mix_1', name: 'Daily Mix 1', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp48qE2s5HJlg_nyZlhNkOgQK5MoBjzuPPCnhQNA32-hGG4mZUXlUBSN2NB-EvLn88byNCeNwi_clA0UdGUsr_EX_ZOrK4GbynnHZxzBqzlhPTgsJWiXcgnEFeh9rBlRTT8KocubWLpivBt4DsZK5pmOpCSfkpviSo4H02820Ew2rN9cCJPLZ27Bhy61iuBKLFTPaIw8ZqRirQYi1GF8He3DblQOUve_lhqPOh7kLM6m9uXz382aOpUJQrwCFn88_ZKDmOgpi0-M8D' }
  ];

  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState<HistoryPlaylist[]>([]);

  async function getPlaylists() {
    if (!user?.id) return;
    const { data } = await playHistoryService.getPlaylists(user.id);
    if (data?.items) setPlaylists(data.items);
  }

  async function getPlaylistSongs(playlist: Playlist, isCurrent: boolean) {
    if (isCurrent) {
      togglePlay();
      return;
    }

    const { data } = await playlistService.getPlaylistSongs(playlist.id);
    if (!data || !data.songs.length) return;

    play(data.songs, 0, data.meta);
    onPlaylistChange(playlist);
  }

  useEffect(() => { getPlaylists() }, []);

  return (
    <section className="px-8 mb-12" id="home-greeting-section">
      <h1 className="text-3xl font-bold font-headline mb-6 tracking-tight text-white select-none">
        Good evening
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {quickAccessGrid.map((item) => (
          <div
            key={item.id}
            // onClick={() => openPlaylist(item.id)}
            className="group flex items-center bg-white/5 hover:bg-white/10 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer relative pr-16 active:scale-98"
          >
            <div className="w-20 h-20 bg-[#262626] shrink-0 relative overflow-hidden">
              <img
                alt={item.name}
                className="w-full h-full object-cover select-none"
                src={item.coverUrl}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="px-5 flex-1 font-headline font-extrabold text-[#ffffff] text-sm truncate">
              {item.name}
            </div>
            <button
              // onClick={(e) => handleQuickPlay(e, item.id)}
              className="absolute right-4 bg-primary text-black p-3 rounded-full shadow-2xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-90"
            >
              <PlayIcon size={18} fill="currentColor" stroke="none" />
            </button>
          </div>
        ))}

        {playlists.map((it) => {
          const playlist = it.playlist;
          if (!playlist) return null;

          const cover = playlistService.playlistCover(playlist.id, playlist?.cover);
          const isCoverImgs = !cover && it.coverImages && it.coverImages.length > 3;
          const isCurrent = currentPlaylist?.id === playlist.id;

          return (
            <div
              onClick={() => navigate(`${routes.playlists}/${playlist.id}`)}
              className="group flex items-center bg-white/5 hover:bg-white/10 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer relative pr-16 active:scale-98"
              key={playlist.id}
            >
              <div className="aspect-square w-20 h-20 shrink-0 relative overflow-hidden bg-[#333333]">
                <SmartImage
                  wrapClassName="bg-transparent"
                  url={cover}
                  styles={{
                    imgWrap: 'w-full h-full',
                    icon: 'text-white w-[40%] h-[40%]'
                  }}
                />

                {isCoverImgs && it.coverImages.map((img, i) => {
                  const className = i === 0
                    ? 'top-0 left-0' : i === 1
                      ? 'top-0 right-0' : i === 3
                        ? 'bottom-0 right-0' : 'bottom-0 left-0';

                  return (
                    <img
                      className={`${className} absolute w-1/2 h-1/2 object-cover`}
                      crossOrigin="anonymous"
                      src={img.url}
                      alt="cover"
                      key={img.id}
                    />
                  )
                })}
              </div>

              <div className="px-5 flex-1 font-headline font-extrabold text-[#ffffff] text-sm truncate">
                {playlist.name}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (playlist.trackCount) getPlaylistSongs(playlist, isCurrent);
                }}
                className={`absolute right-4 bg-primary text-black p-3 rounded-full shadow-2xl group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-105 active:scale-90 ${isCurrent && isPlaying ? 'translate-y-0 opacity-100' : 'opacity-0 translate-y-3'} group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:scale-105`}
                type="button"
              >
                {isPlaying && isCurrent
                  ? <PauseIcon size={18} fill="currentColor" stroke="none" />
                  : <PlayIcon size={18} fill="currentColor" stroke="none" />
                }
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default LastPlaylistPlayed;