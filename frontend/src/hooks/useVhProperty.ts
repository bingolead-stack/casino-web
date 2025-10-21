import { useEffect } from 'react';

const useVhProperty = () => {
  useEffect(() => {
    const setVhProperty = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set the value on load
    setVhProperty();

    // Update on window resize
    window.addEventListener('resize', setVhProperty);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', setVhProperty);
    };
  }, []);
};

export default useVhProperty;