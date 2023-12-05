import { StrictMode } from 'react'
import { createRoot }  from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToastProvider } from './Provider/Providers.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CookiesProvider>
          <App />
          <ToastProvider/>
          <ReactQueryDevtools />
        </CookiesProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
