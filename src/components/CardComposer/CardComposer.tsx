import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBoardStore } from '@stores/boardStore';
import { useUIStore } from '@stores/uiStore';
import type { Card, Tag, TagId } from '../../types/index';
import './CardComposer.css';

// Pre-made tags for vibe coders
const PRESET_TAGS = [
  { name: 'bug', color: '#FF6B6B', category: 'type' },
  { name: 'feature', color: '#51CF66', category: 'type' },
  { name: 'refactor', color: '#4FD1FF', category: 'type' },
  { name: 'docs', color: '#FFD93D', category: 'type' },
  { name: 'test', color: '#A78BFA', category: 'type' },
  { name: 'performance', color: '#FFA94D', category: 'type' },
  { name: 'security', color: '#F472B6', category: 'type' },
  { name: 'frontend', color: '#22D3EE', category: 'scope' },
  { name: 'backend', color: '#2DD4BF', category: 'scope' },
  { name: 'api', color: '#06B6D4', category: 'scope' },
  { name: 'database', color: '#0891B2', category: 'scope' },
  { name: 'urgent', color: '#EF4444', category: 'priority' },
  { name: 'blocked', color: '#6B7280', category: 'priority' },
  { name: 'ready', color: '#10B981', category: 'priority' },
  { name: 'review', color: '#8B5CF6', category: 'priority' },
] as const;

const COLOR_OPTIONS = [
  '#FF6B6B', '#51CF66', '#4FD1FF', '#FFD93D', '#A78BFA',
  '#FFA94D', '#F472B6', '#22D3EE', '#2DD4BF', '#06B6D4',
  '#EF4444', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B',
];

const CardComposer = () => {
  const { cardComposerOpen, cardComposerStage, closeCardComposer } = useUIStore();
  const { createCard, tags, createTag } = useBoardStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Card['priority']>(undefined);
  const [effortPoints, setEffortPoints] = useState<number | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#4FD1FF');
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);

  useEffect(() => {
    if (!cardComposerOpen) {
      // Reset form when closed
      setTitle('');
      setDescription('');
      setPriority(undefined);
      setEffortPoints(undefined);
      setSelectedTags([]);
      setNewTagName('');
      setNewTagColor('#4FD1FF');
      setShowCustomTagInput(false);
    }
  }, [cardComposerOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !cardComposerStage) return;

    createCard(cardComposerStage as any, {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      effortPoints,
      tags: selectedTags,
    });

    closeCardComposer();
  };

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

  if (!cardComposerOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={closeCardComposer}>
        <motion.div
          className="card-composer-modal glass-heavy"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Create New Card</h2>
            <button className="close-btn" onClick={closeCardComposer}>
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="composer-form">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                id="title"
                type="text"
                className="input-glass"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description (Markdown supported)</label>
              <textarea
                id="description"
                className="input-glass textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details, code snippets, etc..."
                rows={6}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  className="input-glass"
                  value={priority || ''}
                  onChange={(e) => setPriority(e.target.value as Card['priority'] || undefined)}
                >
                  <option value="">None</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="effort">Effort Points</label>
                <select
                  id="effort"
                  className="input-glass"
                  value={effortPoints || ''}
                  onChange={(e) => setEffortPoints(e.target.value ? Number(e.target.value) : undefined)}
                >
                  <option value="">None</option>
                  <option value="1">1 - Trivial</option>
                  <option value="2">2 - Easy</option>
                  <option value="3">3 - Medium</option>
                  <option value="5">5 - Complex</option>
                  <option value="8">8 - Very Complex</option>
                  <option value="13">13 - Epic</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Tags</label>

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

            <div className="form-actions">
              <button type="button" className="btn-glass" onClick={closeCardComposer}>
                Cancel
              </button>
              <button type="submit" className="btn-glass btn-glass-emerald" disabled={!title.trim()}>
                Create Card
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CardComposer;
