import TableRangeSlider from './components/TableRangeSlider'
import React from 'react';
import NavBar from './components/NavBar'
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from 'react-redux';
import store from './redux/store';

const App: React.FC = () => {

  const queryClient = new QueryClient()

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NavBar/>
        {/* <TableRangeSlider /> */}
      </QueryClientProvider>
    </Provider>
  )
}
export default App;
