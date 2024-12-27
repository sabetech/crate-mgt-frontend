import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import LayoutBase from './base/LayoutBase';
import { useIsAuthenticated } from 'react-auth-kit';
import Login from './pages/users/Login';
import { ConfigProvider } from 'antd';

// Create a client
const queryClient = new QueryClient()

const App: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const auth = isAuthenticated

  return (
    <ConfigProvider
    theme={{
      token: {
        // Seed Token
        colorPrimary: '#B18848',
        borderRadius: 2,

        // Alias Token
        // colorBgContainer: '#f6ffed',
      },
    }}
  >
    <QueryClientProvider client={queryClient}>
     
      { auth() ? <LayoutBase /> : <Login /> }
     
    </QueryClientProvider>
    </ConfigProvider>
  );
};

export default App;