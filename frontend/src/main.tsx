import React from 'react';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
=======
=======
>>>>>>> Stashed changes
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { router } from './routes';
import './globals.css';
import './styles/animations.css';
<<<<<<< Updated upstream
>>>>>>> Stashed changes

const queryClient = new QueryClient();

<<<<<<< Updated upstream
const root = createRoot(rootElement);
root.render(<App />);
=======
=======

const queryClient = new QueryClient();

>>>>>>> Stashed changes
// Create a wrapper component that includes all providers
const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toaster position="top-center" richColors />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
