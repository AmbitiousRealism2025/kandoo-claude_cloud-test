import { useEffect, lazy, Suspense } from 'react';
import { useUIStore } from '@stores/uiStore';
import { useUserStore } from '@stores/userStore';
import CodeRain from '@components/CodeRain/CodeRain';
import PWAInstallPrompt from '@components/PWAInstallPrompt/PWAInstallPrompt';
import Board from './features/board/Board';
import { seedBoardWithSampleData, shouldSeedBoard } from '@utils/seedData';
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';

// Lazy load modal components for better performance
const CardComposer = lazy(() => import('@components/CardComposer/CardComposer'));
const CardDetail = lazy(() => import('@components/CardDetail/CardDetail'));
const CommandPalette = lazy(() => import('@components/CommandPalette/CommandPalette'));
const ShortcutsHelp = lazy(() => import('@components/ShortcutsHelp/ShortcutsHelp'));

function App() {
  const { setIsMobile } = useUIStore();
  const { theme, codeRainIntensity, updateLastActive } = useUserStore();

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // Seed board with sample data on first load
  useEffect(() => {
    if (shouldSeedBoard()) {
      seedBoardWithSampleData();
    }
  }, []);

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

      {/* Modals - lazy loaded for performance */}
      <Suspense fallback={null}>
        <CardComposer />
        <CardDetail />
        <CommandPalette />
        <ShortcutsHelp />
      </Suspense>

      {/* PWA install prompt */}
      <PWAInstallPrompt />
    </div>
  );
}

export default App;
