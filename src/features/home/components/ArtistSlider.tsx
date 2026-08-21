import { useEffect } from "react";
import { UserIcon } from "lucide-react";
import useArtist from "../../artist/hooks/useArtist";
import Slider from "../../../shared/components/Slider";
import artistService from "../../artist/services/artist.service";

const ArtistSlider = () => {
  const { artists, searchArtists } = useArtist();

  useEffect(() => { searchArtists() }, []);

  return (
    <Slider
      keys={{
        title: 'name'
      }}
      playable={false}
      title="Artistas"
      subtext="Artista"
      items={artists}
      // linkToRedirect={routes.home}
      // linkToViewAll={routes.home}
      loadImage={(artist) => (artistService.artistImage(artist.id, artist.image))}
      icon={(
        <UserIcon className="w-[20%] h-[20%]" />
      )}
    />
  )
}

export default ArtistSlider;