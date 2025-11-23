import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "./Navigation";
import Router from "./context/Router";



const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navigation />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
