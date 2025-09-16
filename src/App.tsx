import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import UserProvider from './contexts/UserContext';

import Login from './pages/users/Login';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './pages/users/ProtectedRoute';
import LayoutBase from './base/LayoutBase';

// interface IUserData {
//   name: string;
//   uuid: string;
//  };

 
const App: React.FC = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        //other query settings
        refetchOnWindowFocus: false,
      },
    },
  });
 
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router>
            <Routes>
              <Route path={"/login"} element={<Login />} />
              {
                  <Route element={<ProtectedRoute />}>
                    <Route path="/*" element={<LayoutBase />} />
                  </Route>
              }
            </Routes>
        </Router>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;