import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <App />
          <ToastContainer
            position='top-center'
            autoClose={1500}
            pauseOnFocusLoss={false}
          />
          <ReactQueryDevtools />
        </CookiesProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
