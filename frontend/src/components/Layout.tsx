
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
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Only show the ChatSidebar on profile pages with chat sections */}
        {showChatSidebar && <ChatSidebar />}
        
        <div className="flex flex-col min-h-full flex-1">
        {!isAuthPage && <Navbar />}
          <main className={`flex-1 ${isAuthPage ? '' : ''}`}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
