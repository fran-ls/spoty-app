import { useEffect } from "react";
import { UserIcon } from "lucide-react";
import useArtist from "../../artist/hooks/useArtist";
import Slider from "../../../shared/components/Slider";
import artistService from "../../artist/services/artist.service";
import { routes } from "../../../shared/utils/routes";
import SliderSkeletons from "../../../shared/components/SliderSkeletons";

const ArtistSlider = () => {
  const { artists, loading, searchArtists } = useArtist();

  useEffect(() => { searchArtists() }, []);

  if (loading) return (
    <SliderSkeletons title="Artistas" />
  )

  return (
    <Slider
      keys={{
        title: 'name'
      }}
      playable={false}
      title="Artistas"
      subtext="Artista"
      items={artists}
      linkToRedirect={routes.artists}
      linkToViewAll={routes.artists}
      loadImage={(artist) => (artistService.artistImage(artist.id, artist.image))}
      icon={(
        <UserIcon className="w-[20%] h-[20%]" />
      )}
    />
  )
}

export default ArtistSlider;