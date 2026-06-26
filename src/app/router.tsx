import { createBrowserRouter } from 'react-router-dom'
import AppShell from '../components/layout/AppShell.tsx'
import HomePage from '../pages/HomePage.tsx'
import ChordsPage from '../pages/ChordsPage.tsx'
import SongsPage from '../pages/SongsPage.tsx'
import SongFormPage from '../pages/SongFormPage.tsx'
import SongDetailPage from '../pages/SongDetailPage.tsx'
import PlaylistsPage from '../pages/PlaylistsPage.tsx'
import PlaylistFormPage from '../pages/PlaylistFormPage.tsx'
import PlaylistDetailPage from '../pages/PlaylistDetailPage.tsx'
import PracticePage from '../pages/PracticePage.tsx'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppShell />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'chords', element: <ChordsPage /> },
        { path: 'songs', element: <SongsPage /> },
        { path: 'songs/new', element: <SongFormPage /> },
        { path: 'songs/:songId', element: <SongDetailPage /> },
        { path: 'songs/:songId/edit', element: <SongFormPage /> },
        { path: 'playlists', element: <PlaylistsPage /> },
        { path: 'playlists/new', element: <PlaylistFormPage /> },
        { path: 'playlists/:playlistId', element: <PlaylistDetailPage /> },
        { path: 'playlists/:playlistId/edit', element: <PlaylistFormPage /> },
        { path: 'practice', element: <PracticePage /> },
        { path: 'practice/song/:songId', element: <PracticePage /> },
        { path: 'practice/playlist/:playlistId', element: <PracticePage /> },
      ],
    },
  ],
  { basename: '/music-lib' },
)
