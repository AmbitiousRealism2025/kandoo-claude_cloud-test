import { useBoardStore } from '@stores/boardStore';
import type { StageId } from '../types/index';

export const seedBoardWithSampleData = () => {
  const { createCard, createTag } = useBoardStore.getState();

  // Create some tags
  const featureTag = createTag({
    name: 'Feature',
    category: 'custom',
    color: '#C084FC',
  });

  const bugTag = createTag({
    name: 'Bug',
    category: 'custom',
    color: '#FF5370',
  });

  const docTag = createTag({
    name: 'Docs',
    category: 'custom',
    color: '#4FD1FF',
  });

  const refactorTag = createTag({
    name: 'Refactor',
    category: 'custom',
    color: '#FFCB6B',
  });

  // Get the tags from the store
  const { tags } = useBoardStore.getState();
  const featureTagObj = tags.find(t => t.id === featureTag)!;
  const bugTagObj = tags.find(t => t.id === bugTag)!;
  const docTagObj = tags.find(t => t.id === docTag)!;
  const refactorTagObj = tags.find(t => t.id === refactorTag)!;

  // Create sample cards in Vibes stage
  createCard('vibes' as StageId, {
    title: 'Add Dark Mode Toggle',
    description: `Implement a theme switcher that allows users to toggle between dark and light modes.

## Requirements
- Toggle button in header
- Persist preference to localStorage
- Smooth transition animation

\`\`\`typescript
const toggleTheme = () => {
  setTheme(theme === 'dark' ? 'light' : 'dark');
};
\`\`\``,
    priority: 'Medium',
    effortPoints: 3,
    tags: [featureTagObj],
  });

  createCard('vibes' as StageId, {
    title: 'Improve Search Performance',
    description: 'Optimize search algorithm to handle large datasets efficiently.',
    priority: 'High',
    effortPoints: 5,
    tags: [refactorTagObj],
  });

  // Create sample cards in Mapping stage
  createCard('mapping' as StageId, {
    title: 'Design Analytics Dashboard',
    description: `Create mockups for the analytics dashboard showing:
- Velocity trends
- Cycle time metrics
- Throughput charts
- Productivity heat map`,
    priority: 'Medium',
    effortPoints: 3,
    tags: [featureTagObj, docTagObj],
  });

  createCard('mapping' as StageId, {
    title: 'API Rate Limiting Strategy',
    description: 'Design rate limiting approach for public API endpoints.',
    priority: 'Critical',
    effortPoints: 5,
    tags: [featureTagObj],
  });

  // Create sample cards in Flow stage
  createCard('flow' as StageId, {
    title: 'Implement Drag and Drop',
    description: `Working on the drag-and-drop functionality using @dnd-kit.

## Progress
- [x] Install dependencies
- [x] Create DraggableCard component
- [x] Implement drop zones
- [ ] Add keyboard support
- [ ] Test on mobile

\`\`\`tsx
<DndContext onDragEnd={handleDragEnd}>
  <Droppable id="column">
    <Draggable id="card">Card</Draggable>
  </Droppable>
</DndContext>
\`\`\``,
    priority: 'High',
    effortPoints: 8,
    tags: [featureTagObj],
  });

  createCard('flow' as StageId, {
    title: 'Fix Card Alignment Issue',
    description: 'Cards are not properly aligned in mobile view. Need to fix the flex layout.',
    priority: 'Medium',
    effortPoints: 2,
    tags: [bugTagObj],
  });

  createCard('flow' as StageId, {
    title: 'Add Keyboard Shortcuts',
    description: `Implement keyboard shortcuts for common actions:
- \`Ctrl+K\` - Open command palette
- \`N\` - New card
- \`/\` - Focus search
- \`?\` - Show shortcuts help`,
    priority: 'Low',
    effortPoints: 3,
    tags: [featureTagObj],
  });

  // Create sample cards in Proving stage
  createCard('proving' as StageId, {
    title: 'Test Card Persistence',
    description: 'Verify that cards are properly saved to localStorage and restored on page reload.',
    priority: 'High',
    effortPoints: 2,
    tags: [bugTagObj],
  });

  createCard('proving' as StageId, {
    title: 'Write E2E Tests',
    description: `Add end-to-end tests for core user flows:
1. Creating a new card
2. Dragging cards between columns
3. Editing card details
4. Archiving/deleting cards`,
    priority: 'Medium',
    effortPoints: 5,
    tags: [docTagObj],
  });

  // Create sample cards in Shipped stage
  createCard('shipped' as StageId, {
    title: 'Launch Beta Version',
    description: 'Successfully deployed beta version with core features. 🎉',
    priority: 'Critical',
    effortPoints: 13,
    tags: [featureTagObj],
  });

  createCard('shipped' as StageId, {
    title: 'Setup CI/CD Pipeline',
    description: `Configured GitHub Actions for:
- Automated testing
- Build verification
- Deployment to Vercel

All green! ✅`,
    priority: 'High',
    effortPoints: 8,
    tags: [refactorTagObj, docTagObj],
  });
};

// Helper to check if board needs seeding
export const shouldSeedBoard = (): boolean => {
  const { cards } = useBoardStore.getState();
  return cards.size === 0;
};
