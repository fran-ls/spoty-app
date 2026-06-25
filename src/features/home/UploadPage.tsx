import { useState } from "react";
import ArtistForm from "./components/ArtistForm";
import PlaylistForm from "./components/PlaylistForm";
import UploadTrack from "./components/UploadTrack";

const UploadPage = () => {
	const [tab, setTab] = useState<string>('song');

	return (
		<div className="min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-auto flex-1 bg-surface-container p-8 md:p-12">
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

			{tab === 'song' && <UploadTrack />}
			{tab === 'artist' && <ArtistForm />}
			{tab === 'playlist' && <PlaylistForm />}
		</div>
	)
}

export default UploadPage;