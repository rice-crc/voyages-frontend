import TableRangeSlider from './components/TableRangeSlider'
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {

  const queryClient = new QueryClient()

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TableRangeSlider />
      </QueryClientProvider>
    </Provider>
  )
}
export default App;
