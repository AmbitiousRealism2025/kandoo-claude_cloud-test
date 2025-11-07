import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@styles/global.css';

// Detect mobile
const isMobile = window.matchMedia('(max-width: 768px)').matches;

// Render app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Update mobile state on resize
if (typeof window !== 'undefined') {
  const updateMobileState = () => {
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    // This will be handled by useUIStore in the App component
    window.dispatchEvent(new CustomEvent('mobile-change', { detail: mobile }));
  };

  window.addEventListener('resize', updateMobileState);
}

// Prevent zoom on mobile double tap
if (typeof window !== 'undefined' && isMobile) {
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );
}
