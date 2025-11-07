import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { UserPreferences, FlowMetrics, StageId } from '../types/index';

interface UserStore {
  // Preferences
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;

  // Flow metrics
  metrics: FlowMetrics;
  updateMetrics: (updates: Partial<FlowMetrics>) => void;
  incrementCardsCompleted: () => void;
  updateTimeInFlow: (milliseconds: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;

  // Theme
  theme: 'dark' | 'light' | 'auto';
  setTheme: (theme: 'dark' | 'light' | 'auto') => void;

  // Code rain intensity
  codeRainIntensity: 'off' | 'low' | 'medium' | 'high';
  setCodeRainIntensity: (intensity: 'off' | 'low' | 'medium' | 'high') => void;

  // Keyboard shortcuts
  keyboardShortcutsEnabled: boolean;
  toggleKeyboardShortcuts: () => void;

  // Vim mode
  vimModeEnabled: boolean;
  toggleVimMode: () => void;

  // Sound effects
  soundEffectsEnabled: boolean;
  toggleSoundEffects: () => void;

  // Haptic feedback
  hapticFeedbackEnabled: boolean;
  toggleHapticFeedback: () => void;

  // Auto-save
  autoSaveEnabled: boolean;
  autoSaveInterval: number;
  toggleAutoSave: () => void;
  setAutoSaveInterval: (interval: number) => void;

  // Last active session
  lastActive: Date | null;
  updateLastActive: () => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;

  // Reset
  reset: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'dark',
  codeRainIntensity: 'medium',
  keyboardShortcuts: true,
  vimMode: false,
  soundEffects: false,
  hapticFeedback: true,
  autoSave: true,
  autoSaveInterval: 30000, // 30 seconds
  defaultView: 'board',
  wipLimits: {
    vibes: 0,
    mapping: 0,
    flow: 5,
    proving: 3,
    shipped: 0,
  } as Record<StageId, number>,
  notifications: {
    cardMoved: true,
    cardAssigned: true,
    cardDue: true,
    mentioned: true,
    flowStateReminders: true,
    dailySummary: false,
  },
};

const defaultMetrics: FlowMetrics = {
  cardsCompleted: 0,
  timeInFlow: 0,
  velocityTrend: 'stable',
  productivityScore: 0,
  peakHours: [],
  currentStreak: 0,
  longestStreak: 0,
};

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, _get) => ({
        // Initial state
        preferences: defaultPreferences,
        metrics: defaultMetrics,
        theme: 'dark',
        codeRainIntensity: 'medium',
        keyboardShortcutsEnabled: true,
        vimModeEnabled: false,
        soundEffectsEnabled: false,
        hapticFeedbackEnabled: true,
        autoSaveEnabled: true,
        autoSaveInterval: 30000,
        lastActive: null,
        hasCompletedOnboarding: false,

        // Preferences
        updatePreferences: (updates) => {
          set((state) => ({
            preferences: { ...state.preferences, ...updates },
          }));
        },

        resetPreferences: () => {
          set({ preferences: defaultPreferences });
        },

        // Metrics
        updateMetrics: (updates) => {
          set((state) => ({
            metrics: { ...state.metrics, ...updates },
          }));
        },

        incrementCardsCompleted: () => {
          set((state) => ({
            metrics: {
              ...state.metrics,
              cardsCompleted: state.metrics.cardsCompleted + 1,
            },
          }));
        },

        updateTimeInFlow: (milliseconds) => {
          set((state) => ({
            metrics: {
              ...state.metrics,
              timeInFlow: state.metrics.timeInFlow + milliseconds,
            },
          }));
        },

        incrementStreak: () => {
          set((state) => {
            const newStreak = state.metrics.currentStreak + 1;
            const longestStreak = Math.max(newStreak, state.metrics.longestStreak);

            return {
              metrics: {
                ...state.metrics,
                currentStreak: newStreak,
                longestStreak,
              },
            };
          });
        },

        resetStreak: () => {
          set((state) => ({
            metrics: {
              ...state.metrics,
              currentStreak: 0,
            },
          }));
        },

        // Theme
        setTheme: (theme) => {
          set((state) => ({
            theme,
            preferences: { ...state.preferences, theme },
          }));

          // Apply theme to document
          if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
          } else {
            document.documentElement.setAttribute('data-theme', theme);
          }
        },

        // Code rain
        setCodeRainIntensity: (intensity) => {
          set((state) => ({
            codeRainIntensity: intensity,
            preferences: { ...state.preferences, codeRainIntensity: intensity },
          }));
        },

        // Keyboard shortcuts
        toggleKeyboardShortcuts: () => {
          set((state) => {
            const enabled = !state.keyboardShortcutsEnabled;
            return {
              keyboardShortcutsEnabled: enabled,
              preferences: { ...state.preferences, keyboardShortcuts: enabled },
            };
          });
        },

        // Vim mode
        toggleVimMode: () => {
          set((state) => {
            const enabled = !state.vimModeEnabled;
            return {
              vimModeEnabled: enabled,
              preferences: { ...state.preferences, vimMode: enabled },
            };
          });
        },

        // Sound effects
        toggleSoundEffects: () => {
          set((state) => {
            const enabled = !state.soundEffectsEnabled;
            return {
              soundEffectsEnabled: enabled,
              preferences: { ...state.preferences, soundEffects: enabled },
            };
          });
        },

        // Haptic feedback
        toggleHapticFeedback: () => {
          set((state) => {
            const enabled = !state.hapticFeedbackEnabled;
            return {
              hapticFeedbackEnabled: enabled,
              preferences: { ...state.preferences, hapticFeedback: enabled },
            };
          });
        },

        // Auto-save
        toggleAutoSave: () => {
          set((state) => {
            const enabled = !state.autoSaveEnabled;
            return {
              autoSaveEnabled: enabled,
              preferences: { ...state.preferences, autoSave: enabled },
            };
          });
        },

        setAutoSaveInterval: (interval) => {
          set((state) => ({
            autoSaveInterval: interval,
            preferences: { ...state.preferences, autoSaveInterval: interval },
          }));
        },

        // Last active
        updateLastActive: () => {
          set({ lastActive: new Date() });
        },

        // Onboarding
        completeOnboarding: () => {
          set({ hasCompletedOnboarding: true });
        },

        // Reset
        reset: () => {
          set({
            preferences: defaultPreferences,
            metrics: defaultMetrics,
            theme: 'dark',
            codeRainIntensity: 'medium',
            keyboardShortcutsEnabled: true,
            vimModeEnabled: false,
            soundEffectsEnabled: false,
            hapticFeedbackEnabled: true,
            autoSaveEnabled: true,
            autoSaveInterval: 30000,
            lastActive: null,
            hasCompletedOnboarding: false,
          });
        },
      }),
      {
        name: 'kandoo-user-storage',
      }
    ),
    { name: 'UserStore' }
  )
);

// Initialize theme on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('kandoo-user-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const theme = parsed.state?.theme || 'dark';

      if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
}
