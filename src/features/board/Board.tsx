import { useBoardStore } from '@stores/boardStore';
import { useUIStore } from '@stores/uiStore';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
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
  const [overId, setOverId] = useState<string | null>(null);

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

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over ? String(over.id) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveCard(null);
    setOverId(null);

    if (!over) {
      return;
    }

    const draggedCard = cards.get(active.id as CardId);
    if (!draggedCard) {
      return;
    }

    // Check if we're dropping on a card or a column
    const overCard = cards.get(over.id as CardId);
    const overStage = stages.get(over.id as StageId);

    let targetStageId: StageId;
    let targetIndex: number;

    if (overCard) {
      // Dropping on a card - insert relative to that card
      targetStageId = overCard.stage;
      const stageCards = getCardsByStage(targetStageId);
      const overCardIndex = stageCards.findIndex(c => c.id === overCard.id);

      if (draggedCard.stage === targetStageId) {
        // Same column reordering
        const activeIndex = stageCards.findIndex(c => c.id === draggedCard.id);
        targetIndex = activeIndex < overCardIndex ? overCardIndex : overCardIndex;
      } else {
        // Cross-column move - insert at the position of the card we're over
        targetIndex = overCardIndex;
      }
    } else if (overStage) {
      // Dropping on a column - add to end
      targetStageId = overStage.id;
      const targetCards = getCardsByStage(targetStageId);
      targetIndex = targetCards.length;
    } else {
      // Invalid drop target
      return;
    }

    // Only move if something actually changed
    if (draggedCard.stage !== targetStageId || overCard) {
      moveCard(active.id as CardId, targetStageId, targetIndex);
    }
  };

  const handleDragCancel = () => {
    setActiveCard(null);
    setOverId(null);
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
        onDragOver={handleDragOver}
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
