import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TacticsPage from './pages/TacticsPage';
import ThanksPage from './pages/ThanksPage';
import Workspace from './Workspace';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/tactics" element={<TacticsPage />} />
      <Route path="/thanks" element={<ThanksPage />} />
      <Route path="/app/*" element={<Workspace />} />
    </Routes>
  );
}
