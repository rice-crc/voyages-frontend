import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import VoyagesPage from "./pages/VoyagesPage";
import { ThemeProvider } from "@mui/material/styles";
import {
  updateThemeBackground,
  updateThemeEnslaveBackground,
} from "./styleMUI/theme";
import { RootState } from "./redux/store";
import HomePage from "./pages/Home";
import PastHomePage from "./pages/PastPage";
import EnslavedHomePage from "./pages/Enslaved";
import EnslaversHomePage from "./pages/Enslavers";

const App: React.FC = () => {
  const queryClient = new QueryClient();
  const voyagesStyle = useSelector(
    (state: RootState) => state.getDataSetCollection.styleName
  );
  const enslavedStyle = useSelector(
    (state: RootState) => state.getPeopleDataSetCollection.styleName
  );

  const getUpdatedTheme = () => {
    if (voyagesStyle) {
      return updateThemeBackground(voyagesStyle);
    } else if (enslavedStyle) {
      return updateThemeEnslaveBackground(enslavedStyle);
    } else {
      return updateThemeBackground(voyagesStyle);
    }
  };

  const updatedTheme = getUpdatedTheme();

  return (
    <ThemeProvider theme={updatedTheme}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/voyages" element={<VoyagesPage />} />
          <Route path={`/voyages/${voyagesStyle}`} element={<VoyagesPage />} />
          <Route path="/past" element={<PastHomePage />} />
          <Route path="/past/enslaved" element={<EnslavedHomePage />} />
          <Route
            path={`/past/enslaved/${enslavedStyle}`}
            element={<EnslavedHomePage />}
          />
          <Route path="/past/enslaver" element={<EnslaversHomePage />} />
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
