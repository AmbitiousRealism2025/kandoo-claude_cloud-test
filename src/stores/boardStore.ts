import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Card, CardId, Stage, StageId, Tag, TagId, DragItem } from '../types/index';

interface BoardStore {
  // State
  stages: Map<StageId, Stage>;
  cards: Map<CardId, Card>;
  tags: Tag[];
  dragState: DragItem | null;
  selectedCards: Set<CardId>;

  // Card actions
  createCard: (stageId: StageId, card: Omit<Card, 'id' | 'stage' | 'createdAt' | 'updatedAt' | 'timeInStage' | 'totalTime' | 'activity'>) => CardId;
  updateCard: (cardId: CardId, updates: Partial<Card>) => void;
  deleteCard: (cardId: CardId) => void;
  moveCard: (cardId: CardId, toStage: StageId, toIndex: number) => void;
  archiveCard: (cardId: CardId) => void;
  restoreCard: (cardId: CardId) => void;
  duplicateCard: (cardId: CardId) => CardId;

  // Card selection
  selectCard: (cardId: CardId) => void;
  deselectCard: (cardId: CardId) => void;
  selectMultiple: (cardIds: CardId[]) => void;
  clearSelection: () => void;

  // Tag actions
  addTag: (cardId: CardId, tag: Tag) => void;
  removeTag: (cardId: CardId, tagId: TagId) => void;
  createTag: (tag: Omit<Tag, 'id' | 'count' | 'lastUsed'>) => TagId;

  // Drag and drop
  setDragState: (dragState: DragItem | null) => void;

  // Stage actions
  updateStageWipLimit: (stageId: StageId, limit: number) => void;

  // Bulk operations
  bulkMoveCards: (cardIds: CardId[], toStage: StageId) => void;
  bulkArchiveCards: (cardIds: CardId[]) => void;
  bulkDeleteCards: (cardIds: CardId[]) => void;

  // Utility
  getCard: (cardId: CardId) => Card | undefined;
  getCardsByStage: (stageId: StageId) => Card[];
  getCardsByTag: (tagId: TagId) => Card[];
  reset: () => void;
}

// Initial stages
const createInitialStages = (): Map<StageId, Stage> => {
  const stages: Stage[] = [
    {
      id: 'vibes' as StageId,
      name: 'vibes',
      title: 'Vibes',
      description: 'Brainstorming and ideation',
      icon: '✨',
      gradient: 'var(--gradient-vibes)',
      wipLimit: undefined,
      cards: [],
    },
    {
      id: 'mapping' as StageId,
      name: 'mapping',
      title: 'Mapping',
      description: 'Planning and architecture',
      icon: '🗺️',
      gradient: 'var(--gradient-mapping)',
      wipLimit: undefined,
      cards: [],
    },
    {
      id: 'flow' as StageId,
      name: 'flow',
      title: 'Flow',
      description: 'Active development',
      icon: '💫',
      gradient: 'var(--gradient-flow)',
      wipLimit: 5,
      cards: [],
    },
    {
      id: 'proving' as StageId,
      name: 'proving',
      title: 'Proving',
      description: 'Testing and validation',
      icon: '🧪',
      gradient: 'var(--gradient-proving)',
      wipLimit: 3,
      cards: [],
    },
    {
      id: 'shipped' as StageId,
      name: 'shipped',
      title: 'Shipped',
      description: 'Deployed and done',
      icon: '🚀',
      gradient: 'var(--gradient-shipped)',
      wipLimit: undefined,
      cards: [],
    },
  ];

  return new Map(stages.map((stage) => [stage.id, stage]));
};

// Helper to create a new card
const createNewCard = (
  stageId: StageId,
  cardData: Omit<Card, 'id' | 'stage' | 'createdAt' | 'updatedAt' | 'timeInStage' | 'totalTime' | 'activity'>
): Card => {
  const now = new Date();
  return {
    ...cardData,
    id: nanoid() as CardId,
    stage: stageId,
    createdAt: now,
    updatedAt: now,
    timeInStage: 0,
    totalTime: 0,
    activity: [],
  };
};

export const useBoardStore = create<BoardStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        stages: createInitialStages(),
        cards: new Map(),
        tags: [],
        dragState: null,
        selectedCards: new Set(),

        // Card actions
        createCard: (stageId, cardData) => {
          const card = createNewCard(stageId, cardData);
          set((state) => {
            const newCards = new Map(state.cards);
            newCards.set(card.id, card);

            const newStages = new Map(state.stages);
            const stage = newStages.get(stageId);
            if (stage) {
              stage.cards = [...stage.cards, card.id];
              newStages.set(stageId, { ...stage });
            }

            return { cards: newCards, stages: newStages };
          });
          return card.id;
        },

        updateCard: (cardId, updates) => {
          set((state) => {
            const card = state.cards.get(cardId);
            if (!card) return state;

            const newCards = new Map(state.cards);
            newCards.set(cardId, {
              ...card,
              ...updates,
              updatedAt: new Date(),
            });

            return { cards: newCards };
          });
        },

        deleteCard: (cardId) => {
          set((state) => {
            const card = state.cards.get(cardId);
            if (!card) return state;

            const newCards = new Map(state.cards);
            newCards.delete(cardId);

            const newStages = new Map(state.stages);
            const stage = newStages.get(card.stage);
            if (stage) {
              stage.cards = stage.cards.filter((id) => id !== cardId);
              newStages.set(card.stage, { ...stage });
            }

            const newSelectedCards = new Set(state.selectedCards);
            newSelectedCards.delete(cardId);

            return { cards: newCards, stages: newStages, selectedCards: newSelectedCards };
          });
        },

        moveCard: (cardId, toStage, toIndex) => {
          set((state) => {
            const card = state.cards.get(cardId);
            if (!card) return state;

            const fromStage = card.stage;
            const newCards = new Map(state.cards);
            const newStages = new Map(state.stages);

            if (fromStage === toStage) {
              // Same column reordering
              const stage = newStages.get(toStage);
              if (stage) {
                const cards = [...stage.cards];
                const fromIndex = cards.indexOf(cardId);

                if (fromIndex !== -1 && fromIndex !== toIndex) {
                  // Remove from old position
                  cards.splice(fromIndex, 1);
                  // Insert at new position
                  cards.splice(toIndex, 0, cardId);

                  newStages.set(toStage, { ...stage, cards });
                }
              }

              // Update card timestamp
              newCards.set(cardId, {
                ...card,
                updatedAt: new Date(),
              });
            } else {
              // Cross-column move
              // Update card
              newCards.set(cardId, {
                ...card,
                stage: toStage,
                updatedAt: new Date(),
                timeInStage: 0,
              });

              // Remove from old stage
              const oldStage = newStages.get(fromStage);
              if (oldStage) {
                oldStage.cards = oldStage.cards.filter((id) => id !== cardId);
                newStages.set(fromStage, { ...oldStage });
              }

              // Add to new stage
              const newStage = newStages.get(toStage);
              if (newStage) {
                const cards = [...newStage.cards];
                cards.splice(toIndex, 0, cardId);
                newStage.cards = cards;
                newStages.set(toStage, { ...newStage });
              }
            }

            return { cards: newCards, stages: newStages };
          });
        },

        archiveCard: (cardId) => {
          get().updateCard(cardId, { isArchived: true });
        },

        restoreCard: (cardId) => {
          get().updateCard(cardId, { isArchived: false });
        },

        duplicateCard: (cardId) => {
          const card = get().cards.get(cardId);
          if (!card) return cardId;

          const { id, createdAt, updatedAt, activity, ...cardData } = card;
          const newCardId = get().createCard(card.stage, {
            ...cardData,
            title: `${card.title} (Copy)`,
          });

          return newCardId;
        },

        // Card selection
        selectCard: (cardId) => {
          set((state) => {
            const newSelectedCards = new Set(state.selectedCards);
            newSelectedCards.add(cardId);
            return { selectedCards: newSelectedCards };
          });
        },

        deselectCard: (cardId) => {
          set((state) => {
            const newSelectedCards = new Set(state.selectedCards);
            newSelectedCards.delete(cardId);
            return { selectedCards: newSelectedCards };
          });
        },

        selectMultiple: (cardIds) => {
          set({ selectedCards: new Set(cardIds) });
        },

        clearSelection: () => {
          set({ selectedCards: new Set() });
        },

        // Tag actions
        addTag: (cardId, tag) => {
          set((state) => {
            const card = state.cards.get(cardId);
            if (!card) return state;

            const newCards = new Map(state.cards);
            newCards.set(cardId, {
              ...card,
              tags: [...card.tags, tag],
              updatedAt: new Date(),
            });

            return { cards: newCards };
          });
        },

        removeTag: (cardId, tagId) => {
          set((state) => {
            const card = state.cards.get(cardId);
            if (!card) return state;

            const newCards = new Map(state.cards);
            newCards.set(cardId, {
              ...card,
              tags: card.tags.filter((t) => t.id !== tagId),
              updatedAt: new Date(),
            });

            return { cards: newCards };
          });
        },

        createTag: (tagData) => {
          const tagId = nanoid() as TagId;
          const tag: Tag = {
            ...tagData,
            id: tagId,
            count: 0,
            lastUsed: new Date(),
          };

          set((state) => ({
            tags: [...state.tags, tag],
          }));

          return tagId;
        },

        // Drag and drop
        setDragState: (dragState) => {
          set({ dragState });
        },

        // Stage actions
        updateStageWipLimit: (stageId, limit) => {
          set((state) => {
            const newStages = new Map(state.stages);
            const stage = newStages.get(stageId);
            if (stage) {
              newStages.set(stageId, { ...stage, wipLimit: limit });
            }
            return { stages: newStages };
          });
        },

        // Bulk operations
        bulkMoveCards: (cardIds, toStage) => {
          cardIds.forEach((cardId, index) => {
            get().moveCard(cardId, toStage, index);
          });
        },

        bulkArchiveCards: (cardIds) => {
          cardIds.forEach((cardId) => {
            get().archiveCard(cardId);
          });
        },

        bulkDeleteCards: (cardIds) => {
          cardIds.forEach((cardId) => {
            get().deleteCard(cardId);
          });
        },

        // Utility
        getCard: (cardId) => {
          return get().cards.get(cardId);
        },

        getCardsByStage: (stageId) => {
          const stage = get().stages.get(stageId);
          if (!stage) return [];

          return stage.cards
            .map((cardId) => get().cards.get(cardId))
            .filter((card): card is Card => card !== undefined);
        },

        getCardsByTag: (tagId) => {
          const cards = Array.from(get().cards.values());
          return cards.filter((card) => card.tags.some((tag) => tag.id === tagId));
        },

        reset: () => {
          set({
            stages: createInitialStages(),
            cards: new Map(),
            tags: [],
            dragState: null,
            selectedCards: new Set(),
          });
        },
      }),
      {
        name: 'kandoo-board-storage',
        // Custom serialization for Map and Set
        partialize: (state) => ({
          stages: Array.from(state.stages.entries()),
          cards: Array.from(state.cards.entries()),
          tags: state.tags,
          selectedCards: Array.from(state.selectedCards),
        }),
        // Custom deserialization
        merge: (persistedState: any, currentState) => {
          return {
            ...currentState,
            stages: new Map(persistedState.stages || []),
            cards: new Map(persistedState.cards || []),
            tags: persistedState.tags || [],
            selectedCards: new Set(persistedState.selectedCards || []),
          };
        },
      }
    ),
    { name: 'BoardStore' }
  )
);
