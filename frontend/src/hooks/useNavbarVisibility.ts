import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useNavbarVisibility() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide navbar on these routes
    const hiddenRoutes = [
      '/login',
      '/register',
      '/auth/login',
      '/auth/register'
    ];

    // Check if current path starts with any of the hidden routes
    const isHiddenRoute = hiddenRoutes.some(route => 
      location.pathname === route || location.pathname.startsWith(`${route}/`)
    );

    setIsVisible(!isHiddenRoute);

    // Add/remove no-scroll class to body
    if (isHiddenRoute) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [location.pathname]);

  return isVisible;
}
