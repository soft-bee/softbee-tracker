import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/Routes';

import { AuthProvider } from './AuthProvider';
import { AppRouter } from './routes';

export const App = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
