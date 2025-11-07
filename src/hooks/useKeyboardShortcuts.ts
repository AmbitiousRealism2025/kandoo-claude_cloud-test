import { useHotkeys } from 'react-hotkeys-hook';
import { useUIStore } from '@stores/uiStore';
import { useUserStore } from '@stores/userStore';

export const useKeyboardShortcuts = () => {
  const {
    toggleCommandPalette,
    openCardComposer,
    toggleShortcutsHelp,
    commandPaletteOpen,
  } = useUIStore();

  const { keyboardShortcutsEnabled } = useUserStore();

  // Only enable shortcuts if user has them enabled
  const isEnabled = keyboardShortcutsEnabled && !commandPaletteOpen;

  // Command Palette - Ctrl+K or Cmd+K
  useHotkeys(
    'ctrl+k, cmd+k',
    (e) => {
      e.preventDefault();
      toggleCommandPalette();
    },
    { enabled: keyboardShortcutsEnabled }
  );

  // New Card - N
  useHotkeys(
    'n',
    (e) => {
      e.preventDefault();
      openCardComposer();
    },
    { enabled: isEnabled }
  );

  // Shortcuts Help - ?
  useHotkeys(
    'shift+slash',
    (e) => {
      e.preventDefault();
      toggleShortcutsHelp();
    },
    { enabled: keyboardShortcutsEnabled }
  );

  // Escape - Close modals
  useHotkeys(
    'esc',
    () => {
      // Handled by individual modals
    },
    { enabled: keyboardShortcutsEnabled }
  );
};

// Keyboard shortcut definitions for help modal
export const keyboardShortcuts = [
  {
    category: 'Navigation',
    shortcuts: [
      { keys: ['Ctrl', 'K'], description: 'Open command palette' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['Esc'], description: 'Close modal/dialog' },
    ],
  },
  {
    category: 'Actions',
    shortcuts: [
      { keys: ['N'], description: 'Create new card' },
      { keys: ['E'], description: 'Edit selected card' },
      { keys: ['D'], description: 'Delete selected card' },
    ],
  },
  {
    category: 'View',
    shortcuts: [
      { keys: ['B'], description: 'Board view' },
      { keys: ['L'], description: 'List view' },
      { keys: ['A'], description: 'Analytics view' },
    ],
  },
  {
    category: 'Appearance',
    shortcuts: [
      { keys: ['T'], description: 'Toggle theme' },
      { keys: ['R'], description: 'Toggle code rain' },
    ],
  },
  {
    category: 'Selection',
    shortcuts: [
      { keys: ['Ctrl', 'A'], description: 'Select all cards' },
      { keys: ['Ctrl', 'D'], description: 'Clear selection' },
    ],
  },
];
