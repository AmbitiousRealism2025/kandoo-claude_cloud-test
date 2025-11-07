import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBoardStore } from '@stores/boardStore';
import { useUIStore } from '@stores/uiStore';
import type { Card, Tag, TagId } from '../../types/index';
import './CardComposer.css';

const CardComposer = () => {
  const { cardComposerOpen, cardComposerStage, closeCardComposer } = useUIStore();
  const { createCard, tags, createTag } = useBoardStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Card['priority']>(undefined);
  const [effortPoints, setEffortPoints] = useState<number | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    if (!cardComposerOpen) {
      // Reset form when closed
      setTitle('');
      setDescription('');
      setPriority(undefined);
      setEffortPoints(undefined);
      setSelectedTags([]);
      setNewTagName('');
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

  const handleAddTag = () => {
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
        color: '#4FD1FF',
      });

      const newTag: Tag = {
        id: tagId,
        name: newTagName.trim(),
        category: 'custom',
        color: '#4FD1FF',
        count: 0,
        lastUsed: new Date(),
      };

      setSelectedTags([...selectedTags, newTag]);
    }

    setNewTagName('');
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
              <div className="tags-input-container">
                <input
                  type="text"
                  className="input-glass"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  className="btn-glass"
                  onClick={handleAddTag}
                  disabled={!newTagName.trim()}
                >
                  Add
                </button>
              </div>

              {selectedTags.length > 0 && (
                <div className="selected-tags">
                  {selectedTags.map(tag => (
                    <span key={tag.id} className="tag-pill">
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
