import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import VoyagesPage from '@/pages/VoyagesPage';
import HomePage from '@/pages/HomePage';
import PastHomePage from '@/pages/PastHomePage';
import EnslavedHomePage from '@/pages/EnslavedPage';
import EnslaversHomePage from '@/pages/EnslaversPage';
import { theme } from '@/styleMUI/theme';
import { useDispatch, useSelector } from 'react-redux';
import {
  ABOUTPAGE,
  AFRICANORIGINSPAGE,
  ALLENSLAVEDPAGE,
  ALLVOYAGES,
  ALLVOYAGESPAGE,
  ASSESSMENT,
  BLOGPAGE,
  CONTRIBUTE,
  DOCUMENTPAGE,
  DOWNLOADS,
  ENSALVEDPAGE,
  ENSALVERSPAGE,
  ENSALVERSTYLE,
  ENSLAVEDTEXASPAGE,
  ESTIMATES,
  INTRAAMERICANENSLAVERS,
  INTRAAMERICANPAGE,
  INTRODUCTORYMAPS,
  LESSONPLANS,
  PASTHOMEPAGE,
  TIMELAPSEPAGE,
  TRANSATLANTICENSLAVERS,
  TRANSATLANTICPAGE,
  USESAVESEARCHURL,
  VOYAGESTEXASPAGE,
  allEnslavers,
} from '@/share/CONST_DATA';
import BlogPage from '@/pages/BlogPage';

import AuthorPage from '@/pages/AuthorPage';
import InstitutionAuthorsPage from '@/pages/InstitutionAuthorsPage';
import BlogDetailsPost from '@/components/BlogPageComponents/Blogcomponents/BlogDetailsPost';
import Estimates from '@/components/PresentationComponents/Assessment/Estimates/Estimates';
import Contribute from '@/components/PresentationComponents/Assessment/Contribute/Contribute';
import TimeLapse from '@/components/PresentationComponents/TimeLapse/TimeLapse';
import LessonPlans from '@/components/PresentationComponents/Assessment/LessonPlans/LessonPlans';
import IntroductoryMaps from '@/components/PresentationComponents/Assessment/IntroductoryMaps/IntroductoryMaps';
import { setCardRowID, setNodeClass, setValueVariable } from '@/redux/getCardFlatObjectSlice';
import { RootState } from '@/redux/store';
import TabsSelect from '@/components/SelectorComponents/Tabs/TabsSelect';
import { usePageRouter } from '@/hooks/usePageRouter';
import DocumentPageHold from '@/pages/DocumentPageHold';
import AboutPage from '@/pages/AboutPage';
import DownloadPage from '@/pages/DownloadPage';
import UseSaveSearchURL from './components/FilterComponents/SaveSearchComponent/SaveSearchURLReturn';
import { setSaveSearchUrlID } from './redux/getSaveSearchSlice';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity
    }
  }
});

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { cardRowID, nodeTypeClass } = useSelector((state: RootState) => state.getCardFlatObjectData);
  const { styleName, voyageURLID } = usePageRouter();
  const [ID, setID] = useState(cardRowID)
  const [nodeClass, setNodeTypeClass] = useState(nodeTypeClass)


  useEffect(() => {
    const url = window.location.pathname;
    const parts = url.split('/');

    const entityType = parts[1];
    const voyageID = parts[2];
    const typeOfData = parts[3]

    if (voyageID && entityType) {
      setID(Number(voyageID))
      setNodeTypeClass(entityType)
      dispatch(setCardRowID(Number(voyageID)))
      dispatch(setNodeClass(entityType))
      dispatch(setValueVariable(typeOfData))
    }
  }, [dispatch, ID, nodeClass, styleName, voyageURLID]);


  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path={`${nodeClass}/${ID}`} element={<TabsSelect />} />
          <Route path={`${nodeClass}/${ID}/${styleName}`} element={<TabsSelect />} />
          <Route
            path={`${USESAVESEARCHURL}`}
            element={<UseSaveSearchURL />}
          />
          <Route
            path={`${TRANSATLANTICPAGE}`}
            element={<VoyagesPage />}
          />

          <Route
            path={`${INTRAAMERICANPAGE}`}
            element={<VoyagesPage />}
          />
          <Route
            path={`${ALLVOYAGESPAGE}`}
            element={<VoyagesPage />}
          />
          <Route
            path={`${VOYAGESTEXASPAGE}`}
            element={<VoyagesPage />}
          />
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
          {/* <Route path={`${DOCUMENTPAGE}`} element={<DocumentPage />} /> */}
          <Route path={`${DOCUMENTPAGE}`} element={<DocumentPageHold />} />
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
          <Route
            path={`${ASSESSMENT}/${ESTIMATES}/`}
            element={<Estimates />}
          />
          <Route
            path={`${CONTRIBUTE}`}
            element={<Contribute />}
          />
          <Route
            path={`${LESSONPLANS}/`}
            element={<LessonPlans />}
          />
          <Route
            path={`${INTRODUCTORYMAPS}/`}
            element={<IntroductoryMaps />}
          />
          <Route
            path={`${TIMELAPSEPAGE}`}
            element={<TimeLapse />} />
          <Route
            path={`${ABOUTPAGE}`}
            element={<AboutPage />}
          />
          <Route
            path={`${DOWNLOADS}`}
            element={<DownloadPage />}
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
