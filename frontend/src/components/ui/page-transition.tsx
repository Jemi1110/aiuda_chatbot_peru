import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useNavbarVisibility } from '@/hooks/useNavbarVisibility';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [displayChildren, setDisplayChildren] = useState(children);
  const loadingRef = useRef<HTMLDivElement>(null);
  const isNavbarVisible = useNavbarVisibility();

  useEffect(() => {
    // Show loading overlay
    setIsLoading(true);
    
    // Hide loading after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Add fade-out class to loading overlay
      if (loadingRef.current) {
        loadingRef.current.classList.add('fade-out');
        
        // Remove loading overlay from DOM after animation completes
        const removeTimer = setTimeout(() => {
          if (loadingRef.current) {
            loadingRef.current.style.display = 'none';
          }
        }, 300);
        
        return () => clearTimeout(removeTimer);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [location.key]);

  // Update children when loading is complete
  useEffect(() => {
    if (!isLoading) {
      setDisplayChildren(children);
    }
  }, [isLoading, children]);

  return (
    <div className={`relative ${className}`}>
      {/* Loading Overlay */}
      <div 
        ref={loadingRef} 
        className="loading-overlay"
        style={!isLoading ? { display: 'none' } : {}}
      >
        <div className="loading-spinner"></div>
      </div>

      {/* Page Content */}
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.key}
          timeout={300}
          classNames="page"
          unmountOnExit
        >
          <div className="w-full" style={{ paddingTop: isNavbarVisible ? '0' : '0' }}>
            {displayChildren}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}
