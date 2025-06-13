import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { PageTransition } from '@/components/ui/page-transition';
import { useNavbarVisibility } from '@/hooks/useNavbarVisibility';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isNavbarVisible = useNavbarVisibility();
  const isAuthPage = !isNavbarVisible;

  return (
    <div className={`flex flex-col ${isNavbarVisible ? 'min-h-screen' : 'h-screen'}`}>
      {/* Navbar is hidden on auth pages */}
      {isNavbarVisible && <Navbar />}
      
      <main className={`flex-1 ${isNavbarVisible ? 'pt-16' : 'h-full overflow-auto'}`}>
        <PageTransition className={`h-full ${isAuthPage ? 'flex items-center justify-center' : ''}`}>
          <div className={isAuthPage ? 'w-full max-w-md px-4 py-8' : 'h-full'}>
            {children || <Outlet />}
          </div>
        </PageTransition>
      </main>
      
      {/* Footer is hidden on auth pages */}
      {isNavbarVisible && <Footer />}
    </div>
  );
};

export default MainLayout;
