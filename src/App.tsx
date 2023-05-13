import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import LayoutBase from './base/LayoutBase';

// Create a client
const queryClient = new QueryClient()

const App: React.FC = () => {
  

  return (
    <QueryClientProvider client={queryClient}>
      <LayoutBase />
    </QueryClientProvider>
  );
};

export default App;