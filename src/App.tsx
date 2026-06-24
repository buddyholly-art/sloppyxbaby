import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TacticsPage from './pages/TacticsPage';
import ThanksPage from './pages/ThanksPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiesPage from './pages/CookiesPage';
import Workspace from './Workspace';
import CookieBanner from './components/CookieBanner';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tactics" element={<TacticsPage />} />
        <Route path="/thanks" element={<ThanksPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/app/*" element={<Workspace />} />
      </Routes>
      <CookieBanner />
    </>
  );
}
