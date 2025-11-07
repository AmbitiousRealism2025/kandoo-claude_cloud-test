import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@stores/uiStore';
import { keyboardShortcuts } from '@hooks/useKeyboardShortcuts';
import './ShortcutsHelp.css';

const ShortcutsHelp = () => {
  const { shortcutsHelpOpen, toggleShortcutsHelp } = useUIStore();

  if (!shortcutsHelpOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={toggleShortcutsHelp}>
        <motion.div
          className="shortcuts-modal glass-heavy"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>⌨️ Keyboard Shortcuts</h2>
            <button className="close-btn" onClick={toggleShortcutsHelp}>
              ✕
            </button>
          </div>

          <div className="shortcuts-content">
            {keyboardShortcuts.map((section) => (
              <div key={section.category} className="shortcuts-section">
                <h3 className="section-title">{section.category}</h3>
                <div className="shortcuts-grid">
                  {section.shortcuts.map((shortcut, index) => (
                    <div key={index} className="shortcut-item">
                      <div className="shortcut-keys">
                        {shortcut.keys.map((key, i) => (
                          <span key={i}>
                            <kbd className="key">{key}</kbd>
                            {i < shortcut.keys.length - 1 && (
                              <span className="key-separator">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                      <div className="shortcut-description">{shortcut.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="shortcuts-footer">
            <p className="footer-tip">
              💡 <strong>Tip:</strong> Press <kbd className="key">Ctrl</kbd> + <kbd className="key">K</kbd> to open the command palette
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShortcutsHelp;
