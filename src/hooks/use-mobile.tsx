
import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint = 768) {
  // Default to desktop to prevent layout shift on load
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Helper function to check if the window matches the mobile media query
    const checkIsMobile = () => {
      if (typeof window !== 'undefined') {
        return window.innerWidth < breakpoint;
      }
      return false;
    };

    // Set the initial value
    setIsMobile(checkIsMobile());

    // Set up the event listener
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return isMobile;
}
