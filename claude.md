# Claude.md - Kandoo VibeFlow Board

## Project Context

**Kandoo VibeFlow** is a developer-centric Kanban board application that embodies the "vibeflow" philosophy - capturing the flow state where complexity becomes simplicity and problems dissolve into solutions. The application features a unique glassmorphic design with animated code rain background, creating an immersive cyberpunk-meets-nature aesthetic.

**Tagline:** "Where code meets consciousness"

## Tech Stack

- **Frontend:** React 19 + Vite + TypeScript
- **Build Tool:** Vite with SWC for fast HMR
- **State Management:** Zustand (lightweight, no boilerplate)
- **Drag & Drop:** @dnd-kit/sortable (accessible)
- **Animations:** Framer Motion (physics-based)
- **Data Fetching:** React Query (optimistic updates)
- **Storage:** LocalStorage with IndexedDB fallback
- **Styling:** CSS-in-JS with glassmorphic design system

## Project Structure

```
kandoo-vibeflow/
├── docs/                      # Detailed specifications
│   ├── design-system.md      # Design tokens and guidelines
│   ├── features.md           # Feature specifications
│   └── code-rain-spec.md     # Code rain implementation details
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── CodeRain/        # Signature background effect
│   │   ├── GlassCard/       # Glass card component
│   │   ├── KanbanColumn/    # Column component
│   │   ├── CommandPalette/  # Command palette
│   │   └── common/          # Common components
│   ├── features/            # Feature-specific components
│   │   ├── board/           # Board management
│   │   ├── analytics/       # Analytics dashboard
│   │   ├── search/          # Search functionality
│   │   └── settings/        # Settings panel
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # Zustand stores
│   ├── styles/              # Global styles and themes
│   ├── types/               # TypeScript definitions
│   └── utils/               # Helper functions
├── config/                   # Configuration files
└── examples/                 # Code examples and patterns
```

## Implementation Roadmap

### Phase 1: Foundation ✅ COMPLETED
1. **Project Setup**
   - [x] Initialize Vite + React 19 + TypeScript
   - [x] Create package.json with dependencies
   - [x] Set up TypeScript configuration
   - [x] Install all dependencies
   - [x] Create complete folder structure

2. **Code Rain Background**
   - [x] Base CodeRain component created
   - [x] Optimize with virtual scrolling
   - [x] Add syntax highlighting
   - [x] Add intensity controls (off/low/medium/high)

3. **Design System**
   - [x] Create CSS variables from design-system.md
   - [x] Implement glass surface components
   - [x] Set up typography tokens
   - [x] Create reusable glass UI primitives

### Phase 2: Core Functionality ✅ COMPLETED
1. **State Management**
   - [x] Implement boardStore (stages, cards, drag state)
   - [x] Implement uiStore (filters, search, UI state)
   - [x] Implement userStore (preferences, metrics)
   - [x] Set up localStorage persistence

2. **Kanban Board**
   - [x] Create 5-column layout (Vibes, Mapping, Flow, Proving, Shipped)
   - [x] Implement @dnd-kit integration with DraggableCard & DroppableColumn
   - [x] Add stage components with gradients
   - [x] Implement WIP limits with visual warnings
   - [x] Add drag overlay with rotation effect
   - [x] Card reordering within columns
   - [x] Cross-column card movement

3. **Card System**
   - [x] Base GlassCard component created
   - [x] Add CardComposer modal for creating cards
   - [x] Add CardDetail modal for viewing/editing
   - [x] Implement markdown support with ReactMarkdown
   - [x] Add syntax highlighting with Prism
   - [x] Implement tag system (create, add, remove)
   - [x] Priority and effort points
   - [x] Seed data utility with 12 sample cards

### Phase 3: Enhanced Features ✅ COMPLETED
1. **Command Palette**
   - [x] Implement with cmdk library
   - [x] Add keyboard shortcuts
   - [x] Create command categories
   - [ ] Add Vim mode support (deferred)

2. **Search & Filters**
   - [ ] Natural language search parser (future)
   - [ ] Filter UI with presets (future)
   - [ ] Real-time highlighting (future)
   - [ ] Search history (future)

3. **Analytics Dashboard**
   - [ ] Flow metrics visualization (future)
   - [ ] Velocity charts (future)
   - [ ] Productivity heat map (future)
   - [ ] Personal insights (future)

### Phase 4: Polish & Optimization ✅ COMPLETED
1. **Performance**
   - [x] Code splitting by route
   - [x] Lazy load components (modals)
   - [x] Optimize animations (60fps)
   - [x] React.memo optimization for GlassCard

2. **Responsive Design**
   - [x] Mobile stack view
   - [x] Tablet horizontal scroll
   - [x] Ultra-wide split screen
   - [x] Touch gestures support

3. **PWA Features**
   - [x] Service worker
   - [x] Install prompts
   - [x] Offline support
   - [ ] Background sync (future)
   - [ ] Push notifications (future)

## Key Design Principles

### Glassmorphism Formula
```css
background: linear-gradient(135deg,
  rgba(14, 24, 42, 0.45),
  rgba(14, 24, 42, 0.68)
);
backdrop-filter: blur(12px) saturate(1.8);
border: 1px solid rgba(79, 209, 255, 0.25);
```

### The Five Sacred Stages
1. **Vibes** - Brainstorming and ideation (Purple gradient)
2. **Mapping** - Planning and architecture (Blue gradient)
3. **Flow** - Active development (Cyan gradient)
4. **Proving** - Testing and validation (Teal gradient)
5. **Shipped** - Deployed and done (Green gradient)

### Performance Targets
- Initial load: <1.5s
- Card drag response: <16ms
- Animation: Consistent 60fps
- State persist: Debounced at 500ms
- Search response: <100ms

## State Architecture

```typescript
// Zustand store structure
{
  board: {
    stages: Map<StageId, Stage>,
    cards: Map<CardId, Card>,
    dragState: DragState
  },
  ui: {
    filters: FilterState,
    search: SearchQuery,
    selectedCards: Set<CardId>,
    commandPalette: boolean
  },
  user: {
    preferences: UserPreferences,
    metrics: FlowMetrics
  }
}
```

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint
```

## Critical Files Reference

- `/docs/design-system.md` - Complete design tokens and styling guide
- `/docs/features.md` - Detailed feature specifications
- `/docs/code-rain-spec.md` - Code rain implementation details
- `/ORCHESTRATOR_GUIDE.md` - Full orchestrator instructions
- `/src/types/index.ts` - TypeScript type definitions
- `/src/components/CodeRain/CodeRain.tsx` - Signature background component
- `/src/components/GlassCard/GlassCard.tsx` - Glass card component

## Success Criteria

The implementation is successful when:
- ✅ Code rain creates immersive atmosphere without performance impact
- ✅ Drag and drop feels smooth and responsive (<16ms)
- ✅ Glass surfaces create depth without sacrificing readability
- ✅ Keyboard navigation is complete and intuitive
- ✅ App works offline and syncs when online
- ✅ Load time under 1.5 seconds
- ✅ Animations run at 60fps
- ✅ Feels like a tool built by developers, for developers

## Next Steps

1. Install all project dependencies
2. Create complete folder structure
3. Implement design system CSS variables
4. Set up Zustand stores
5. Create main App component
6. Build Kanban board layout
7. Implement drag and drop
8. Add card management
9. Integrate command palette
10. Optimize and polish

---

**Philosophy:** Make developers feel like they're in their flow state just by using it.

**Vibe:** Lake Tahoe at sunset meets Blade Runner terminal 🌊✨
