import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import GlassCard from '@components/GlassCard/GlassCard';
import type { Card } from '../../types/index';

interface DraggableCardProps {
  card: Card;
  onEdit?: (card: Card) => void;
  onDelete?: (cardId: string) => void;
  onTagClick?: (tag: string) => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  card,
  onEdit,
  onDelete,
  onTagClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <GlassCard
        card={card}
        onEdit={onEdit}
        onDelete={onDelete}
        onTagClick={onTagClick}
        isDragging={isDragging}
      />
    </div>
  );
};

export default DraggableCard;
