import React from 'react';
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from 'react-redux';
import store from './redux/store';
import HOME from './components/Home';

const App: React.FC = () => {

  const queryClient = new QueryClient()

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <HOME/>
      </QueryClientProvider>
    </Provider>
  )
}
export default App;
