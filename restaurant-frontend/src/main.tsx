import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Obtener elemento raíz
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Ensure your index.html has an element with id="root"');
}

// Renderizar aplicación
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
