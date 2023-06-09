import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import HOME from "./components/Home";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styleMUI/theme";
import Table from "./components/fcComponets/AGTable";

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HOME />} />
              <Route path="/table" element={<Table />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};
export default App;
