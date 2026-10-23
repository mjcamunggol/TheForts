import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './the_forts_riverside_private_resort';
import './style.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
