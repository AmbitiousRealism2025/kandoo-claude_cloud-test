import { useBoardStore } from '@stores/boardStore';
import { useUIStore } from '@stores/uiStore';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import DroppableColumn from '@components/DroppableColumn/DroppableColumn';
import GlassCard from '@components/GlassCard/GlassCard';
import type { Card, CardId, StageId } from '../../types/index';
import { useState } from 'react';
import './Board.css';

const Board = () => {
  const { stages, cards, moveCard, getCardsByStage } = useBoardStore();
  const { openCardComposer, openCardDetail } = useUIStore();
  const stageArray = Array.from(stages.values());

  const [activeCard, setActiveCard] = useState<Card | null>(null);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = cards.get(active.id as CardId);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveCard(null);
      return;
    }

    const activeCard = cards.get(active.id as CardId);
    if (!activeCard) {
      setActiveCard(null);
      return;
    }

    // Get the target stage
    const overStageId = over.id as StageId;
    const overStage = stages.get(overStageId);

    if (overStage) {
      // Moving to a different column
      const targetCards = getCardsByStage(overStageId);
      const newIndex = targetCards.length; // Add to end
      moveCard(active.id as CardId, overStageId, newIndex);
    } else {
      // Reordering within same column
      const overCard = cards.get(over.id as CardId);
      if (overCard && activeCard.stage === overCard.stage) {
        const stageCards = getCardsByStage(activeCard.stage);
        const oldIndex = stageCards.findIndex(c => c.id === activeCard.id);
        const newIndex = stageCards.findIndex(c => c.id === overCard.id);

        if (oldIndex !== newIndex) {
          const reorderedCards = arrayMove(stageCards, oldIndex, newIndex);
          // Update the stage's card order
          const stage = stages.get(activeCard.stage);
          if (stage) {
            stage.cards = reorderedCards.map(c => c.id);
          }
        }
      }
    }

    setActiveCard(null);
  };

  const handleDragCancel = () => {
    setActiveCard(null);
  };

  const handleAddCard = (stageId: string) => {
    openCardComposer(stageId);
  };

  const handleEditCard = (card: Card) => {
    openCardDetail(card.id);
  };

  const handleDeleteCard = (cardId: string) => {
    // Will be implemented with card detail modal
    console.log('Delete card:', cardId);
  };

  const handleTagClick = (tag: string) => {
    console.log('Filter by tag:', tag);
    // Will be implemented in Phase 3
  };

  return (
    <div className="board-container">
      <header className="board-header">
        <h1 className="board-title neon-text">
          Kandoo VibeFlow
        </h1>
        <p className="board-subtitle">Where code meets consciousness</p>
      </header>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="kanban-board">
          {stageArray.map((stage) => {
            const stageCards = getCardsByStage(stage.id);
            const isOverLimit = stage.wipLimit ? stageCards.length > stage.wipLimit : false;

            return (
              <DroppableColumn
                key={stage.id}
                stage={stage}
                cards={stageCards}
                onAddCard={handleAddCard}
                onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}
                onTagClick={handleTagClick}
                isOverLimit={isOverLimit}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeCard ? (
            <div style={{ transform: 'rotate(5deg)', cursor: 'grabbing' }}>
              <GlassCard
                card={activeCard}
                isDragging={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Board;
