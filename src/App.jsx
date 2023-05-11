import TableRangeSlider from './components/TableRangeSlider'
import {QueryClient, QueryClientProvider} from "react-query";

// import VoyageContext from './context/VoyageContext'


function App() {

const queryClient = new QueryClient()

  return (
    // <VoyageContext.Provider value={voyage}>
        <QueryClientProvider client={queryClient}>
        <TableRangeSlider/>
        </QueryClientProvider>
    // {/* </VoyageContext.Provider> */}
  )
}

export default App
