import { useEffect } from 'react';
import { useUIStore } from '@stores/uiStore';
import { useUserStore } from '@stores/userStore';
import CodeRain from '@components/CodeRain/CodeRain';
import Board from './features/board/Board';

function App() {
  const { setIsMobile } = useUIStore();
  const { theme, codeRainIntensity, updateLastActive } = useUserStore();

  // Handle mobile detection
  useEffect(() => {
    const handleMobileChange = (e: any) => {
      setIsMobile(e.detail);
    };

    const checkMobile = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('mobile-change', handleMobileChange);
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('mobile-change', handleMobileChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, [setIsMobile]);

  // Update last active time
  useEffect(() => {
    updateLastActive();

    const interval = setInterval(() => {
      updateLastActive();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [updateLastActive]);

  // Apply theme
  useEffect(() => {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <div className="app">
      {/* Background elements */}
      <div className="app-background">
        {codeRainIntensity !== 'off' && <CodeRain intensity={codeRainIntensity} />}
      </div>

      {/* Main content */}
      <main className="app-content">
        <Board />
      </main>
    </div>
  );
}

export default App;
