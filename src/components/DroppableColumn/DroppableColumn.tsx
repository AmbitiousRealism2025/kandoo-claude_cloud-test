import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Stage, Card } from '../../types/index';
import DraggableCard from '@components/DraggableCard/DraggableCard';
import './DroppableColumn.css';

interface DroppableColumnProps {
  stage: Stage;
  cards: Card[];
  onAddCard?: (stageId: string) => void;
  onEditCard?: (card: Card) => void;
  onDeleteCard?: (cardId: string) => void;
  onTagClick?: (tag: string) => void;
  isOverLimit?: boolean;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({
  stage,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onTagClick,
  isOverLimit = false,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
    data: {
      type: 'Column',
      stage,
    },
  });

  const cardCount = cards.length;
  const isAtLimit = stage.wipLimit && cardCount >= stage.wipLimit;
  const showWarning = isOverLimit || isAtLimit;

  return (
    <div
      ref={setNodeRef}
      className={`droppable-column glass-surface ${isOver ? 'is-over' : ''} ${showWarning ? 'wip-warning' : ''}`}
    >
      <div className="column-header">
        <span className="column-icon">{stage.icon}</span>
        <h2 className="column-title">{stage.title}</h2>
        {stage.wipLimit && (
          <span className={`wip-limit ${isAtLimit ? 'at-limit' : ''} ${isOverLimit ? 'over-limit' : ''}`}>
            {cardCount} / {stage.wipLimit}
          </span>
        )}
      </div>

      <div className="column-description">
        <p>{stage.description}</p>
      </div>

      <div className="column-body">
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.length === 0 ? (
            <div className="empty-state">
              <p>No cards yet</p>
              <button className="btn-glass" onClick={() => onAddCard?.(stage.id)}>
                + Add Card
              </button>
            </div>
          ) : (
            <div className="cards-list">
              {cards.map((card) => (
                <DraggableCard
                  key={card.id}
                  card={card}
                  onEdit={onEditCard}
                  onDelete={onDeleteCard}
                  onTagClick={onTagClick}
                />
              ))}
            </div>
          )}
        </SortableContext>

        {cards.length > 0 && (
          <button
            className="btn-glass add-card-btn"
            onClick={() => onAddCard?.(stage.id)}
            style={{ marginTop: '12px', width: '100%' }}
          >
            + Add Card
          </button>
        )}
      </div>

      {showWarning && (
        <div className="wip-warning-message">
          {isOverLimit ? '⚠️ Over WIP limit!' : '⚠️ At WIP limit'}
        </div>
      )}
    </div>
  );
};

export default DroppableColumn;
