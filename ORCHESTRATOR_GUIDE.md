# Orchestrator Guide for Kandoo VibeFlow

## Project Overview

You are building **Kandoo VibeFlow**, a developer-centric Kanban board that embodies the "vibeflow" philosophy - representing the developer's flow state where complexity becomes simplicity. The application features a unique glassmorphic design with animated code rain, creating an immersive environment that feels both cyberpunk and natural.

## Development Approach

### Phase 1: Foundation (Start Here)
1. **Setup Project Structure**
   - Initialize with Vite + React 19 + TypeScript
   - Install all dependencies from package.json
   - Set up path aliases and TypeScript configuration
   - Create base folder structure

2. **Implement Code Rain Background**
   - Start with the CodeRain component (example provided)
   - This is the signature feature that sets the mood
   - Ensure performance optimization with virtual scrolling
   - Test with different densities and speeds

3. **Design System Implementation**
   - Create CSS variables from design-system.md
   - Implement glass surface components
   - Set up typography and color tokens
   - Create reusable glass components (buttons, cards, inputs)

### Phase 2: Core Functionality
1. **State Management**
   - Implement Zustand stores for:
     - Board state (stages, cards)
     - UI state (filters, view modes)
     - User preferences
   - Set up localStorage persistence with IndexedDB fallback

2. **Kanban Board**
   - Create the 5-column layout
   - Implement @dnd-kit for drag and drop
   - Add stage components with unique gradients
   - Implement WIP limits with visual warnings

3. **Card System**
   - Build GlassCard component (example provided)
   - Add inline card composer
   - Implement markdown support with syntax highlighting
   - Add tag system with auto-detection

### Phase 3: Enhanced Features
1. **Command Palette**
   - Implement with cmdk library
   - Add all keyboard shortcuts
   - Create command categories
   - Add Vim mode support

2. **Search & Filters**
   - Natural language search parser
   - Filter UI with saved presets
   - Real-time search highlighting
   - Search history with frecency

3. **Analytics Dashboard**
   - Flow metrics visualization
   - Velocity charts with Recharts
   - Productivity heat map
   - Personal insights

### Phase 4: Polish & Optimization
1. **Performance**
   - Code splitting by route
   - Lazy load heavy components
   - Optimize animations for 60fps
   - Implement virtual scrolling for large lists

2. **Responsive Design**
   - Mobile stack view
   - Tablet horizontal scroll
   - Ultra-wide split screen
   - Touch gestures

3. **PWA Features**
   - Service worker for offline
   - Install prompts
   - Background sync
   - Push notifications (optional)

## Key Implementation Details

### Code Rain System
The Code Rain is the signature visual feature. Key points:
- Use actual code snippets, not random characters
- Implement proper syntax highlighting with Warp-inspired colors
- Three layers with different opacities and speeds
- Respect `prefers-reduced-motion`
- Virtual scrolling for performance

### Glassmorphism
Every UI element should use the glass design system:
```css
background: linear-gradient(135deg, rgba(14, 24, 42, 0.45), rgba(14, 24, 42, 0.68));
backdrop-filter: blur(12px) saturate(1.8);
border: 1px solid rgba(79, 209, 255, 0.25);
```

### State Architecture
```typescript
// Main store structure
{
  board: {
    stages: Map<StageId, Stage>
    cards: Map<CardId, Card>
    dragState: DragState
  },
  ui: {
    filters: FilterState
    search: SearchQuery
    selectedCards: Set<CardId>
    commandPalette: boolean
  },
  user: {
    preferences: UserPreferences
    metrics: FlowMetrics
  }
}
```

### Drag and Drop
Use @dnd-kit with these patterns:
- Sortable preset for cards within columns
- Auto-scroll at edges
- Keyboard support (Space to lift, arrows to move)
- Visual feedback (scale, opacity, glow)
- Optimistic updates with rollback

### Performance Targets
- Initial load: <1.5s
- Card drag: <16ms response
- 60fps animations
- <100ms search response
- <500ms state persist

## File Organization

```
src/
├── components/          # Reusable UI components
│   ├── CodeRain/
│   ├── GlassCard/
│   ├── KanbanColumn/
│   ├── CommandPalette/
│   └── common/
├── features/           # Feature-specific components
│   ├── board/
│   ├── analytics/
│   ├── search/
│   └── settings/
├── hooks/              # Custom React hooks
│   ├── useKeyboard.ts
│   ├── useDragDrop.ts
│   └── useFlowMetrics.ts
├── stores/             # Zustand stores
│   ├── boardStore.ts
│   ├── uiStore.ts
│   └── userStore.ts
├── styles/             # Global styles
│   ├── variables.css
│   ├── glass.css
│   └── animations.css
├── utils/              # Helper functions
│   ├── syntaxHighlight.ts
│   ├── localStorage.ts
│   └── analytics.ts
└── types/              # TypeScript definitions
```

## Testing Strategy

1. **Unit Tests**
   - Test store actions and reducers
   - Test utility functions
   - Test component logic

2. **Integration Tests**
   - Test drag and drop flow
   - Test search and filters
   - Test keyboard navigation

3. **E2E Tests**
   - Full user journey from create to ship
   - Test responsive breakpoints
   - Test offline functionality

## Deployment Considerations

1. **Build Optimization**
   - Enable gzip/brotli compression
   - Use CDN for static assets
   - Implement code splitting
   - Optimize images and fonts

2. **Environment Variables**
   ```env
   VITE_APP_VERSION=1.0.0
   VITE_ENABLE_ANALYTICS=false
   VITE_API_ENDPOINT=optional
   ```

3. **Browser Support**
   - Chrome 90+
   - Firefox 88+
   - Safari 14+
   - Edge 90+

## Common Pitfalls to Avoid

1. **Don't block the main thread** with heavy computations
2. **Don't create too many DOM nodes** - use virtualization
3. **Don't forget accessibility** - keyboard nav, ARIA labels, focus management
4. **Don't ignore performance** - profile regularly
5. **Don't overcomplicate state** - keep it flat when possible

## Success Metrics

Your implementation is successful when:
- ✅ Code rain creates an immersive atmosphere without impacting performance
- ✅ Drag and drop feels smooth and responsive
- ✅ Glass surfaces create depth without sacrificing readability
- ✅ Keyboard navigation is complete and intuitive
- ✅ The app works offline and syncs when back online
- ✅ Load time is under 1.5 seconds
- ✅ Animations run at consistent 60fps
- ✅ The app feels like a tool built by developers, for developers

## Resources

- Design System: `/docs/design-system.md`
- Features Spec: `/docs/features.md`
- Code Rain Spec: `/docs/code-rain-spec.md`
- Example Components: `/src/components/`
- Type Definitions: `/src/types/index.ts`

## Start Building!

Begin with Phase 1 and work your way through. The project is designed to be built incrementally, with each phase adding more sophistication. Remember: the goal is to create a tool that makes developers feel like they're in their flow state just by using it.

Good luck, and may your code flow like water! 🌊
