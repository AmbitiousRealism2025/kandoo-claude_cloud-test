# Feature Specifications

## 1. Intelligent Kanban System

### Five Sacred Stages

Each stage represents a phase in the developer's flow state:

```typescript
interface Stage {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  wipLimit?: number;
}
```

#### Stage Definitions

1. **🌊 Vibes (Ideas)**
   - Title: "Where inspiration flows"
   - Gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
   - Description: The birthplace of ideas, where creativity meets possibility

2. **🗺️ Mapping (Planning)**
   - Title: "Charting the course"
   - Gradient: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`
   - Description: Strategic planning and architecture design

3. **⚡ Flow (Coding)**
   - Title: "In the zone"
   - Gradient: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`
   - Description: Deep work state where code flows effortlessly
   - WIP Limit: 3 (configurable)

4. **🔬 Proving (Testing)**
   - Title: "Trust but verify"
   - Gradient: `linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)`
   - Description: Validation, testing, and quality assurance

5. **🚀 Shipped (Deployed)**
   - Title: "Released to the universe"
   - Gradient: `linear-gradient(135deg, #fa709a 0%, #fee140 100%)`
   - Description: Completed and deployed to production

### Smart Features

- **Auto-advance**: Cards automatically move based on GitHub PR status
- **Time tracking**: Track time spent in each stage with flow state metrics
- **WIP limits**: Visual glass warning overlays when limits exceeded
- **Bulk actions**: Multi-select with Shift+Click for batch operations

## 2. Card Intelligence

### Card Anatomy

```typescript
interface Card {
  id: string;
  title: string;
  description: string; // Markdown with syntax highlighting
  stage: StageId;
  tags: Tag[];
  assignee?: User;
  effortPoints?: number; // Fibonacci: 1, 2, 3, 5, 8, 13
  momentum?: number; // Activity sparkline data
  linkedCards?: CardId[];
  createdAt: Date;
  updatedAt: Date;
  timeInStage: number;
  attachments?: Attachment[];
}
```

### Creation Flow

- **Inline Composer**: Quick-add cards directly in any column
- **Slash Commands**: 
  - `/bug` - Creates bug card with red priority
  - `/feature` - Creates feature card with enhancement tag
  - `/spike` - Creates research card with time-boxed tag
- **Template System**: Predefined templates for common card types
- **Voice-to-Card**: Web Speech API integration for voice input
- **Paste-to-Parse**: Paste GitHub issue URL to auto-import

### Card Features

- Markdown support with live preview
- Syntax highlighting for code blocks
- Activity sparkline showing last 7 days of activity
- Quick actions menu on hover (edit, archive, convert to template)
- Card permalinks for sharing
- Time tracking per card with automatic flow detection

## 3. Advanced Tag Ecosystem

### Dynamic Tag Categories

```typescript
interface TagCategory {
  id: string;
  name: string;
  type: 'stack' | 'energy' | 'time' | 'custom';
  color: string;
  icon?: string;
  autoDetect?: boolean;
}
```

#### Categories

1. **Stack Tags** (Auto-detected)
   - React, TypeScript, Python, API, Database, UI/UX
   - Auto-detected from card content using keyword matching

2. **Energy Tags**
   - 🔥 On Fire (high momentum)
   - 🧊 Blocked (waiting on external)
   - ⏸️ Paused (intentionally on hold)
   - 🌊 Flowing (in active development)

3. **Time Tags**
   - Today, This Week, This Sprint
   - Auto-applied based on due dates

4. **Custom Tags**
   - User-defined with emoji support
   - Color picker with neon presets
   - Tag combinations create automatic filters

### Tag Intelligence

- **Auto-suggest**: ML-based tag suggestions from content
- **Heat Map**: Visual representation of tag usage patterns
- **Tag Rules**: Automated tagging based on conditions
- **Tag Analytics**: Track tag lifecycle and effectiveness

## 4. Keyboard Symphony

### Command Palette (⌘K)

```typescript
interface Command {
  id: string;
  name: string;
  shortcut?: string;
  action: () => void;
  category: 'navigation' | 'card' | 'view' | 'filter';
}
```

### Keyboard Shortcuts

#### Navigation
- `Tab` - Navigate between columns
- `1-5` - Jump to specific column
- `h/j/k/l` - Vim-style navigation
- `g g` - Go to first card
- `G` - Go to last card

#### Card Operations
- `Space` - Quick add card in current column
- `Enter` - Edit selected card
- `Delete` - Archive selected card
- `d d` - Delete card (Vim style)
- `y` - Copy card
- `p` - Paste card

#### View Controls
- `⌘Z` - Undo with visual timeline
- `⌘⇧Z` - Redo
- `⌘F` - Focus search
- `⌘\` - Toggle sidebar
- `⌘.` - Open settings

## 5. Search & Filter Intelligence

### Natural Language Processing

```typescript
interface SearchQuery {
  text: string;
  filters: {
    tags?: string[];
    assignee?: string;
    stage?: string;
    dateRange?: DateRange;
    effort?: number[];
  };
  sort?: 'relevance' | 'date' | 'effort' | 'momentum';
}
```

### Search Features

- **Full-text search** with highlighting
- **Natural language filters**: "show me critical bugs from last week"
- **Saved filter presets** with quick access
- **Search history** with frecency sorting
- **Smart suggestions** based on current context

## 6. Analytics & Insights

### Flow State Tracker

```typescript
interface FlowMetrics {
  cardsCompleted: number;
  timeInFlow: number;
  velocityTrend: 'increasing' | 'stable' | 'decreasing';
  predictedCompletion: Date;
  productivityScore: number;
  peakHours: TimeRange[];
}
```

### Metrics Dashboard

- **Velocity Trends**: Cards completed over time
- **Stage Duration**: Average time cards spend in each stage
- **Tag Patterns**: Most effective tag combinations
- **Personal Heat Map**: Productivity by hour/day
- **Flow Score**: Gamified productivity metric

## 7. Collaboration Features

### Presence Indicators

- Real-time cursor positions
- Avatar badges on cards being edited
- Live typing indicators
- Conflict resolution for concurrent edits

### Comments & Activity

```typescript
interface Activity {
  id: string;
  type: 'comment' | 'move' | 'edit' | 'tag';
  user: User;
  timestamp: Date;
  data: any;
}
```

- Threaded comments with @mentions
- Activity feed per card
- Board-level activity stream
- Notification preferences

## 8. Developer Tools

### Debug Mode

- Render count overlay
- Performance monitor
- State inspector
- Network request logger
- Animation frame counter

### API Integration

```typescript
interface WebhookConfig {
  url: string;
  events: EventType[];
  secret?: string;
  headers?: Record<string, string>;
}
```

- Webhook support for all card events
- REST API for external integrations
- GraphQL endpoint (future)
- WebSocket for real-time updates

### Export/Import

- JSON export with full state
- CSV export for analysis
- Markdown export for documentation
- Import from Trello/Jira/GitHub Issues
