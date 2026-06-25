import type { Playlist, Genre, Artist, Podcast, Album, Track } from '../music.types';

export const mockTracks: Track[] = [
  {
    id: 'stairway',
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    duration: '8:02',
    durationSec: 482,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAro7Acp0MO5rBQ30lkG84H8FHQTNzNZ1_AlGNsPuoocqzPoeM9lne9Bo0xAf9Dr8lO_Wye8yDaBQiDJ-rgLdJxJ5HUGVFftCZ65_Bs5uEQbZdqX0jmnCAjWRkRnpV-nqPfyyESK77iaFWpAHyU518t8nkUkgeOO2w5eMZmd9JJoLsAQGaholRuIBnmmigHmGtv-7TTY1EypkxnDXhmUsQrd6Cl_JJThGTo0qf-juAGRXloQGfGkBe_Fq67eIItagcBoJjDEv6scpmC',
    addedDate: 'Dec 12, 2023',
    bpm: 82,
    releaseYear: 1971
  },
  {
    id: 'backinblack',
    title: 'Back In Black',
    artist: 'AC/DC',
    album: 'Back In Black',
    duration: '4:15',
    durationSec: 255,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-8b_rAe-wxdPhTSN9oNjjEYEVsiVhZi8ywprt7MiqCuclT72vZiVTrYEy5MTtIGUAyvqhiClWC_jRLlFKEiIsUGvVoOQwYEY3oaXqueVgqia9u_natG6-g0uM-rq5hwX5XpvP2iaE3rZ84M0iBDV8MkOO4DnbwbhUy2zaNU63Xr9AP_FoLQtJdJU1u_CO-okwXIvq8AWBa0D0ybnGj9S_46mVqa8OeJobah-GTH7-dwDPc3ibbx7yvMERQ4tyxAoMSPZDsa8f_3xB',
    addedDate: 'Dec 15, 2023',
    bpm: 93,
    releaseYear: 1980
  },
  {
    id: 'dreamon',
    title: 'Dream On',
    artist: 'Aerosmith',
    album: 'Aerosmith',
    duration: '4:28',
    durationSec: 268,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUQldjmyWXVn4WlLy1YJHJWax2Lm_aExOZ_Ma2v9rCMbyZ1k8Q8qM350HlURppkMPnORNWivZL0ddsGN52XuUWCNSpYJh5TcYzai8oVKwyEFgUYssx8mZgzDw7nQk5Quy8-8xKW-ne3U_56TjflfffPqNuaN1Idfcv8qK3JH4QcxQKIP4YmK3kjMvN4HhmZnyA2KL_QtB2B48J6IJoqcIJPzFXVL9QgmQlWkYEqyrKNW99bwW_yIGWgavk8sJDjYtGu6_QYW9LAO1i',
    addedDate: 'Jan 2, 2024',
    bpm: 80,
    releaseYear: 1973
  },
  {
    id: 'bohemian',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: '5:55',
    durationSec: 355,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgGPdrYYMgpZh5Ao2Qa9_MwdaiKynZ6Q8rYfFGkFT4OgoSFXJKao8uAYXW6h6TVf7P9KRZNvIuZA8W5sarl4CY6_UHMmTpwuNQ2eDGgPjAkuP9Wnow1BDtsaD0Rwd0BM5yS0DbZyAkZIJZ8UgRP1mlqV389pvh-QmJnEosc5sry8GETTXU4OztDrWTTNUWI9G1DNW07dA8bzgA31s3WJcYEMJKTQvnWG60mTPia6O3VQ1x6oCr07Oibv27TYOVcCcKQCp02PH-xXfE',
    addedDate: 'Jan 5, 2024',
    bpm: 72,
    releaseYear: 1975
  },
  {
    id: 'sweetchild',
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    album: 'Appetite for Destruction',
    duration: '5:56',
    durationSec: 356,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8AfSI8yqASSIJ-VXnzHVUK0bXt0GWYWP4RsONU4kcTv-MHTT6t0qjipVRuqJwoZJQ4gqaHshEoHKNHt9t_eX2eCyPpdmyzMPzyZ6tOuMhgh9F5anHZyIdtPlziP3FPZV5vxsfYVZOHmwO0jbKovjWPD7T6ZUgUe6jiYTXN4Nnc9dKl9wgYcznJh1Gel0215uzHQtK0u6qk7-oFrTXr2S6MiuNjVUWKmguLdEkuW5IHvNVpi3o9wfBTSHicVTcx4xCwGbTfA1vsgX8',
    addedDate: 'Jan 8, 2024',
    bpm: 128,
    releaseYear: 1987
  }
];

export const mockPlaylists: Playlist[] = [
  {
    id: 'rock_classics',
    name: 'Rock Classics',
    description: 'The biggest rock anthems from the 70s, 80s and 90s. Featuring Led Zeppelin, AC/DC, and more.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLgdlChtQ7u8dwH0eddYdu8nWPyQHWbjffOu4aDQzEAhS8jAiuDn4TXd6zjoJnorf7kW8ekYI0EeVEF-bYOZbomjRxtSAYFNeTScEFoTb237BzfdDQ4vZ35_EeXmgI-F9vnGYgablbHZHviIut6Y__KvI9anzMNl_E4PqmuWasbLiyvtDDl8JUlwP9zcH9b1j_q3m6q7J6oGFtLPVrKAmLHXKTSiaDdh6hKHZylhVPkXgB_9oelMJmBxXK4S6sgdK1b2Dkk5yFWdVI',
    creator: 'Spotify',
    likes: '1,245,392 likes',
    songCount: 50,
    durationText: 'about 3 hr 45 min',
    tracks: mockTracks
  },
  {
    id: 'techno_bunker',
    name: 'Techno Bunker',
    description: 'Subterranean sounds and driving industrial patterns.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf1NaZTBitthIYfInIVbfS2EMzCcOVEfx8RZtsIcS4Ein_62b1kNGDwWQpfUKEYDAalo32tp2eSQHw3PaqfrNXd84sEQhjL-TRBN3IN9FVO6dcczBJaa1UiCeH5VWDxRJXUlKhBifdlg9iPXlF1YX4G3BZFYfR1ZZDtfFdV7uPB8H5IAoABjFz7FnuV9rKn46qKW224Hzv4w6nvZLMU09Xqc_dv2k21qnExKXizI4o3QeIglQ3tlB9W_uElVN_JAhC6A4KSCFIAxhJ',
    creator: 'Electronic Music Lab',
    likes: '350,211 likes',
    songCount: 40,
    durationText: '2 hr 10 min',
    tracks: [
      {
        id: 'tb_1',
        title: 'Dark Orbit',
        artist: 'Modeselektor',
        album: 'Bunker Beats Vol 4',
        duration: '6:12',
        durationSec: 372,
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf1NaZTBitthIYfInIVbfS2EMzCcOVEfx8RZtsIcS4Ein_62b1kNGDwWQpfUKEYDAalo32tp2eSQHw3PaqfrNXd84sEQhjL-TRBN3IN9FVO6dcczBJaa1UiCeH5VWDxRJXUlKhBifdlg9iPXlF1YX4G3BZFYfR1ZZDtfFdV7uPB8H5IAoABjFz7FnuV9rKn46qKW224Hzv4w6nvZLMU09Xqc_dv2k21qnExKXizI4o3QeIglQ3tlB9W_uElVN_JAhC6A4KSCFIAxhJ',
        addedDate: 'Nov 10, 2023',
        bpm: 125,
        releaseYear: 2011
      },
      {
        id: 'tb_2',
        title: 'Industrial Resonator',
        artist: 'Slam',
        album: 'Paragraph Series 5',
        duration: '5:45',
        durationSec: 345,
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf1NaZTBitthIYfInIVbfS2EMzCcOVEfx8RZtsIcS4Ein_62b1kNGDwWQpfUKEYDAalo32tp2eSQHw3PaqfrNXd84sEQhjL-TRBN3IN9FVO6dcczBJaa1UiCeH5VWDxRJXUlKhBifdlg9iPXlF1YX4G3BZFYfR1ZZDtfFdV7uPB8H5IAoABjFz7FnuV9rKn46qKW224Hzv4w6nvZLMU09Xqc_dv2k21qnExKXizI4o3QeIglQ3tlB9W_uElVN_JAhC6A4KSCFIAxhJ',
        addedDate: 'Nov 12, 2023',
        bpm: 126,
        releaseYear: 2014
      }
    ]
  },
  {
    id: 'electronic_focus',
    name: 'Electronic Focus',
    description: 'Ambient synthesizer soundscapes helping you lock in and deep focus.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJTLGfWQfO8AEdntUIEA2I1sNV8qgzM_8jSFt81xsnKsxfmn6O__UZV6jvLC_aKkfBB4QmAfqAi8iSBdUDyOY6oO9chio6J4Hz_PWt2d_UZdUDZMu2cKIz0T5QlHVPLf73FphX9z9JF_JfucZ3HVTnTRN2n2KjyqcW_MkccT_2FEIGQiPE44ZMxlzuOtzJMkNx1eRwOXTlvHtlBpyNlvqkLnCRARztZntBfvm9E2EeuJwCcxI4JSTAii_D09lplGr1XzliVaBqjpK8',
    creator: 'Lo-Fi Chill',
    likes: '840,490 likes',
    songCount: 15,
    durationText: '1 hr 5 min',
    tracks: [
      {
        id: 'ef_1',
        title: 'Deep Quantum Workspace',
        artist: 'Tycho',
        album: 'Epochs',
        duration: '4:52',
        durationSec: 292,
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJTLGfWQfO8AEdntUIEA2I1sNV8qgzM_8jSFt81xsnKsxfmn6O__UZV6jvLC_aKkfBB4QmAfqAi8iSBdUDyOY6oO9chio6J4Hz_PWt2d_UZdUDZMu2cKIz0T5QlHVPLf73FphX9z9JF_JfucZ3HVTnTRN2n2KjyqcW_MkccT_2FEIGQiPE44ZMxlzuOtzJMkNx1eRwOXTlvHtlBpyNlvqkLnCRARztZntBfvm9E2EeuJwCcxI4JSTAii_D09lplGr1XzliVaBqjpK8',
        addedDate: 'Jan 22, 2024',
        bpm: 110,
        releaseYear: 2016
      }
    ]
  },
  {
    id: 'late_night_jazz',
    name: 'Late Night Jazz',
    description: 'Smoky horns and double bass to soothe the dark hours.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaxm-x5ZwdSIp1o1iTt2RgQJo8-cN-FRYs8ANlBTpPp2z8m437BmqyrBpMgz40_UB_YJDEyVvKpH9_Kp56CUvhSb0ghUhwj_j6VjX3HwW9Xs5CgGSZdca1VoeLbq_Wy7rjFUvgg0kghxqWE-UHRGGMgv3-uEhj-7XMAEHO7G5crSxhg3shqNHSQcBchHpJzKmye8KvdQSi_hzh3DQxQPXgDTDQntM9_9htmG6FpheYxITRl2jEP2xIzYqNFtvCaVv_gyf_TdcrYAY0',
    creator: 'Jazz Café',
    likes: '512,302 likes',
    songCount: 22,
    durationText: '1 hr 45 min',
    tracks: [
      {
        id: 'lnj_1',
        title: 'Blue In Velvet',
        artist: 'Miles Davis',
        album: 'Velvet Sessions',
        duration: '5:20',
        durationSec: 320,
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaxm-x5ZwdSIp1o1iTt2RgQJo8-cN-FRYs8ANlBTpPp2z8m437BmqyrBpMgz40_UB_YJDEyVvKpH9_Kp56CUvhSb0ghUhwj_j6VjX3HwW9Xs5CgGSZdca1VoeLbq_Wy7rjFUvgg0kghxqWE-UHRGGMgv3-uEhj-7XMAEHO7G5crSxhg3shqNHSQcBchHpJzKmye8KvdQSi_hzh3DQxQPXgDTDQntM9_9htmG6FpheYxITRl2jEP2xIzYqNFtvCaVv_gyf_TdcrYAY0',
        addedDate: 'Feb 1, 2024',
        bpm: 67,
        releaseYear: 1959
      }
    ]
  },
  {
    id: 'live_classics',
    name: 'Live Classics',
    description: 'Immortal high-fidelity live sets recording historical energy.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_Hr-SlYkAMb02-s5Po7vNxWxt45o9l4c8OQDf4TXw7tGASfgd900L6dvLeGYQrftnE3xBOnVdYHe8ylJjU5eNM3_23ZB47U2yVPdHs6bVp-d5ErjZtBpEMSBsp1i7NYFiZZzwli2ceNP3pP_AjSeHnnyzvZ-_Iv5AE-t4Q2U65GDPJFew68AmLL_gjnzBwfHwRzyMnKVz2PkeXzu7m1pyvxaAaF1-_RX6MxrS0tkfujt6a0jJJbJ2BxEHyvJMp4LH86ODwgpSAZPy',
    creator: 'Rock Archives',
    likes: '921,048 likes',
    songCount: 18,
    durationText: '2 hr 15 min',
    tracks: [
      {
        id: 'lc_1',
        title: 'Comfortably Numb - Live',
        artist: 'Pink Floyd',
        album: 'Pulse Live',
        duration: '9:15',
        durationSec: 555,
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_Hr-SlYkAMb02-s5Po7vNxWxt45o9l4c8OQDf4TXw7tGASfgd900L6dvLeGYQrftnE3xBOnVdYHe8ylJjU5eNM3_23ZB47U2yVPdHs6bVp-d5ErjZtBpEMSBsp1i7NYFiZZzwli2ceNP3pP_AjSeHnnyzvZ-_Iv5AE-t4Q2U65GDPJFew68AmLL_gjnzBwfHwRzyMnKVz2PkeXzu7m1pyvxaAaF1-_RX6MxrS0tkfujt6a0jJJbJ2BxEHyvJMp4LH86ODwgpSAZPy',
        addedDate: 'Dec 29, 2023',
        bpm: 69,
        releaseYear: 1995
      }
    ]
  },
  {
    id: 'discover_weekly',
    name: 'Discover Weekly',
    description: 'Your weekly mixtape of fresh underground discoveries, curated for you.',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeNxYUiH_xh1-AtH2KnNXdaeRkrI1cDW_a3vWxxMX58tNb-k5WWt_ey_j5xtU2glHodotxWSLPCiQvZxJvx3ccK243dptlJ5AdHpB3VTEAeH_HVxXO3v1UyU6wO9Gy_V8Jw5ekl1jWfYZbRy9-shE8p_ZEghMvZ9XR0HimSRsiZl0B31K-mhA8YqYm9HwO5qsst0_0pVgfs5oJfQM4eRpN5fERko43Z2DKkRTzTVkyA5ucsD4Hkr-cbMrYKAMj5rPBg-aSvdJ6kdWb',
    creator: 'Spotify',
    likes: '9,431 followers',
    songCount: 30,
    durationText: '1 hr 42 min',
    tracks: [
      {
        id: 'dw_1',
        title: 'Neon Horizon',
        artist: 'Kavinsky',
        album: 'Outrun Years',
        duration: '4:12',
        durationSec: 252,
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeNxYUiH_xh1-AtH2KnNXdaeRkrI1cDW_a3vWxxMX58tNb-k5WWt_ey_j5xtU2glHodotxWSLPCiQvZxJvx3ccK243dptlJ5AdHpB3VTEAeH_HVxXO3v1UyU6wO9Gy_V8Jw5ekl1jWfYZbRy9-shE8p_ZEghMvZ9XR0HimSRsiZl0B31K-mhA8YqYm9HwO5qsst0_0pVgfs5oJfQM4eRpN5fERko43Z2DKkRTzTVkyA5ucsD4Hkr-cbMrYKAMj5rPBg-aSvdJ6kdWb',
        addedDate: 'May 28, 2026',
        bpm: 118,
        releaseYear: 2013
      }
    ]
  }
];

export const mockMadeForYou: Playlist[] = [
  {
    id: 'daily_mix_1',
    name: 'Daily Mix 1',
    description: 'The National, Bon Iver, Fleet Foxes and more',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp48qE2s5HJlg_nyZlhNkOgQK5MoBjzuPPCnhQNA32-hGG4mZUXlUBSN2NB-EvLn88byNCeNwi_clA0UdGUsr_EX_ZOrK4GbynnHZxzBqzlhPTgsJWiXcgnEFeh9rBlRTT8KocubWLpivBt4DsZK5pmOpCSfkpviSo4H02820Ew2rN9cCJPLZ27Bhy61iuBKLFTPaIw8ZqRirQYi1GF8He3DblQOUve_lhqPOh7kLM6m9uXz382aOpUJQrwCFn88_ZKDmOgpi0-M8D',
    creator: 'Spotify',
    likes: '500,210 likes',
    songCount: 35,
    durationText: '2 hr 5 min',
    tracks: [
      {
        id: 'dm1_1',
        title: 'Fake Empire',
        artist: 'The National',
        album: 'Boxer',
        duration: '3:25',
        durationSec: 205,
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCp48qE2s5HJlg_nyZlhNkOgQK5MoBjzuPPCnhQNA32-hGG4mZUXlUBSN2NB-EvLn88byNCeNwi_clA0UdGUsr_EX_ZOrK4GbynnHZxzBqzlhPTgsJWiXcgnEFeh9rBlRTT8KocubWLpivBt4DsZK5pmOpCSfkpviSo4H02820Ew2rN9cCJPLZ27Bhy61iuBKLFTPaIw8ZqRirQYi1GF8He3DblQOUve_lhqPOh7kLM6m9uXz382aOpUJQrwCFn88_ZKDmOgpi0-M8D',
      }
    ]
  },
  {
    id: 'daily_mix_2',
    name: 'Daily Mix 2',
    description: 'Tame Impala, Beach House, Unknown Mortal Orchestra',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNIZyfJ2ZwsvXGk0PMotnFocPft1F967e_RwEKm7UBku5CMb1lUvzE1TV2dyGLU2oVsVeQGNQr9pqbQYDQBzql4CRuw8ZNB2-MNcGiq9kxMw4SEkXdLpc4rlbkzbWE1HU0e0Lak-zmlEL3uwfOITKhCNwSjN9LBJmYrQMDjZofRzLYAV5IySWRBc4z2TYSu9Kbq5ns5HRYHS0tvTLnx2bagqd8TwcQuLO3Z5yglyJ96pwoqCsQjomW-WCeojUEjrSNihAhoHlK4FyO',
    creator: 'Spotify',
    likes: '482,901 likes',
    songCount: 40,
    durationText: '2 hr 20 min',
    tracks: [
      {
        id: 'dm2_1',
        title: 'New Person, Same Old Mistakes',
        artist: 'Tame Impala',
        album: 'Currents',
        duration: '6:02',
        durationSec: 362,
        coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNIZyfJ2ZwsvXGk0PMotnFocPft1F967e_RwEKm7UBku5CMb1lUvzE1TV2dyGLU2oVsVeQGNQr9pqbQYDQBzql4CRuw8ZNB2-MNcGiq9kxMw4SEkXdLpc4rlbkzbWE1HU0e0Lak-zmlEL3uwfOITKhCNwSjN9LBJmYrQMDjZofRzLYAV5IySWRBc4z2TYSu9Kbq5ns5HRYHS0tvTLnx2bagqd8TwcQuLO3Z5yglyJ96pwoqCsQjomW-WCeojUEjrSNihAhoHlK4FyO',
      }
    ]
  },
  {
    id: 'daily_mix_3',
    name: 'Daily Mix 3',
    description: 'Kaytranada, Disclosure, SG Lewis and more',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAGIXD0jvG-u-VJbu0Ur0EYsPd7kw17T0da7Se_9gA3ii6VUbuyRXA2YZ0Dg-ltnIb887yTs4T00S6Oq_zMO5AsdwOX1Zv4yN3RieWirl3d0q-UUqOrR7Bk-C10QtdItaOod_UZQ9bwgaI-4GlEFfZJskVtSvta-6F1PKFdj_s91MoNnLXbEj2JGr8ss18ZuJ2XNJDafF4jkwOnmzBK0H61nPe82pEOb5FdqtCo3hf4c9_GSMTUqqDV8Q9uFzoz7f4Lg2_jM20ERxc',
    creator: 'Spotify',
    likes: '194,548 likes',
    songCount: 45,
    durationText: '2 hr 45 min',
    tracks: []
  },
  {
    id: 'daily_mix_4',
    name: 'Daily Mix 4',
    description: 'Four Tet, Bicep, Jamie xx and more',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAob9ckOVLhMF1UtQL0fI_mfvN8ejtnl5DuqGyDZASAMLXDAatF6AOC7hn78GmAxknkyr0GigNMCCpMvbaLwmFCVFsjphxrQP0QhL6AxUP4gcHJ2Mh9i33DrFO4wRe3tXYwHvGGPaKBmEya2XtmRlzRSHqlM-DpsAWlKSk7QkaYLEB2acdjE_O74VzChISzuzE66MZZtXxTXe5czyMX32Glwf--kMqR7LEf8DkJOL4E5fZD_7h5jDtNW32wdbLvSmyIZ_6sNUjCqoHS',
    creator: 'Spotify',
    likes: '315,920 likes',
    songCount: 40,
    durationText: '2 hr 10 min',
    tracks: []
  },
  {
    id: 'daily_mix_5',
    name: 'Daily Mix 5',
    description: 'Lana Del Rey, Phoebe Bridgers, Mitski and more',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBstf8ysck8Ao6KK7Tw--zZ63Sqhtcl-1XE_KZIYJa9xk3PpZGuTQIIlD5AsqHrdn42h44rWWyTwsdw5H-hf-YWjKXQFyaeF4kbMrywd-LHwwJX5ghnvGFPErshsKWmC4AX-CRe18e8Y6vHlGDBYd5HzTnioWWeXg_Arl12DetjKbrUEqPmP0vzBS36jqUL5i5cOEuffUuCFE2CdpxKfIAKqxi2a_iMFaxhyzROC6HQSTRMrCCi7PiAy-wOVBqscJ9_Hjg0qmuVd35R',
    creator: 'Spotify',
    likes: '622,439 likes',
    songCount: 50,
    durationText: '3 hr 5 min',
    tracks: []
  }
];

export const mockRecentlyPlayed = [
  {
    id: 'moonlight_trails',
    title: 'Moonlight Trails',
    subtitle: 'Album • The Celestial',
    type: 'album' as const,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY1SjgKu93QeBx4uE8uqz1dSeDYu8_bQMRmC4Uj0l1NTPESp-OyP8_twX1gXyi3QV0LigJBA8Hbl0pdh1FYMVzF-ZYKGCOh2HOh4FTRsbGyX_nIh_0tps0qvB2-1eM4dtecBNnK8QDj93dx3AiuJyS1ulKnjXV8Kvvpo3jXH85v9xpqIaxIvJJWfWU6SJO-AxtCvtBsyLP9iBdoJzW-RnavOdHpPlvsHtG1vA458B02GJMu40DFOKllISufxUk-eTZo6aBTj3jE0O8'
  },
  {
    id: 'neon_nights_recent',
    title: 'Neon Nights',
    subtitle: 'Playlist • 4.2k followers',
    type: 'playlist' as const,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmcyImyzwsnIBPLSa__KCfdnos4eltgKEdXIdC5X4gYLJ4P3vdTdlMahTnUcZjHwUhppnH_Yoz3rXaCPPi4IscLbFpAAQlRAVtU_gpyiNxiiL8_ATZ3LNZ19D4yEkniwF8AlDgE3SGi-hb0ywZc07ryXZDFx5C0p2zYuvaUDkeBsU56tXvPwvnPZ5ojy1Rm6Wfqrrq6Y6KiI1XST50nBt1atteMnGh1PKa7IcjCs4fhR8DwlGfYxhsRZ5l3cOsu_IqdTxVxb4L5qAl'
  },
  {
    id: 'into_the_wild',
    title: 'Into the Wild',
    subtitle: 'Album • Echoes',
    type: 'album' as const,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDibSUXeQONOXum6mGo2GAZ1nQ7PSZ2qx522noFDFogLadQJ54VFfnjX1Ii_O8HNTaC-i9SA_duSqCAU7n-9GTujhsqLZU6bGI6k1EhM1tkObd9K0QBP2UF_GKqbRWAK8SFcnI_V5WHoZy94lygIi6Gdt89CluEqezr2bCy540p0SP1G9BZ-nyIcbD5N2loHBOayZRvXqYjmJMc9T67q0rts6DEpW-z8vZ9ZdnG60qy_XcMfzxLpApOgdw8bzbcLLHrsIdMKEs6FV3A'
  },
  {
    id: 'solo_piano',
    title: 'Solo Piano',
    subtitle: 'Album • various artists',
    type: 'album' as const,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0oJvaRB_0qWIO2l-ImJHFIWghhrJp_G5MY9dvontq5MyAsNDjHfqt6V-inTKIy9mMK0C-owkksWRzZaR1yqPhWNy6nSFb4jJste5FFi4KcaUAU6HMqzg-B4-lvOUznlE9T1RdnRbbv6RTtI8wQdW8t0JM-Oud9kmtw6m37CzWUyqkAoV7IYNBkRnRSGtE7zWnnpNuYGO8FNOLClx5k7lLKs92uTK1lO8OQEUUGq_e7vDK-mdauG1q264VcIQiPEeVTHdwnXh8hlSJ'
  },
  {
    id: 'rock_anthems',
    title: 'Rock Anthems',
    subtitle: 'Playlist • 1.2M followers',
    type: 'playlist' as const,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUBGOtP74b1Oyw0mfqkEAJdWlKt-4D5UJKdh0VY0eZlF5-rqZ8We2nWnrgxm75l3-fAhPPwf7EQ-OwK4VswgZCQk6aIfSWKyrIsBcTFw92a0uzyqZNxOoJ3EW8offK6auzjJerK8lvfSB7UyvtCgMcFATn-9snMHyvnzHTnwa8DsSspGAYX-cm6p_9x2qdBLw7PRzOrMxbH3ZhMZOo65cmx4Q_AR36jlhOf5znK3ZUA3OgW21qIGEqAJdRg_Tph1moDQj5VYB_FBX2'
  },
  {
    id: 'deep_work',
    title: 'Deep Work',
    subtitle: 'Playlist • Spotify',
    type: 'playlist' as const,
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQfSdeFaUJPGAwEQ4pimaInEgmUTlNaKt0FK5gEXGiWDHyilw5RVR5dxoAtYqqcucVNf6hX0KSwfutNbtdNcRZON49fiGD49i4ED56CTArtQEvXoGMlCQgsvxe8D3etYNROT5Glb2h2QIZc4xs32aMq8NhisgEjDiFsp4G1r6MNGpE_GongGRUOs9CvSviMTq9R3dqNBByIcrwUjU6QubTq_cCiGVp_cXFOIVKZ8d9aLldckTK41rzadN7cvFmSfsk1MN-__qX2vDd'
  }
];

export const mockGenres: Genre[] = [
  { id: 'pop', name: 'Pop', bgColor: '#E13300', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYR3DXkDEjaxOAWjD7P0qTDDCeYHgvN5iBnraama5z-cMmRzjg7qjkMEhLOQH1qeJNg5CBCmreY2f-C9V82NdyMfQ53q1ZXnVpBJzGKma7zwPzZL4OLVqwFusI62NAap4V2NAMyxWi7r1fFW2m-VN311K2cuWE0ww_XnUQkthuVpW9AwAX2hpPp_3G7rLZvYwhJhzoDhjZp-uQDOMN6EezjbB7S1v7X30b9IWnzYGGMMoHVFnvblo_166MoZFGQGw6IoZ3CU9COubQ' },
  { id: 'rock', name: 'Rock', bgColor: '#7358FF', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAavVI_dHATaRUoNJI9bekhomnbnCbxSH9WRQV9aFEDOtTp4CT-9wmitPrrQW2QatsIJ60R6ut7zHOQVTRVY36-N6-b1g6GFa52L_oPnHTTLOil-icKfHshUSD05VCdTFI62_01nwV7Z_7l9-jVNuJlDHLWYDazDwuq99BHdjs7sJdtLP1rTZSysWmBIVctCsWPXFe8x1FPV9Bx__l0kbNyJDv5Plh3nFF9YMppduADBV8kf54MH-q1DCxaP07Wcan-TrqbXb3Kuho6' },
  { id: 'hiphop', name: 'Hip-Hop', bgColor: '#BC5900', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz8PgEkx2Ijrvt2K4lksvipLUNOhRvc4xcsCMAPo10DpySXu_YTX0LB7fdL4EEXe3EtWj0e6b8hcAq5E6HwpZC5AB1w8nyNZwkwldVPQekLZZ-0qG9H_7pLH6VbUXwtysd4aUgaEOHqDkdD72-0bsPaKJpentheKx-evcxmXyfplWHgNivZrkp0uA6SbWupUa_yvsx4gpy4VZ5ePrc-fnDI_mzGwQxpbFCSL_coBXFYHTSoKPkVk5-y0pqVd1ZY9C5jLCLvofMHLdX' },
  { id: 'latin', name: 'Latin', bgColor: '#E8115B', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpKCynadDXIQfv43xhnXIw38ZlTG7hVCku4JHKtUFEOldu01yMaz-Ni6ezqChBFhBD1SV9Hlyd8jcCFrqMKODi-j2j5V3ca-oU3QnBrCjObJljEu5ekMdb4Av7gvtj8XQZ9OXEVZD-nIcscWnSpyCKE29a4Ihoq2JEIMwn26BvYCsaPiYfuWtf91DldhTNkgR2E-f-gj8GoxyCoZn_L9AP1SlMa0dhK9Lg5p1Mq_ZTMnVkueGhV4vdiCCUeQ5ecYxD3XZt52qI-3gt' },
  { id: 'electronic', name: 'Electronic', bgColor: '#503750', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-NIrBI5XVv0KSvhhjpMq77bLey9XR4vMDWmjKxi7h9SuoKLwR7EXKmfkAhUuBoZZxtxReWAbayn3jkNIsj1U49hSFpRlAfLPa_3_tOIocxLotVaLIme6K6u1Z6Z1tXMFzPqu4jcKKzYe83a4XA7Y3dyvhLvX5GLe9tOzzoqtt5RtKVTHaZ7nDJVFb_OgZxsf6H95_Cgv_qxJsGEVeb5PoN3SKSSU0e5kLB3XjRIfAgHHYmvmXa_E2csAxOcXAIYeqgyHnjMC2R_gD' },
  { id: 'jazz', name: 'Jazz', bgColor: '#1E3264', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1nVnv2a8qkom5gQCbAohY65llJPnWPm2OvVv10qAdYDylL-H5q0xq45XJab1Du-iWOlJdM_bLxLjhI_MRq3TWykQqicOlTRM1jSWh0c17RxEeFmQ7yYiw0X7eX9GmAFiafMJN9ETXnQ8o-dGiE_AFkFapUHqI-Uf5W8Tv-7ixe3vDPYp3MwQyftIULqpmFaHOZX6xjRwMLhaeWWrod81TevvW9SqHlpjIAeMzgGGqt9Ut4VfZKImSDSLr70SmZQnX3YWIlwWs5gkD' },
  { id: 'mood', name: 'Mood', bgColor: '#E91429', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGM8hrjhvAGwn6g41xXr-Z1xMzVr3M9rwEVp5JJh4uAU8roe-DHXkY6fFFkBZ6hilPOesF7Om1xyXhLIe7Vsob16VEjcMVw0m58GCXnrmj2xbws-kWk1ngWZ3_zcPMU1-U45D9phb68-1OFH44X8FIFb9wNriRl3Vo9TJyNp1-qLkW1xXD4J3GDTVvdd5ldzHjkivOk_7zwRj1jsGODBMWKIUBQvwCBpc-3r2SfgO2E900-OAuh_dMtGW22FhHwhRbaAil-qpspy-a' },
  { id: 'indie', name: 'Indie', bgColor: '#608108', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5A8tNnlguslS3dxFyune6Fbe_9ayxslbZ6BUB9C4Tr05n_aHkBCtwNOMrdxmxAA0TZV8gtanqtAlhKJ5xEfK8WnOCKjqwkP5g5QA4meBFLfLAtSRfZKwWx_OPIRqt2PymezKPi5AK7KIIq09dkIhajzAdHwdBR54-QMh4vDPqTJC0ojGtTNIUDLdk652BvX9eR7Y6_6z8ECivSYh1t61bdjnx-QxQsyHcAKbQGS-OaKR3vdprvbe-IMd0Z8y9yvXhqy28ckQ0ka3t' },
  { id: 'podcasts', name: 'Podcasts', bgColor: '#27856A', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwXlFCwcrv-rb6TlN_r7Rn4JdfF79jw7ovjBglmEmgUx8I2u_lZE5xLGW8g93UnVjnxOueoeB92gkKIcV8nP1aPDj9O7mb84flz3M5d2lwECzcjaKjR47cxo94b7cNoo81Aw749e6taLKoVzlbSw5aOT0ltvp-GnNoLAj8s2SuPPfEYgFFgqCr0UjG09xm918YZBIPke4fGLwYdoraA_8sDLiJF4HuraOuvu0RomHDaB_BNWuZPKQ4IIabarfx87j3jsYzTuTJPd5m' },
  { id: 'charts', name: 'Charts', bgColor: '#8D67AB', coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB72doFCq3UY_JY0lPCnazxSmSDn_pw2kEU3jmXFvDouEoujP36KrD-7FwYIoD9A7BFDCbP-Fwk3ynNT3i1Q7HE4JhVo2jfOJmwgnZrF0cy-N5SbumPb3iq7xSBFk0la7XACUu3y8wOYpdLfX4XvQ8RmSOUAf1GpGcKezrE3rfF-3cAUWBznO_6Po69NtKgzQ9XxE1WWv-VE9aJrmJhfn_nuMpx3sedNOq0kiv2DAMFuOtMKyxMHqERYNt8q21exaA9vk2eUNOGO3o0' }
];

export const mockArtists: Artist[] = [
  {
    id: 'arctic_monkeys',
    name: 'Arctic Monkeys',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDA4-smmrvXKzaMndHJAGZq4Nn3ey_ouxL4xhPjXASfdlZc6xcgDILKHyH5JmqrFIeelb1blkCNrINYw3Pmo_ZHh6OcR2WTCQseIdksFLHFyQNHtRSVR4vs_Va-5RfNxOdPs19ehWCU1qEoFCQ3mTCoWNGIAIRiKIkGT36b0a7gzTEn-N3ApOQSq2mDxY3WWegNa11xiQYJIlsqSRGg1-QPRogBdTK2x2HuJn9zE0CQV1kd9QhNzJM4k9kmnM2Rk42mYXWBtodlE18Y',
    type: 'Artist'
  },
  {
    id: 'cleo_sol',
    name: 'Cleo Sol',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAG1-hmjqbXo4ORJYN4amLJCa792v2QElcufP9BbZfHLdxiS7f9py50-btgvhsQ5yBdXHPPDovxHp7Uu_Cx_ZuIo9PKDV-ApSf7-MJ80s6p7gyvm69WmGX4ayWU1sexLgwgkfG8otr2RMc0_PVC-bvyAou0sQs-TEpHFqBgXkVn0J4yw8AOtOFWlMbSmAlI2As6gKDyEoUgBIGACP4dNpNnchYFQId8rkDXT38AFTWI9MFmJdxM79MD85jBOz9Hx0P8PMw_dhDLdXtm',
    type: 'Artist'
  }
];

export const mockPodcasts: Podcast[] = [
  {
    id: 'the_daily',
    title: 'The Daily',
    publisher: 'The New York Times',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtffYD1Ed3mByZ0LztJZRNDhafo3GMIq3RjLxd-kHyZcM7x45c_Undcb3jc3FgoBMa20cY9UY55-fW1Sx7XACEbG4xRAQEFH6ekU9siLYJKanwJrgiRWUP37dlyoPYBH1VDPhj0zXSvWbZGZrKir-Ay3WQE4k_1uZJ1wyd8JsIL_vaa_xoy9BQt9YEA4RuRZzjebOkcPOB7aSnBcTiJ8FBsj2lxyB4WEcE7WCmHu6rXxNfdizAGub0WMRkpKwGOFHHHdOxCWSgYgWg'
  }
];

export const mockAlbums: Album[] = [
  {
    id: 'currents_album',
    title: 'Currents',
    artist: 'Tame Impala',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYvobAjd42bG0K_tSQaLfpvHNVFxAgAo-R3C-Ei4Kt_Yv5hU3N5ZTiobLniGnjhECkh1cNd5Fxabf0_pYKOLXmc7j6nfXGGCmopV179tIFexWEB4uJgxST-FFKTU846GKkpwDoWI20uSxTYklnUxOH5FTz4MtgY3NDxPYpbPeukvjtc5Rcy0vu-iMgJfPwvBGUIKYLecfP8xmgOzImY2LRW15GagQZ5oD824sAUXCQRZfc7uG8l01yStM71Dl76Y3YCyhC0ZxEg2JM'
  }
];
