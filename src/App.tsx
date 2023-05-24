import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import LayoutBase from './base/LayoutBase';
import { useIsAuthenticated } from 'react-auth-kit';
import Login from './pages/users/Login';

// Create a client
const queryClient = new QueryClient()

const App: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const auth = isAuthenticated

  return (
    <QueryClientProvider client={queryClient}>
     
      { auth() ? <LayoutBase /> : <Login /> }
     
    </QueryClientProvider>
  );
};

export default App;