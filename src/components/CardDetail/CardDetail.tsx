import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBoardStore } from '@stores/boardStore';
import { useUIStore } from '@stores/uiStore';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Card, CardId, Tag, TagId } from '../../types/index';
import './CardDetail.css';

// Pre-made tags for vibe coders
const PRESET_TAGS = [
  { name: 'bug', color: '#FF6B6B', category: 'custom' },
  { name: 'feature', color: '#51CF66', category: 'custom' },
  { name: 'refactor', color: '#4FD1FF', category: 'custom' },
  { name: 'docs', color: '#FFD93D', category: 'custom' },
  { name: 'test', color: '#A78BFA', category: 'custom' },
  { name: 'performance', color: '#FFA94D', category: 'custom' },
  { name: 'security', color: '#F472B6', category: 'custom' },
  { name: 'frontend', color: '#22D3EE', category: 'custom' },
  { name: 'backend', color: '#2DD4BF', category: 'custom' },
  { name: 'api', color: '#06B6D4', category: 'custom' },
  { name: 'database', color: '#0891B2', category: 'custom' },
  { name: 'urgent', color: '#EF4444', category: 'custom' },
  { name: 'blocked', color: '#6B7280', category: 'custom' },
  { name: 'ready', color: '#10B981', category: 'custom' },
  { name: 'review', color: '#8B5CF6', category: 'custom' },
] as const;

const COLOR_OPTIONS = [
  '#FF6B6B', '#51CF66', '#4FD1FF', '#FFD93D', '#A78BFA',
  '#FFA94D', '#F472B6', '#22D3EE', '#2DD4BF', '#06B6D4',
  '#EF4444', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B',
];

const CardDetail = () => {
  const { cardDetailOpen, activeCardId, closeCardDetail } = useUIStore();
  const { cards, updateCard, deleteCard, tags, createTag } = useBoardStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState<Partial<Card>>({});
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#4FD1FF');
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);

  const card = activeCardId ? cards.get(activeCardId as CardId) : null;

  useEffect(() => {
    if (card && cardDetailOpen) {
      setEditedCard({
        title: card.title,
        description: card.description,
        priority: card.priority,
        effortPoints: card.effortPoints,
      });
      setSelectedTags(card.tags || []);
      setIsEditing(false);
    }
  }, [card, cardDetailOpen]);

  const handleSelectPresetTag = (presetTag: typeof PRESET_TAGS[number]) => {
    // Check if tag already exists in store
    const existingTag = tags.find(t => t.name.toLowerCase() === presetTag.name.toLowerCase());

    if (existingTag) {
      if (!selectedTags.find(t => t.id === existingTag.id)) {
        setSelectedTags([...selectedTags, existingTag]);
      }
    } else {
      // Create new tag in store
      const tagId = createTag({
        name: presetTag.name,
        category: presetTag.category,
        color: presetTag.color,
      });

      const newTag: Tag = {
        id: tagId,
        name: presetTag.name,
        category: presetTag.category,
        color: presetTag.color,
        count: 0,
        lastUsed: new Date(),
      };

      setSelectedTags([...selectedTags, newTag]);
    }
  };

  const handleAddCustomTag = () => {
    if (!newTagName.trim()) return;

    const existingTag = tags.find(t => t.name.toLowerCase() === newTagName.toLowerCase());

    if (existingTag) {
      if (!selectedTags.find(t => t.id === existingTag.id)) {
        setSelectedTags([...selectedTags, existingTag]);
      }
    } else {
      const tagId = createTag({
        name: newTagName.trim(),
        category: 'custom',
        color: newTagColor,
      });

      const newTag: Tag = {
        id: tagId,
        name: newTagName.trim(),
        category: 'custom',
        color: newTagColor,
        count: 0,
        lastUsed: new Date(),
      };

      setSelectedTags([...selectedTags, newTag]);
    }

    setNewTagName('');
    setNewTagColor('#4FD1FF');
    setShowCustomTagInput(false);
  };

  const handleRemoveTag = (tagId: TagId) => {
    setSelectedTags(selectedTags.filter(t => t.id !== tagId));
  };

  if (!cardDetailOpen || !card) return null;

  const handleSave = () => {
    if (!activeCardId) return;

    updateCard(activeCardId as CardId, {
      ...editedCard,
      tags: selectedTags,
    });
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

            {/* Tags Section - Edit Mode */}
            {isEditing && (
              <div className="card-section">
                <h3>Tags</h3>

                {/* Preset Tags */}
                <div className="preset-tags-section">
                  <p className="preset-tags-label">Quick Select:</p>
                  <div className="preset-tags-grid">
                    {PRESET_TAGS.map((presetTag) => {
                      const isSelected = selectedTags.some(t => t.name.toLowerCase() === presetTag.name.toLowerCase());
                      return (
                        <button
                          key={presetTag.name}
                          type="button"
                          className={`preset-tag-btn ${isSelected ? 'selected' : ''}`}
                          style={{
                            '--tag-color': presetTag.color,
                          } as React.CSSProperties}
                          onClick={() => handleSelectPresetTag(presetTag)}
                          disabled={isSelected}
                        >
                          {presetTag.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Tag Input */}
                {!showCustomTagInput ? (
                  <button
                    type="button"
                    className="btn-glass btn-add-custom-tag"
                    onClick={() => setShowCustomTagInput(true)}
                  >
                    + Add a Custom Tag
                  </button>
                ) : (
                  <div className="custom-tag-section">
                    <div className="custom-tag-input-row">
                      <input
                        type="text"
                        className="input-glass"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomTag();
                          }
                        }}
                        placeholder="Custom tag name..."
                        autoFocus
                      />
                      <div className="color-picker-wrapper">
                        <label className="color-picker-label">Color:</label>
                        <div className="color-options">
                          {COLOR_OPTIONS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`color-option ${newTagColor === color ? 'selected' : ''}`}
                              style={{ backgroundColor: color }}
                              onClick={() => setNewTagColor(color)}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="custom-tag-actions">
                      <button
                        type="button"
                        className="btn-glass btn-sm"
                        onClick={() => {
                          setShowCustomTagInput(false);
                          setNewTagName('');
                          setNewTagColor('#4FD1FF');
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn-glass btn-glass-emerald btn-sm"
                        onClick={handleAddCustomTag}
                        disabled={!newTagName.trim()}
                      >
                        Add Tag
                      </button>
                    </div>
                  </div>
                )}

                {/* Selected Tags Display */}
                {selectedTags.length > 0 && (
                  <div className="selected-tags">
                    <p className="selected-tags-label">Selected Tags:</p>
                    <div className="selected-tags-list">
                      {selectedTags.map(tag => (
                        <span
                          key={tag.id}
                          className="tag-pill"
                          style={{
                            '--tag-color': tag.color,
                          } as React.CSSProperties}
                        >
                          {tag.name}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag.id)}
                            className="tag-remove"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
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
