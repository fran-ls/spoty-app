import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { PlayerProvider } from './shared/context/PlayerContext';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PlayerProvider>
          <AppRouter />
        </PlayerProvider>
      </AuthProvider>
    </Router>
  )
}

export default App;