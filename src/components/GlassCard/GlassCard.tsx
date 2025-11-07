import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface GlassCardProps {
  card: Card;
  onEdit?: (card: Card) => void;
  onDelete?: (cardId: string) => void;
  onTagClick?: (tag: string) => void;
  isDragging?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  card,
  onEdit,
  onDelete,
  onTagClick,
  isDragging = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Energy tag colors
  const getEnergyTagColor = (tag: string): string => {
    const colors: Record<string, string> = {
      '🔥 On Fire': 'var(--neon-orange)',
      '🧊 Blocked': 'var(--neon-cyan)',
      '⏸️ Paused': 'var(--base-500)',
      '🌊 Flowing': 'var(--neon-purple)',
    };
    return colors[tag] || 'var(--neon-cyan)';
  };
  
  // Priority colors with gradients for better visual distinction
  const getPriorityColor = (priority?: string): string => {
    const colors: Record<string, string> = {
      'Critical': 'linear-gradient(90deg, #FF5370, #F78C6C)',  // Red to Orange
      'High': 'linear-gradient(90deg, #F78C6C, #FFCB6B)',      // Orange to Yellow
      'Medium': 'linear-gradient(90deg, #FFCB6B, #C3E88D)',    // Yellow to Green
      'Low': 'linear-gradient(90deg, #C3E88D, #89DDFF)',       // Green to Cyan
    };
    return colors[priority || ''] || 'transparent';
  };

  const getPriorityShadowColor = (priority?: string): string => {
    const colors: Record<string, string> = {
      'Critical': 'rgba(255, 83, 112, 0.6)',
      'High': 'rgba(247, 140, 108, 0.6)',
      'Medium': 'rgba(255, 203, 107, 0.6)',
      'Low': 'rgba(195, 232, 141, 0.6)',
    };
    return colors[priority || ''] || 'transparent';
  };
  
  return (
    <motion.div
      className="glass-card"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0,
        scale: isDragging ? 1.05 : 1,
      }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        background: isHovered 
          ? 'linear-gradient(135deg, rgba(14, 24, 42, 0.55), rgba(14, 24, 42, 0.75))'
          : 'linear-gradient(135deg, rgba(14, 24, 42, 0.45), rgba(14, 24, 42, 0.68))',
        backdropFilter: 'blur(12px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.8)',
        border: '1px solid',
        borderImage: `linear-gradient(135deg, rgba(79, 209, 255, 0.25), rgba(192, 132, 252, 0.15)) 1`,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: isHovered
          ? `inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
             inset 0 -1px 0 0 rgba(255, 255, 255, 0.04),
             0 0 30px rgba(79, 209, 255, 0.15)`
          : `inset 0 1px 0 0 rgba(255, 255, 255, 0.05),
             inset 0 -1px 0 0 rgba(255, 255, 255, 0.02)`,
        transition: 'all 0.3s cubic-bezier(0.43, 0.13, 0.23, 0.96)',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      {/* Priority indicator */}
      {card.priority && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: getPriorityColor(card.priority),
            borderRadius: '12px 12px 0 0',
            boxShadow: `0 0 15px ${getPriorityShadowColor(card.priority)}`,
          }}
        />
      )}
      
      {/* Card header */}
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--base-100)',
          marginBottom: '4px',
          fontFamily: 'var(--font-ui)',
        }}>
          {card.title}
        </h3>
        
        {/* Effort points and Priority badge */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {card.effortPoints && (
            <span style={{
              fontSize: '12px',
              color: 'var(--base-400)',
              background: 'rgba(79, 209, 255, 0.1)',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(79, 209, 255, 0.2)',
            }}>
              {card.effortPoints} pts
            </span>
          )}
          {card.priority && (
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              color: '#fff',
              background: getPriorityColor(card.priority),
              padding: '3px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: `0 0 8px ${getPriorityShadowColor(card.priority)}`,
            }}>
              {card.priority}
            </span>
          )}
        </div>
      </div>
      
      {/* Card description with markdown support */}
      {card.description && (
        <div style={{
          fontSize: '14px',
          color: 'var(--base-200)',
          marginBottom: '12px',
          maxHeight: '150px',
          overflow: 'auto',
        }}>
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
                  <code
                    className={className}
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '2px 4px',
                      borderRadius: '3px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-code)',
                    }}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {card.description}
          </ReactMarkdown>
        </div>
      )}
      
      {/* Tags */}
      {card.tags && card.tags.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '12px',
        }}>
          {card.tags.map(tag => (
            <motion.span
              key={tag.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTagClick?.(tag.name)}
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(79, 209, 255, 0.1)',
                border: '1px solid rgba(79, 209, 255, 0.3)',
                color: getEnergyTagColor(tag.name),
                cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                boxShadow: isHovered ? `0 0 10px ${getEnergyTagColor(tag.name)}40` : 'none',
              }}
            >
              {tag.name}
            </motion.span>
          ))}
        </div>
      )}
      
      {/* Activity sparkline */}
      {card.momentum && (
        <div style={{
          height: '20px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '2px',
        }}>
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${Math.random() * 100}%`,
                background: 'linear-gradient(180deg, var(--neon-cyan), var(--neon-purple))',
                borderRadius: '2px',
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Quick actions (visible on hover) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          display: 'flex',
          gap: '4px',
        }}
      >
        <button
          onClick={() => onEdit?.(card)}
          style={{
            padding: '6px',
            background: 'rgba(79, 209, 255, 0.1)',
            border: '1px solid rgba(79, 209, 255, 0.3)',
            borderRadius: '6px',
            color: 'var(--neon-cyan)',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(card.id)}
          style={{
            padding: '6px',
            background: 'rgba(244, 114, 182, 0.1)',
            border: '1px solid rgba(244, 114, 182, 0.3)',
            borderRadius: '6px',
            color: 'var(--neon-pink)',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Delete
        </button>
      </motion.div>
      
      {/* Shimmer effect */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '200%' : '-100%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  );
};

// Memoize to prevent unnecessary re-renders
export default React.memo(GlassCard);
