import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CustomProvider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CustomProvider theme="light">
        <App />
      </CustomProvider>
    </QueryClientProvider>
  </StrictMode>
);
