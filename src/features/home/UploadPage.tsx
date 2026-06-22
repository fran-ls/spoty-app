import { useState } from "react";
import ArtistForm from "./components/ArtistForm";
import PlaylistForm from "./components/PlaylistForm";
import SongForm from "./components/SongForm";

const UploadPage = () => {
	const [tab, setTab] = useState<string>('song');

	return (
		<div className="flex flex-1 overflow-hidden">
			<main className="flex-1 overflow-y-auto bg-surface-container p-8 md:p-12 hide-scrollbar">
				<header className="mb-12">
					<h1 className="text-white text-3xl font-black font-display text-on-surface mb-4">
						Subir Contenido
					</h1>
					<p className="text-on-surface-variant text-base font-body leading-relaxed">
						Publica tus últimas creaciones, gestiona tu perfil de artista y
						organiza colecciones para tus oyentes en la galería sónica de
						Spotify.
					</p>
				</header>

				<nav className="text-on-primary-container flex gap-4 mb-10 border-b border-[#48484733] pb-4">
					<button
						className={`${tab === 'song' ? 'bg-primary text-black' : 'text-[#adaaaa]'} px-6 py-2 rounded-full hover:text-[#adaaaa] hover:bg-surface-container-highest font-bold transition-all text-sm`}
						id="tab-song"
						onClick={() => setTab('song')}
					>
						Canción
					</button>
					<button
						className={`${tab === 'artist' ? 'bg-primary text-black' : 'text-[#adaaaa]'} px-6 py-2 rounded-full hover:text-[#adaaaa] hover:bg-surface-container-highest font-bold transition-all text-sm`}
						id="tab-artist"
						onClick={() => setTab('artist')}
					>
						Artista
					</button>
					<button
						className={`${tab === 'playlist' ? 'bg-primary text-black' : 'text-[#adaaaa]'} px-6 py-2 rounded-full hover:text-[#adaaaa] hover:bg-surface-container-highest font-bold transition-all text-sm`}
						id="tab-playlist"
						onClick={() => setTab('playlist')}
					>
						Playlist
					</button>
				</nav>

				{tab === 'song' && <SongForm />}
				{tab === 'artist' && <ArtistForm />}
				{tab === 'playlist' && <PlaylistForm />}
			</main>
		</div>
	)
}

export default UploadPage;