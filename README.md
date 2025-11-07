# Kandoo VibeFlow Board

**Tagline:** "Where code meets consciousness"

## Project Overview

Build a developer-centric Kanban board that embodies the "vibeflow" philosophy - that state of perfect productivity where code flows through you like water through a mountain stream. Think Lake Tahoe at sunset meets Blade Runner terminal, with glassmorphic surfaces that feel both natural and cyberpunk.

## Core Philosophy

VibeFlow represents the developer's flow state - when complexity becomes simplicity, when problems dissolve into solutions. The UI should breathe with this energy through subtle animations, glass refractions, and code that dances in the background like digital rain.

## Quick Start for Orchestrator Agent

1. Review this README for complete project vision
2. Check `/docs` folder for detailed specifications
3. Review `/src/components/CodeRain` for the signature background effect
4. Use `/config` files for design tokens and technical setup
5. Reference `/examples` for UI patterns and interactions

## Technical Architecture

### Core Stack
- **React 19 + Vite** (with SWC for blazing fast HMR)
- **TypeScript** for type safety
- **@dnd-kit/sortable** for accessible drag-and-drop
- **Framer Motion** for physics-based animations
- **Zustand** for state management (lightweight, no boilerplate)
- **React Query** for optimistic updates
- **LocalStorage with IndexedDB** fallback for persistence

### Build Optimizations
- Code splitting per column component
- Virtual scrolling for large card lists
- Web Workers for background state sync
- CSS containment for render performance

## Project Structure

```
kandoo-vibeflow/
├── docs/               # Detailed specifications
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── stores/        # Zustand stores
│   ├── styles/        # Global styles and themes
│   ├── types/         # TypeScript definitions
│   └── utils/         # Helper functions
├── config/            # Configuration files
└── examples/          # Code examples and patterns
```

## Key Features Overview

1. **Intelligent Kanban System** - Five sacred stages with auto-advance and flow metrics
2. **Card Intelligence** - Rich cards with markdown, syntax highlighting, and activity tracking
3. **Advanced Tag Ecosystem** - Dynamic categories with auto-detection and heat maps
4. **Visual Symphony** - Glassmorphism layers with animated code rain
5. **Developer Power Features** - Command palette, Vim navigation, and performance monitoring
6. **Responsive & Adaptive** - Breakpoint strategy from mobile to ultra-wide

## Performance Targets

- Initial load: <1.5s
- Card drag start: <16ms response
- State persist: Debounced at 500ms
- Animation: Consistent 60fps

## Development Workflow

1. Start with the CodeRain component for the signature background
2. Build the glass UI system using the design tokens
3. Implement the Kanban board with drag-and-drop
4. Add card management and tag system
5. Integrate keyboard shortcuts and command palette
6. Optimize for performance and responsiveness

## Meta Development Journey (Seed Content)

1. **Vibes**: "What if Kanban boards could capture flow state?"
2. **Mapping**: "Architecting the glass universe"
3. **Flow**: "Implementing drag physics with spring dynamics"
4. **Proving**: "Testing across the matrix of devices"
5. **Shipped**: "You're experiencing it right now"

---

*For detailed specifications, see the `/docs` folder*
