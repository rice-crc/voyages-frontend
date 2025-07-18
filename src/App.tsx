import React, { useEffect, useState } from 'react';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { StyledEngineProvider } from '@mui/material/styles';
import { StylesProvider } from '@mui/styles';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import BlogDetailsPost from '@/components/BlogPageComponents/Blogcomponents/BlogDetailsPost';
import Estimates from '@/components/PresentationComponents/Assessment/Estimates/Estimates';
import IntroductoryMaps from '@/components/PresentationComponents/Assessment/IntroductoryMaps/IntroductoryMaps';
import LessonPlans from '@/components/PresentationComponents/Assessment/LessonPlans/LessonPlans';
import TabsSelect from '@/components/SelectorComponents/Tabs/TabsSelect';
import { usePageRouter } from '@/hooks/usePageRouter';
import AboutPage from '@/pages/AboutPage';
import AuthorPage from '@/pages/AuthorPage';
import BlogPage from '@/pages/BlogPage';
import ContributePage from '@/pages/Contribute';
import DocumentPage from '@/pages/DocumentPage';
import DownloadPage from '@/pages/DownloadPage';
import EnslavedHomePage from '@/pages/EnslavedPage';
import EnslaversHomePage from '@/pages/EnslaversPage';
import HomePage from '@/pages/HomePage';
import InstitutionAuthorsPage from '@/pages/InstitutionAuthorsPage';
import PageNotFound404 from '@/pages/PageNotFound404';
import PastHomePage from '@/pages/PastHomePage';
import VoyagesPage from '@/pages/VoyagesPage';
import {
  setCardRowID,
  setNodeClass,
  setValueVariable,
} from '@/redux/getCardFlatObjectSlice';
import { RootState } from '@/redux/store';
import {
  ABOUTPAGE,
  ACCOUNTS,
  AFRICANORIGINSPAGE,
  ALLENSLAVEDPAGE,
  ALLVOYAGESPAGE,
  ASSESSMENT,
  BLOGPAGE,
  CONTRIBUTE,
  DOCUMENTPAGE,
  DOWNLOADS,
  ENSALVEDPAGE,
  ENSALVERSPAGE,
  ENSLAVEDTEXASPAGE,
  ESTIMATES,
  INTRAAMERICANENSLAVERS,
  INTRAAMERICANPAGE,
  INTRODUCTORYMAPS,
  LESSONPLANS,
  PASTHOMEPAGE,
  TRANSATLANTICENSLAVERS,
  TRANSATLANTICPAGE,
  allEnslavers,
} from '@/share/CONST_DATA';
import { theme } from '@/styleMUI/theme';

import UseSaveSearchURL from './components/FilterComponents/SaveSearchComponent/SaveSearchURLReturn';
import { DocumentViewerProvider } from './pages/DocumentViewerContext';
import { checkEntityType } from './utils/functions/checkEntityType';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

const App: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { cardRowID, nodeTypeClass, variable } = useSelector(
    (state: RootState) => state.getCardFlatObjectData,
  );
  const { styleName, voyageURLID, blogURL } = usePageRouter();

  const [saveSearchURL, setSaveSearchURL] = useState('');
  const [ID, setID] = useState(cardRowID);
  const [nodeClass, setNodeTypeClass] = useState(nodeTypeClass);

  useEffect(() => {
    if (location.pathname === '/') {
      localStorage.clear();
    }
  }, [location.pathname]);

  useEffect(() => {
    const url = window.location.pathname;
    const parts = url.split('/');
    const entityType = parts[1];
    const voyageID = parts[2];
    const typeOfData = parts[3];

    if (checkEntityType(entityType)) {
      setSaveSearchURL(url);
    }

    if (voyageID && entityType) {
      setID(Number(voyageID));
      setNodeTypeClass(entityType);
      dispatch(setCardRowID(Number(voyageID)));
      dispatch(setNodeClass(entityType));
      dispatch(setValueVariable(typeOfData));
    }
  }, [
    dispatch,
    ID,
    nodeClass,
    styleName,
    voyageURLID,
    saveSearchURL,
    blogURL,
    variable,
  ]);

  return (
    <Routes>
      {nodeClass && ID && (
        <Route path={`${nodeClass}/${ID}`} element={<TabsSelect />} />
      )}
      <Route path="/" element={<HomePage />} />
      {saveSearchURL && nodeClass && (
        <Route path={`${saveSearchURL}`} element={<UseSaveSearchURL />} />
      )}
      <Route path={`${TRANSATLANTICPAGE}`} element={<VoyagesPage />} />
      <Route path={`${INTRAAMERICANPAGE}`} element={<VoyagesPage />} />
      <Route path={`${ALLVOYAGESPAGE}`} element={<VoyagesPage />} />
      <Route path={`${PASTHOMEPAGE}`} element={<PastHomePage />} />
      <Route
        path={`${ENSALVEDPAGE}${ALLENSLAVEDPAGE}`}
        element={<EnslavedHomePage />}
      />
      <Route
        path={`${ENSALVEDPAGE}${AFRICANORIGINSPAGE}`}
        element={<EnslavedHomePage />}
      />
      <Route
        path={`${ENSALVEDPAGE}${ENSLAVEDTEXASPAGE}`}
        element={<EnslavedHomePage />}
      />
      <Route
        path={`${ENSALVERSPAGE}${INTRAAMERICANENSLAVERS}`}
        element={<EnslaversHomePage />}
      />
      <Route
        path={`${ENSALVERSPAGE}${TRANSATLANTICENSLAVERS}`}
        element={<EnslaversHomePage />}
      />
      <Route
        path={`${ENSALVERSPAGE}/${allEnslavers}`}
        element={<EnslaversHomePage />}
      />
      <Route path={`${ASSESSMENT}/${ESTIMATES}/`} element={<Estimates />} />
      <Route path={`${DOCUMENTPAGE}`} element={<DocumentPage />} />
      <Route path={`${BLOGPAGE}/`} element={<BlogPage />} />
      <Route path={`${BLOGPAGE}/tag/${blogURL}`} element={<BlogPage />} />
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
      <Route path={`${CONTRIBUTE}`} element={<ContributePage />} />
      <Route path={`${CONTRIBUTE}guidelines`} element={<ContributePage />} />
      <Route path={`${ACCOUNTS}signin`} element={<ContributePage />} />
      <Route path={`${ACCOUNTS}signup`} element={<ContributePage />} />
      <Route path={`${ACCOUNTS}password/reset`} element={<ContributePage />} />
      <Route path={`${ACCOUNTS}logout`} element={<ContributePage />} />
      <Route path={`${ACCOUNTS}password_change`} element={<ContributePage />} />
      <Route path={`${CONTRIBUTE}legal`} element={<ContributePage />} />
      <Route path={`${CONTRIBUTE}interim/new/`} element={<ContributePage />} />
      <Route path={`${CONTRIBUTE}edit_voyage`} element={<ContributePage />} />
      <Route path={`${CONTRIBUTE}merge_voyages`} element={<ContributePage />} />
      <Route path={`${CONTRIBUTE}delete_voyage`} element={<ContributePage />} />
      <Route path={`${LESSONPLANS}/`} element={<LessonPlans />} />
      <Route path={`${INTRODUCTORYMAPS}/`} element={<IntroductoryMaps />} />
      <Route path={`${ABOUTPAGE}`} element={<AboutPage />} />
      <Route path={`${DOWNLOADS}`} element={<DownloadPage />} />
      <Route path="/404" element={<PageNotFound404 />} />
      <Route path="*" element={<PageNotFound404 />} />
    </Routes>
  );
};

const AppWithRouter: React.FC = () => (
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <StyledEngineProvider injectFirst>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <DocumentViewerProvider>
              <App />
            </DocumentViewerProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </StylesProvider>
    </StyledEngineProvider>
  </BrowserRouter>
);

export default AppWithRouter;
