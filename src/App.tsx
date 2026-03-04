// App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PublicApp from './components/PublicApp';
import AdminApp from './components/AdminApp';

function App() {
  // Détection du sous-domaine ou du chemin pour routage Admin/Public
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const isAdmin = hostname.startsWith('admin.') || pathname.startsWith('/admin');

  // Sélection de l'application appropriée
  const CurrentApp = isAdmin ? AdminApp : PublicApp;

  return (
    <BrowserRouter>
      <CurrentApp />
    </BrowserRouter>
  );
}

export default App;
