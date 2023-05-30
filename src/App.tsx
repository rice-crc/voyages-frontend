import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import store from "./redux/store";
import HOME from "./components/Home";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styleMUI/theme";

const App: React.FC = () => {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <HOME />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};
export default App;
