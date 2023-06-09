import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'antd/dist/reset.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'react-auth-kit'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider authType={"cookie"} authName={"_auth"} >
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
