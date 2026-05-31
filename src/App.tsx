import { BrowserRouter as Router } from 'react-router-dom';
import { PlayerProvider } from './shared/context/PlayerContext';
import { PlayerProvider as PlayerProviderMe } from './shared/context/PlayerContextMe';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <PlayerProvider>
        <PlayerProviderMe>
          <AppRoutes />
        </PlayerProviderMe>
      </PlayerProvider>
    </Router>
  )
}

export default App;