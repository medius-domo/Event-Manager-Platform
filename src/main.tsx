import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

async function init() {
  try {
    await import('./i18n/config');

    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize app:', error);

    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Error loading application</h1>
          <p>Please check the console for more details.</p>
        </div>
      </StrictMode>
    );
  }
}

init();
