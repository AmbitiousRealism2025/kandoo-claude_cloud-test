import { useEffect } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@stores/uiStore';
import { useBoardStore } from '@stores/boardStore';
import { useUserStore } from '@stores/userStore';
import './CommandPalette.css';

const CommandPalette = () => {
  const { commandPaletteOpen, closeCommandPalette, openCardComposer, openSettings, setViewMode, toggleShortcutsHelp } = useUIStore();
  const { cards, stages, selectCard, clearSelection } = useBoardStore();
  const { theme, setTheme, setCodeRainIntensity } = useUserStore();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && commandPaletteOpen) {
        closeCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, closeCommandPalette]);

  if (!commandPaletteOpen) return null;

  const cardsArray = Array.from(cards.values());
  const stagesArray = Array.from(stages.values());

  const handleSelectCard = (cardId: string) => {
    selectCard(cardId as any);
    closeCommandPalette();
  };

  const handleCreateCard = (stageId?: string) => {
    openCardComposer(stageId);
    closeCommandPalette();
  };

  const handleChangeView = (view: 'board' | 'list' | 'calendar' | 'analytics' | 'timeline') => {
    setViewMode(view);
    closeCommandPalette();
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    closeCommandPalette();
  };

  const handleChangeCodeRain = (intensity: 'off' | 'low' | 'medium' | 'high') => {
    setCodeRainIntensity(intensity);
    closeCommandPalette();
  };

  return (
    <AnimatePresence>
      <div className="command-palette-backdrop" onClick={closeCommandPalette}>
        <motion.div
          className="command-palette-container"
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Command className="command-palette" label="Command Palette">
            <Command.Input
              placeholder="Type a command or search..."
              autoFocus
              className="command-input"
            />

            <Command.List className="command-list">
              <Command.Empty className="command-empty">
                No results found.
              </Command.Empty>

              {/* Actions */}
              <Command.Group heading="Actions" className="command-group">
                <Command.Item
                  onSelect={() => handleCreateCard()}
                  className="command-item"
                >
                  <span className="command-icon">✨</span>
                  <span className="command-text">Create New Card</span>
                  <kbd className="command-kbd">N</kbd>
                </Command.Item>

                <Command.Item
                  onSelect={() => clearSelection()}
                  className="command-item"
                >
                  <span className="command-icon">🔄</span>
                  <span className="command-text">Clear Selection</span>
                </Command.Item>

                <Command.Item
                  onSelect={() => {
                    openSettings();
                    closeCommandPalette();
                  }}
                  className="command-item"
                >
                  <span className="command-icon">⚙️</span>
                  <span className="command-text">Open Settings</span>
                  <kbd className="command-kbd">⌘,</kbd>
                </Command.Item>

                <Command.Item
                  onSelect={() => {
                    toggleShortcutsHelp();
                    closeCommandPalette();
                  }}
                  className="command-item"
                >
                  <span className="command-icon">⌨️</span>
                  <span className="command-text">Keyboard Shortcuts</span>
                  <kbd className="command-kbd">?</kbd>
                </Command.Item>
              </Command.Group>

              {/* Quick Create */}
              <Command.Group heading="Quick Create" className="command-group">
                {stagesArray.map((stage) => (
                  <Command.Item
                    key={stage.id}
                    onSelect={() => handleCreateCard(stage.id)}
                    className="command-item"
                  >
                    <span className="command-icon">{stage.icon}</span>
                    <span className="command-text">New card in {stage.title}</span>
                  </Command.Item>
                ))}
              </Command.Group>

              {/* Views */}
              <Command.Group heading="Change View" className="command-group">
                <Command.Item onSelect={() => handleChangeView('board')} className="command-item">
                  <span className="command-icon">📋</span>
                  <span className="command-text">Board View</span>
                </Command.Item>

                <Command.Item onSelect={() => handleChangeView('list')} className="command-item">
                  <span className="command-icon">📝</span>
                  <span className="command-text">List View</span>
                </Command.Item>

                <Command.Item onSelect={() => handleChangeView('analytics')} className="command-item">
                  <span className="command-icon">📊</span>
                  <span className="command-text">Analytics View</span>
                </Command.Item>
              </Command.Group>

              {/* Theme */}
              <Command.Group heading="Appearance" className="command-group">
                <Command.Item onSelect={handleToggleTheme} className="command-item">
                  <span className="command-icon">{theme === 'dark' ? '🌙' : '☀️'}</span>
                  <span className="command-text">Toggle Theme</span>
                  <kbd className="command-kbd">T</kbd>
                </Command.Item>

                <Command.Item onSelect={() => handleChangeCodeRain('off')} className="command-item">
                  <span className="command-icon">🚫</span>
                  <span className="command-text">Code Rain: Off</span>
                </Command.Item>

                <Command.Item onSelect={() => handleChangeCodeRain('low')} className="command-item">
                  <span className="command-icon">🌧️</span>
                  <span className="command-text">Code Rain: Low</span>
                </Command.Item>

                <Command.Item onSelect={() => handleChangeCodeRain('medium')} className="command-item">
                  <span className="command-icon">🌦️</span>
                  <span className="command-text">Code Rain: Medium</span>
                </Command.Item>

                <Command.Item onSelect={() => handleChangeCodeRain('high')} className="command-item">
                  <span className="command-icon">⛈️</span>
                  <span className="command-text">Code Rain: High</span>
                </Command.Item>
              </Command.Group>

              {/* Recent Cards */}
              {cardsArray.length > 0 && (
                <Command.Group heading="Jump to Card" className="command-group">
                  {cardsArray.slice(0, 5).map((card) => (
                    <Command.Item
                      key={card.id}
                      onSelect={() => handleSelectCard(card.id)}
                      className="command-item"
                    >
                      <span className="command-icon">{stages.get(card.stage)?.icon || '📄'}</span>
                      <div className="command-card-info">
                        <span className="command-text">{card.title}</span>
                        <span className="command-meta">{card.stage}</span>
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </Command.List>
          </Command>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;
