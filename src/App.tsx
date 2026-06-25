import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './features/auth/context/AuthContext';
import { PlayerProvider } from './shared/context/PlayerContext';
import { AppRouter } from './routes/AppRouter';
import { PlayerContextMock } from './features/home/context/MockPlayer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PlayerProvider>
        <PlayerContextMock>
          <AppRouter />
        </PlayerContextMock>
        </PlayerProvider>
      </AuthProvider>
    </Router>
  )
}

export default App;