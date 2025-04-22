import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'regenerator-runtime/runtime'; // Required for react-speech-recognition

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);