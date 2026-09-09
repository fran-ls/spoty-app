import { useEffect, useState } from "react";
import useArtist from "../hooks/useArtist";
import Loader from "../../../shared/components/Loader";
import { useInfiniteScroll } from "../../../shared/hooks/useInfiniteScroll";
import ArtistCard from "../components/ArtistCard";
import useTrack from "../../song/hooks/useTrack";
import usePlayer from "../../player/hooks/usePlayer";

const ArtistsPage = () => {
  const { artists, artistMeta, searchArtists } = useArtist();
  const { tracks, trackMeta, searchTracks } = useTrack();
  const { isPlaying, play, togglePlay, onPlaylistChange } = usePlayer();

  const [page, setPage] = useState(1);
  const [currentArtistId, setCurrentArtistId] = useState('');

  const { loaderRef } = useInfiniteScroll(async () => {
    if (page > 1 && !artistMeta.hasNextPage) return;
    const nextPage = page + 1;
    await searchArtists({ page: nextPage });
    setPage(nextPage);
  });

  async function onPlay(artistId: string) {
    if (!artistId) return;

    if (artistId === currentArtistId) {
      return togglePlay();
    }

    setCurrentArtistId(artistId);

    const data = await searchTracks({ artistId });
    if (!data || !data.items.length) return;
    play(data.items, 0, trackMeta);
    onPlaylistChange(null);
  }

  useEffect(() => { searchArtists({ page }) }, []);

  return (
    <div className="sm:px-8 px-4 py-8 text-white">
      <h1 className="mb-5 text-2xl font-bold font-headline tracking-tight">
        Artistas
      </h1>

      <ul className="md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] min-[500px]:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] grid grid-cols-2 overflow-x-hidden overflow-y-auto relative">
        {artists.map((a) => (
          <ArtistCard
            as="li"
            artist={a}
            key={a.id}
            playable={a.id !== currentArtistId ? true : tracks.length > 0}
            isPlayingNow={isPlaying && a.id === currentArtistId}
            onPlay={() => onPlay(a.id)}
          />
        ))}

        {artistMeta.hasNextPage && (
          <li className="flex-1 flex items-center justify-center py-1 overflow-hidden">
            <div
              className="flex-1 flex items-center justify-center"
              ref={loaderRef}
            >
              <Loader
                className="border-transparent border-t-slate-200"
                size={20}
                stroke={2}
              />
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}

export default ArtistsPage;