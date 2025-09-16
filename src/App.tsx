import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import LayoutBase from './base/LayoutBase';

import UserProvider from './contexts/UserContext';

import Login from './pages/users/Login';
import { ConfigProvider } from 'antd';

import { useIsAuthenticated } from './hooks/auth';


// Create a client
const queryClient = new QueryClient()
interface IUserData {
  name: string;
  uuid: string;
 };

 
const App: React.FC = () => {
  const isAuthenticated = useIsAuthenticated()

 
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
      <UserProvider>
        {
          isAuthenticated ? <LayoutBase /> : <Login />
        }
        
      </UserProvider>
    </QueryClientProvider>
  </ConfigProvider>
  );
};

export default App;