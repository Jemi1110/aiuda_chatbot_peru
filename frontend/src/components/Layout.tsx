import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import ChatSidebar from "./ChatSidebar";
import { SidebarProvider } from "./ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if we're on an auth page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  // Only show ChatSidebar in profile page with chat-related sections
  const showChatSidebar = user && 
    location.pathname.includes('/profile') && 
    (location.hash === '#chat' || location.search.includes('chat='));
  
  if (isAuthPage) {
    return (
      <div className="min-h-screen w-screen">
        {children}
      </div>
    );
  }
  
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background w-full">
        <Navbar />
        <div className="flex h-[calc(100vh-4rem)] w-full">
          {showChatSidebar && (
            <div className="hidden md:block w-80 border-r bg-muted/10 overflow-y-auto">
              <div className="h-full">
                <ChatSidebar />
              </div>
            </div>
          )}
          <main className="flex-1 overflow-y-auto w-full">
            <div className="h-full w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
