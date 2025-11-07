import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { FilterState, ViewMode, SearchQuery } from '../types/index';

interface UIStore {
  // View state
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Filter state
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;

  // Search state
  searchQuery: SearchQuery;
  setSearchQuery: (query: Partial<SearchQuery>) => void;
  clearSearch: () => void;

  // Command palette
  commandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;

  // Card composer
  cardComposerOpen: boolean;
  cardComposerStage: string | null;
  openCardComposer: (stageId?: string) => void;
  closeCardComposer: () => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Settings modal
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;

  // Card detail modal
  cardDetailOpen: boolean;
  activeCardId: string | null;
  openCardDetail: (cardId: string) => void;
  closeCardDetail: () => void;

  // Analytics panel
  analyticsOpen: boolean;
  toggleAnalytics: () => void;

  // Toast notifications
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Loading state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Mobile/responsive
  isMobile: boolean;
  setIsMobile: (mobile: boolean) => void;

  // Fullscreen
  isFullscreen: boolean;
  toggleFullscreen: () => void;

  // Focus mode
  focusModeEnabled: boolean;
  toggleFocusMode: () => void;

  // Keyboard shortcuts help
  shortcutsHelpOpen: boolean;
  toggleShortcutsHelp: () => void;

  // Reset
  reset: () => void;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const initialFilters: FilterState = {
  search: undefined,
  tags: undefined,
  assignees: undefined,
  stages: undefined,
  priorities: undefined,
  dateRange: undefined,
  showArchived: false,
  customFilters: undefined,
};

const initialSearchQuery: SearchQuery = {
  text: '',
  filters: undefined,
  sort: undefined,
  limit: 50,
  offset: 0,
};

let toastIdCounter = 0;

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        viewMode: 'board',
        filters: initialFilters,
        searchQuery: initialSearchQuery,
        commandPaletteOpen: false,
        cardComposerOpen: false,
        cardComposerStage: null,
        sidebarOpen: true,
        settingsOpen: false,
        cardDetailOpen: false,
        activeCardId: null,
        analyticsOpen: false,
        toasts: [],
        isLoading: false,
        error: null,
        isMobile: false,
        isFullscreen: false,
        focusModeEnabled: false,
        shortcutsHelpOpen: false,

        // View mode
        setViewMode: (mode) => {
          set({ viewMode: mode });
        },

        // Filters
        setFilters: (filters) => {
          set((state) => ({
            filters: { ...state.filters, ...filters },
          }));
        },

        clearFilters: () => {
          set({ filters: initialFilters });
        },

        // Search
        setSearchQuery: (query) => {
          set((state) => ({
            searchQuery: { ...state.searchQuery, ...query },
          }));
        },

        clearSearch: () => {
          set({ searchQuery: initialSearchQuery });
        },

        // Command palette
        openCommandPalette: () => {
          set({ commandPaletteOpen: true });
        },

        closeCommandPalette: () => {
          set({ commandPaletteOpen: false });
        },

        toggleCommandPalette: () => {
          set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen }));
        },

        // Card composer
        openCardComposer: (stageId) => {
          set({ cardComposerOpen: true, cardComposerStage: stageId || null });
        },

        closeCardComposer: () => {
          set({ cardComposerOpen: false, cardComposerStage: null });
        },

        // Sidebar
        toggleSidebar: () => {
          set((state) => ({ sidebarOpen: !state.sidebarOpen }));
        },

        setSidebarOpen: (open) => {
          set({ sidebarOpen: open });
        },

        // Settings
        openSettings: () => {
          set({ settingsOpen: true });
        },

        closeSettings: () => {
          set({ settingsOpen: false });
        },

        // Card detail
        openCardDetail: (cardId) => {
          set({ cardDetailOpen: true, activeCardId: cardId });
        },

        closeCardDetail: () => {
          set({ cardDetailOpen: false, activeCardId: null });
        },

        // Analytics
        toggleAnalytics: () => {
          set((state) => ({ analyticsOpen: !state.analyticsOpen }));
        },

        // Toasts
        addToast: (toast) => {
          const id = `toast-${toastIdCounter++}`;
          const newToast: Toast = { ...toast, id };

          set((state) => ({
            toasts: [...state.toasts, newToast],
          }));

          // Auto-remove toast after duration
          if (toast.duration !== 0) {
            setTimeout(() => {
              get().removeToast(id);
            }, toast.duration || 3000);
          }
        },

        removeToast: (id) => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        },

        clearToasts: () => {
          set({ toasts: [] });
        },

        // Loading
        setLoading: (loading) => {
          set({ isLoading: loading });
        },

        // Error
        setError: (error) => {
          set({ error });
          if (error) {
            get().addToast({
              type: 'error',
              message: error,
              duration: 5000,
            });
          }
        },

        clearError: () => {
          set({ error: null });
        },

        // Mobile
        setIsMobile: (mobile) => {
          set({ isMobile: mobile });
          // Auto-close sidebar on mobile
          if (mobile) {
            set({ sidebarOpen: false });
          }
        },

        // Fullscreen
        toggleFullscreen: () => {
          set((state) => {
            const newFullscreen = !state.isFullscreen;

            if (newFullscreen) {
              document.documentElement.requestFullscreen?.();
            } else {
              document.exitFullscreen?.();
            }

            return { isFullscreen: newFullscreen };
          });
        },

        // Focus mode
        toggleFocusMode: () => {
          set((state) => {
            const newFocusMode = !state.focusModeEnabled;

            // When enabling focus mode, hide UI elements
            if (newFocusMode) {
              return {
                focusModeEnabled: true,
                sidebarOpen: false,
                analyticsOpen: false,
              };
            }

            return { focusModeEnabled: false };
          });
        },

        // Keyboard shortcuts help
        toggleShortcutsHelp: () => {
          set((state) => ({ shortcutsHelpOpen: !state.shortcutsHelpOpen }));
        },

        // Reset
        reset: () => {
          set({
            viewMode: 'board',
            filters: initialFilters,
            searchQuery: initialSearchQuery,
            commandPaletteOpen: false,
            cardComposerOpen: false,
            cardComposerStage: null,
            settingsOpen: false,
            cardDetailOpen: false,
            activeCardId: null,
            analyticsOpen: false,
            toasts: [],
            isLoading: false,
            error: null,
            focusModeEnabled: false,
            shortcutsHelpOpen: false,
          });
        },
      }),
      {
        name: 'kandoo-ui-storage',
        // Don't persist temporary UI state
        partialize: (state) => ({
          viewMode: state.viewMode,
          sidebarOpen: state.sidebarOpen,
          focusModeEnabled: state.focusModeEnabled,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);
