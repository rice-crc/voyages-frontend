import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';

import VoyagesPage from './pages/VoyagesPage';
import { RootState } from './redux/store';
import HomePage from './pages/Home';
import PastHomePage from './pages/PastPage';
import EnslavedHomePage from './pages/Enslaved';
import EnslaversHomePage from './pages/Enslavers';

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/VoyagesPage" element={<VoyagesPage />} />
        <Route path="/PastHomePage" element={<PastHomePage />} />
        <Route path="/PastHomePage/enslaved" element={<EnslavedHomePage />} />
        <Route path="/PastHomePage/enslaver" element={<EnslaversHomePage />} />
      </Routes>
    </QueryClientProvider>
  );
};

const AppWithRouter: React.FC = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWithRouter;
