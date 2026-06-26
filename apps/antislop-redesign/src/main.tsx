import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

declare global {
  interface Window {
    google?: any;
    __VITE_GAPI_CLIENT_ID__?: string;
    __GDRIVE_ACCESS_TOKEN__?: string;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
