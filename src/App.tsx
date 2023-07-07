import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import VoyagesPage from "./pages/VoyagesPage";
import { ThemeProvider } from "@mui/material/styles";
import { updateThemeBackground } from "./styleMUI/theme";
import { RootState } from "./redux/store";
import HomePage from "./pages/Home";
import PastHomePage from "./pages/PastPage";
import EnslavedHomePage from "./pages/Enslaved";
import EnslaversHomePage from "./pages/Enslavers";

const App: React.FC = () => {
  const queryClient = new QueryClient();
  const { styleName } = useSelector(
    (state: RootState) => state.getDataSetCollection
  );
  const updatedTheme = updateThemeBackground(styleName);

  return (
    <ThemeProvider theme={updatedTheme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/voyages" element={<VoyagesPage />} />
            <Route path={`/voyages/${styleName}`} element={<VoyagesPage />} />
            <Route path="/past" element={<PastHomePage />} />
            <Route path="/past/enslaved" element={<EnslavedHomePage />} />
            <Route path="/past/enslaver" element={<EnslaversHomePage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
