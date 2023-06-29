import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider, useSelector } from "react-redux";

import HOME from "./components/Home";
import { ThemeProvider } from "@mui/material/styles";
import { updateThemeBackground } from "./styleMUI/theme";
import Table from "./components/voyagePage/Results/Table";
import { RootState } from "./redux/store";

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
            <Route path="/" element={<HOME />} />
            <Route path="/table" element={<Table />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
