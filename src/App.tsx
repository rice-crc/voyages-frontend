import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import VoyagesPage from "./pages/VoyagesPage";
import { ThemeProvider } from "@mui/material/styles";
import { updateThemeBackground } from "./styleMUI/theme";
import { RootState } from "./redux/store";
import HomePage from "./pages/Home";
import PastHomePage from "./pages/PastPage";

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
            <Route path="/past" element={<PastHomePage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
