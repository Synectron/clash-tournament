import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import LoginPage from './Login';

const root = createRoot(document.getElementById('root'));
const renderApp = () => {
  const path = window.location.pathname;
  if (path === '/login') {
    root.render(
      <React.StrictMode>
        <LoginPage />
      </React.StrictMode>
    );
  } else {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
};

renderApp();
