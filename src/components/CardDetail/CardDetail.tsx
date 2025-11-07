import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBoardStore } from '@stores/boardStore';
import { useUIStore } from '@stores/uiStore';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Card, CardId } from '../../types/index';
import './CardDetail.css';

const CardDetail = () => {
  const { cardDetailOpen, activeCardId, closeCardDetail } = useUIStore();
  const { cards, updateCard, deleteCard } = useBoardStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState<Partial<Card>>({});

  const card = activeCardId ? cards.get(activeCardId as CardId) : null;

  useEffect(() => {
    if (card && cardDetailOpen) {
      setEditedCard({
        title: card.title,
        description: card.description,
        priority: card.priority,
        effortPoints: card.effortPoints,
      });
      setIsEditing(false);
    }
  }, [card, cardDetailOpen]);

  if (!cardDetailOpen || !card) return null;

  const handleSave = () => {
    if (!activeCardId) return;

    updateCard(activeCardId as CardId, editedCard);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!activeCardId) return;
    if (confirm('Are you sure you want to delete this card?')) {
      deleteCard(activeCardId as CardId);
      closeCardDetail();
    }
  };

  const handleArchive = () => {
    if (!activeCardId) return;
    updateCard(activeCardId as CardId, { isArchived: true });
    closeCardDetail();
  };

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={closeCardDetail}>
        <motion.div
          className="card-detail-modal glass-heavy"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Priority indicator */}
          {card.priority && (
            <div
              className="priority-bar"
              data-priority={card.priority.toLowerCase()}
            />
          )}

          <div className="modal-header">
            {isEditing ? (
              <input
                className="input-glass title-input"
                value={editedCard.title || ''}
                onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
                placeholder="Card title"
              />
            ) : (
              <h2>{card.title}</h2>
            )}

            <div className="header-actions">
              {isEditing ? (
                <>
                  <button className="btn-glass" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button className="btn-glass btn-glass-emerald" onClick={handleSave}>
                    Save
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-glass" onClick={() => setIsEditing(true)}>
                    Edit
                  </button>
                  <button className="close-btn" onClick={closeCardDetail}>
                    ✕
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="modal-body">
            {/* Metadata */}
            <div className="metadata-grid">
              <div className="metadata-item">
                <span className="metadata-label">Stage</span>
                <span className="metadata-value stage-badge">{card.stage}</span>
              </div>

              <div className="metadata-item">
                <span className="metadata-label">Priority</span>
                {isEditing ? (
                  <select
                    className="input-glass metadata-select"
                    value={editedCard.priority || ''}
                    onChange={(e) => setEditedCard({ ...editedCard, priority: e.target.value as Card['priority'] || undefined })}
                  >
                    <option value="">None</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                ) : (
                  <span className="metadata-value priority-badge" data-priority={card.priority?.toLowerCase()}>
                    {card.priority || 'None'}
                  </span>
                )}
              </div>

              <div className="metadata-item">
                <span className="metadata-label">Effort</span>
                {isEditing ? (
                  <select
                    className="input-glass metadata-select"
                    value={editedCard.effortPoints || ''}
                    onChange={(e) => setEditedCard({ ...editedCard, effortPoints: e.target.value ? Number(e.target.value) : undefined })}
                  >
                    <option value="">None</option>
                    <option value="1">1 pt</option>
                    <option value="2">2 pts</option>
                    <option value="3">3 pts</option>
                    <option value="5">5 pts</option>
                    <option value="8">8 pts</option>
                    <option value="13">13 pts</option>
                  </select>
                ) : (
                  <span className="metadata-value">
                    {card.effortPoints ? `${card.effortPoints} pts` : 'None'}
                  </span>
                )}
              </div>

              <div className="metadata-item">
                <span className="metadata-label">Created</span>
                <span className="metadata-value">
                  {new Date(card.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Tags */}
            {card.tags && card.tags.length > 0 && (
              <div className="card-section">
                <h3>Tags</h3>
                <div className="tags-list">
                  {card.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="tag-pill"
                      style={{
                        '--tag-color': tag.color || '#4FD1FF',
                      } as React.CSSProperties}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="card-section">
              <h3>Description</h3>
              {isEditing ? (
                <textarea
                  className="input-glass textarea"
                  value={editedCard.description || ''}
                  onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
                  placeholder="Add a description (Markdown supported)"
                  rows={10}
                />
              ) : card.description ? (
                <div className="markdown-content">
                  <ReactMarkdown
                    components={{
                      code({ className, children }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;
                        return !isInline && match ? (
                          <SyntaxHighlighter
                            style={oneDark as any}
                            language={match[1]}
                            PreTag="div"
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className}>{children}</code>
                        );
                      },
                    }}
                  >
                    {card.description}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="empty-text">No description provided</p>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-glass btn-glass-purple" onClick={handleArchive}>
              Archive
            </button>
            <button className="btn-glass" style={{ marginLeft: 'auto', borderColor: 'rgba(244, 114, 182, 0.3)', color: 'var(--neon-pink)' }} onClick={handleDelete}>
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CardDetail;
