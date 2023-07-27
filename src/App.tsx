import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import VoyagesPage from './pages/VoyagesPage';
import HomePage from './pages/Home';
import PastHomePage from './pages/PastHomePage';
import EnslavedHomePage from './pages/Enslaved';
import EnslaversHomePage from './pages/Enslavers';
import { theme } from './styleMUI/theme';

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/VoyagesPage" element={<VoyagesPage />} />
          <Route path="/PastHomePage" element={<PastHomePage />} />
          <Route path="/PastHomePage/enslaved" element={<EnslavedHomePage />} />
          <Route
            path="/PastHomePage/enslaver"
            element={<EnslaversHomePage />}
          />
        </Routes>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

const AppWithRouter: React.FC = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWithRouter;
