import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import { AuthProvider } from '@/contexts/AuthContext';

// Importar componentes de UI necesarios
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = ({ 
  children = null, 
  variant = 'default',
  size = 'default',
  className = '',
  ...props 
}: ButtonProps) => (
  <button 
    {...props} 
    className={`px-4 py-2 bg-blue-500 text-white rounded ${className}`}
  >
    {children}
  </button>
);

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Create a loading component for suspense fallback
const SuspenseFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Button variant="ghost" size="icon" className="animate-spin">
      <svg
        className="h-6 w-6 text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span className="sr-only">Cargando...</span>
    </Button>
  </div>
);

// Create a wrapper component that includes AuthProvider
const AuthProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

export const router = createBrowserRouter([
  // Redirects for better UX
  {
    path: '/login',
    element: null,
    loader: () => {
      window.location.href = '/auth/login';
      return null;
    },
  },
  {
    path: '/register',
    element: null,
    loader: () => {
      window.location.href = '/auth/register';
      return null;
    },
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <AuthProviderWrapper>
          <MainLayout />
        </AuthProviderWrapper>
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<SuspenseFallback />}>
        <AuthProviderWrapper>
          <MainLayout>
            <NotFound />
          </MainLayout>
        </AuthProviderWrapper>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
      // Add other authenticated routes here
    ],
  },
  {
    path: '/auth',
    element: (
      <Suspense fallback={<SuspenseFallback />}>
        <AuthProviderWrapper>
          <AuthLayout>
            <Outlet />
          </AuthLayout>
        </AuthProviderWrapper>
      </Suspense>
    ),
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
    ],
  },
]);
