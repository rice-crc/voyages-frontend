import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import VoyagesPage from './pages/VoyagesPage';
import HomePage from './pages/HomePage';
import PastHomePage from './pages/PastHomePage';
import EnslavedHomePage from './pages/EnslavedPage';
import EnslaversHomePage from './pages/EnslaversPage';
import { theme } from './styleMUI/theme';
import {
  AFRICANORIGINSPAGE,
  ALLENSLAVEDPAGE,
  ALLVOYAGESPAGE,
  BLOGPAGE,
  DOCUMENTPAGE,
  ENSALVEDPAGE,
  ENSALVERSPAGE,
  ENSLAVEDTEXASPAGE,
  INTRAAMERICANPAGE,
  PASTHOMEPAGE,
  TRANSATLANTICPAGE,
  VOYAGESPAGE,
  VOYAGESTEXASPAGE,
} from './share/CONST_DATA';
import DocumentPage from './pages/DocumentPage';
import BlogPage from './pages/BlogPage';

import AuthorPage from './pages/AuthorPage';
import InstitutionAuthorsPage from './pages/InstitutionAuthorsPage';
import BlogDetailsPost from './components/BlogPageComponents/Blogcomponents/BlogDetailsPost';

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path={`${VOYAGESPAGE}`} element={<VoyagesPage />} />
          <Route
            path={`${VOYAGESPAGE}${ALLVOYAGESPAGE}`}
            element={<VoyagesPage />}
          />
          <Route
            path={`${VOYAGESPAGE}${INTRAAMERICANPAGE}`}
            element={<VoyagesPage />}
          />
          <Route
            path={`${VOYAGESPAGE}${TRANSATLANTICPAGE}`}
            element={<VoyagesPage />}
          />
          <Route
            path={`${VOYAGESPAGE}${VOYAGESTEXASPAGE}`}
            element={<VoyagesPage />}
          />
          <Route path={`${PASTHOMEPAGE}`} element={<PastHomePage />} />
          <Route
            path={`${PASTHOMEPAGE}${ENSALVEDPAGE}`}
            element={<EnslavedHomePage />}
          />
          <Route
            path={`${PASTHOMEPAGE}${ENSALVEDPAGE}${ALLENSLAVEDPAGE}`}
            element={<EnslavedHomePage />}
          />
          <Route
            path={`${PASTHOMEPAGE}${ENSALVEDPAGE}${AFRICANORIGINSPAGE}`}
            element={<EnslavedHomePage />}
          />
          <Route
            path={`${PASTHOMEPAGE}${ENSALVEDPAGE}${ENSLAVEDTEXASPAGE}`}
            element={<EnslavedHomePage />}
          />
          <Route
            path={`${PASTHOMEPAGE}${ENSALVERSPAGE}`}
            element={<EnslaversHomePage />}
          />
          <Route path={`${DOCUMENTPAGE}`} element={<DocumentPage />} />
          <Route path={`${BLOGPAGE}`} element={<BlogPage />} />
          <Route
            path={`${BLOGPAGE}/tag/:tagName/:tagID`}
            element={<BlogPage />}
          />
          <Route
            path={`${BLOGPAGE}/:blogTitle/:ID`}
            element={<BlogDetailsPost />}
          />
          <Route
            path={`${BLOGPAGE}/author/:authorName/:ID/`}
            element={<AuthorPage />}
          />
          <Route
            path={`${BLOGPAGE}/institution/:institutionName/:ID/`}
            element={<InstitutionAuthorsPage />}
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
