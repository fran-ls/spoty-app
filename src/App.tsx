import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { AppProvider } from './shared/context/AppContext';
import { LibraryProvider } from './features/library/context/LibraryContext';
import { PlayerProvider } from './features/player/context/PlayerContext';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <LibraryProvider>
            <PlayerProvider>
              <AppRouter />
            </PlayerProvider>
          </LibraryProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  )
}

export default App;