import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { AppProvider } from './shared/context/AppContext';
import { PlayerProvider } from './shared/context/PlayerContext';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <PlayerProvider>
            <AppRouter />
          </PlayerProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  )
}

export default App;