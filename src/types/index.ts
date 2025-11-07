// Core type definitions for Kandoo VibeFlow

// Branded types for type safety
export type CardId = string & { _brand: 'CardId' };
export type StageId = string & { _brand: 'StageId' };
export type TagId = string & { _brand: 'TagId' };
export type UserId = string & { _brand: 'UserId' };

// Vibe levels
export type VibeLevel = 'focused' | 'flowing' | 'blocked' | 'paused';

// Stage definitions
export interface Stage {
  id: StageId;
  name: 'vibes' | 'mapping' | 'flow' | 'proving' | 'shipped';
  title: string;
  description: string;
  icon: string;
  gradient: string;
  wipLimit?: number;
  cards: CardId[];
}

// Tag system
export interface Tag {
  id: TagId;
  name: string;
  category: 'stack' | 'energy' | 'time' | 'custom';
  color: string;
  icon?: string;
  count: number;
  lastUsed: Date;
}

// User/Assignee
export interface User {
  id: UserId;
  name: string;
  avatar?: string;
  email?: string;
  isOnline?: boolean;
}

// Card attachments
export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'link';
  url: string;
  size?: number;
  uploadedAt: Date;
}

// Activity types
export type ActivityType = 'created' | 'moved' | 'edited' | 'commented' | 'tagged' | 'assigned';

export interface Activity {
  id: string;
  type: ActivityType;
  cardId: CardId;
  userId: UserId;
  timestamp: Date;
  data?: any;
  description: string;
}

// Main Card interface
export interface Card {
  id: CardId;
  title: string;
  description?: string; // Markdown with syntax highlighting
  stage: StageId;
  tags: Tag[];
  assignee?: User;
  priority?: 'Critical' | 'High' | 'Medium' | 'Low';
  effortPoints?: number; // Fibonacci: 1, 2, 3, 5, 8, 13
  momentum?: number[]; // Activity sparkline data (last 7 days)
  linkedCards?: CardId[];
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  timeInStage: number; // milliseconds
  totalTime: number; // total time tracked
  activity: Activity[];
  isArchived?: boolean;
  dueDate?: Date;
  completedAt?: Date;
}

// Flow metrics
export interface FlowMetrics {
  cardsCompleted: number;
  timeInFlow: number; // milliseconds
  velocityTrend: 'increasing' | 'stable' | 'decreasing';
  predictedCompletion?: Date;
  productivityScore: number; // 0-100
  peakHours: TimeRange[];
  currentStreak: number; // days
  longestStreak: number; // days
}

export interface TimeRange {
  start: number; // hour (0-23)
  end: number; // hour (0-23)
  productivity: number; // 0-100
}

// Board state
export interface BoardState {
  id: string;
  name: string;
  stages: Stage[];
  cards: Map<CardId, Card>;
  tags: Tag[];
  users: User[];
  filters: FilterState;
  view: ViewMode;
  metrics: FlowMetrics;
  lastSync?: Date;
}

// Filter state
export interface FilterState {
  search?: string;
  tags?: TagId[];
  assignees?: UserId[];
  stages?: StageId[];
  priorities?: Card['priority'][];
  dateRange?: {
    start: Date;
    end: Date;
  };
  showArchived?: boolean;
  customFilters?: CustomFilter[];
}

export interface CustomFilter {
  id: string;
  name: string;
  query: string; // Natural language query
  conditions: FilterCondition[];
}

export interface FilterCondition {
  field: keyof Card;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: any;
}

// View modes
export type ViewMode = 'board' | 'list' | 'calendar' | 'analytics' | 'timeline';

// Drag and drop
export interface DragItem {
  id: CardId;
  index: number;
  stage: StageId;
}

export interface DropResult {
  cardId: CardId;
  fromStage: StageId;
  toStage: StageId;
  fromIndex: number;
  toIndex: number;
}

// Command palette
export interface Command {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  category: 'navigation' | 'card' | 'view' | 'filter' | 'settings';
  action: () => void | Promise<void>;
  enabled?: boolean;
}

// Settings/Preferences
export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  codeRainIntensity: 'off' | 'low' | 'medium' | 'high';
  keyboardShortcuts: boolean;
  vimMode: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  autoSave: boolean;
  autoSaveInterval: number; // milliseconds
  defaultView: ViewMode;
  cardTemplate?: Partial<Card>;
  wipLimits: Record<StageId, number>;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  cardMoved: boolean;
  cardAssigned: boolean;
  cardDue: boolean;
  mentioned: boolean;
  flowStateReminders: boolean;
  dailySummary: boolean;
}

// API/Webhook types
export interface WebhookConfig {
  id: string;
  url: string;
  events: ActivityType[];
  secret?: string;
  headers?: Record<string, string>;
  active: boolean;
  lastTriggered?: Date;
  failureCount: number;
}

// Search
export interface SearchQuery {
  text: string;
  filters?: FilterState;
  sort?: SortConfig;
  limit?: number;
  offset?: number;
}

export interface SortConfig {
  field: keyof Card;
  direction: 'asc' | 'desc';
}

export interface SearchResult {
  cards: Card[];
  total: number;
  facets?: SearchFacets;
  suggestions?: string[];
  executionTime: number;
}

export interface SearchFacets {
  tags: Array<{ tag: Tag; count: number }>;
  stages: Array<{ stage: Stage; count: number }>;
  assignees: Array<{ user: User; count: number }>;
  priorities: Array<{ priority: Card['priority']; count: number }>;
}

// Template system
export interface CardTemplate {
  id: string;
  name: string;
  description: string;
  icon?: string;
  template: Partial<Card>;
  category: 'bug' | 'feature' | 'spike' | 'custom';
  shortcut?: string;
}

// Analytics
export interface Analytics {
  cycleTime: Record<StageId, number>; // average time in each stage
  throughput: number; // cards completed per day
  leadTime: number; // average time from creation to completion
  blockageRate: number; // percentage of time cards are blocked
  tagEfficiency: Record<TagId, number>; // completion rate by tag
  userProductivity: Record<UserId, FlowMetrics>;
}

// Export/Import
export interface ExportData {
  version: string;
  exportedAt: Date;
  board: BoardState;
  preferences: UserPreferences;
  templates: CardTemplate[];
  webhooks: WebhookConfig[];
}

// Performance monitoring
export interface PerformanceMetrics {
  renderCount: number;
  frameRate: number;
  memoryUsage: number;
  networkLatency: number;
  stateUpdateTime: number;
  animationDroppedFrames: number;
}

// Error handling
export interface AppError {
  id: string;
  type: 'network' | 'validation' | 'permission' | 'sync' | 'unknown';
  message: string;
  details?: any;
  timestamp: Date;
  retryable: boolean;
  retryCount?: number;
}

// Sync status
export interface SyncStatus {
  status: 'idle' | 'syncing' | 'error' | 'offline';
  lastSync?: Date;
  pendingChanges: number;
  error?: AppError;
}
