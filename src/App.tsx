import { BrowserRouter as Router } from 'react-router-dom';
import { PlayerProvider } from './shared/context/PlayerContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <PlayerProvider>
        <AppRoutes />
      </PlayerProvider>
    </Router>
  )
}

export default App;