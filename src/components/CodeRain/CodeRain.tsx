import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nanoid } from 'nanoid';

// Code snippet library
const codeSnippets = {
  react: [
    `const [vibe, setVibe] = useState('flowing')`,
    `<Card glass={true} blur={12} />`,
    `useEffect(() => trackFlow(), [flow])`,
    `export default function KandooBoard() {`,
    `return <DragDropContext onDragEnd={handleDrop}>`,
    `const { cards, moveCard } = useKanbanStore()`,
    `<AnimatePresence mode="wait">`,
    `onClick={() => setStage('flow')}`,
    `{cards.map(card => <Card key={card.id} />)}`,
    `const isFlowing = useMemo(() => checkFlow(), [])`,
  ],
  typescript: [
    `interface FlowState { velocity: number }`,
    `type VibeLevel = 'focused' | 'flowing' | 'blocked'`,
    `const handleDrop: DragEndEvent = (e) => {`,
    `export type CardId = string & { _brand: 'CardId' }`,
    `function trackMomentum<T extends Card>(card: T): number`,
    `enum Stage { Vibes, Mapping, Flow, Proving, Shipped }`,
    `type DeepPartial<T> = { [P in keyof T]?: T[P] }`,
    `const assertNever = (x: never): never => x`,
    `Pick<Card, 'id' | 'title' | 'stage'>`,
    `Record<string, unknown>`,
  ],
  javascript: [
    `cards.filter(c => c.stage === 'flow')`,
    `await saveToLocalStorage(boardState)`,
    `const momentum = calculateVelocity(cards)`,
    `[...new Set(tags)].sort()`,
    `Promise.all(cards.map(fetchDetails))`,
    `Object.entries(metrics).reduce((acc, [k, v]) =>`,
    `try { await sync() } catch (e) { rollback() }`,
    `debounce(handleSearch, 300)`,
    `cards.slice(0, 10).map(transform)`,
    `JSON.parse(localStorage.getItem('vibe'))`,
  ],
};

// Syntax highlighting colors (Warp-inspired)
const syntaxColors = {
  keyword: '#C792EA',
  string: '#C3E88D',
  comment: '#546E7A',
  function: '#82AAFF',
  variable: '#F78C6C',
  number: '#FF5370',
  operator: '#89DDFF',
  type: '#FFCB6B',
  jsx: '#F07178',
  bracket: '#ABB2BF',
};

interface CodeSnippetType {
  id: string;
  code: string;
  x: number;
  y: number;
  size: 'xs' | 'sm' | 'md' | 'lg';
  speed: number;
  opacity: number;
  rotation: number;
  layer: 1 | 2 | 3;
}

// Simple tokenizer for syntax highlighting
const tokenizeCode = (code: string): React.ReactElement => {
  const tokens = code.split(/(\s+|[{}()\[\]<>,;.])/g);
  
  return (
    <>
      {tokens.map((token, i) => {
        let color = syntaxColors.variable;
        
        // Simple keyword detection
        if (['const', 'let', 'var', 'function', 'return', 'export', 'import', 'if', 'else'].includes(token)) {
          color = syntaxColors.keyword;
        } else if (['interface', 'type', 'enum'].includes(token)) {
          color = syntaxColors.type;
        } else if (token.startsWith('<') || token.startsWith('/>')) {
          color = syntaxColors.jsx;
        } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith('`')) {
          color = syntaxColors.string;
        } else if (/^\d+$/.test(token)) {
          color = syntaxColors.number;
        } else if (['=', '==', '===', '=>', '!', '&&', '||'].includes(token)) {
          color = syntaxColors.operator;
        } else if (/^[A-Z]/.test(token)) {
          color = syntaxColors.type;
        } else if (/^[{}()\[\]]$/.test(token)) {
          color = syntaxColors.bracket;
        }
        
        return (
          <span key={i} style={{ color }}>
            {token}
          </span>
        );
      })}
    </>
  );
};

interface CodeRainProps {
  intensity?: 'off' | 'low' | 'medium' | 'high';
}

const CodeRain: React.FC<CodeRainProps> = ({ intensity = 'medium' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [snippets, setSnippets] = useState<CodeSnippetType[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastAddTimeRef = useRef<number>(0);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Intensity settings
  const intensityConfig = {
    off: { count: 0, interval: 0 },
    low: { count: 8, interval: 3000 },
    medium: { count: 15, interval: 2000 },
    high: { count: 25, interval: 1000 },
  };

  const config = intensityConfig[intensity];
  
  // Generate random snippet
  const generateSnippet = (): CodeSnippetType => {
    const allSnippets = [...codeSnippets.react, ...codeSnippets.typescript, ...codeSnippets.javascript];
    const sizes: Array<'xs' | 'sm' | 'md' | 'lg'> = ['xs', 'xs', 'xs', 'sm', 'sm', 'md', 'lg'];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    
    // Layer determines opacity and speed
    const layer = Math.random() < 0.5 ? 1 : Math.random() < 0.75 ? 2 : 3;
    const layerConfig = {
      1: { opacity: 0.15, speedMultiplier: 1.5 },
      2: { opacity: 0.25, speedMultiplier: 1.0 },
      3: { opacity: 0.35, speedMultiplier: 0.8 },
    };
    
    return {
      id: nanoid(),
      code: allSnippets[Math.floor(Math.random() * allSnippets.length)],
      x: Math.random() * 100,
      y: -10,
      size,
      speed: (15 + Math.random() * 45) * layerConfig[layer].speedMultiplier,
      opacity: layerConfig[layer].opacity,
      rotation: -5 + Math.random() * 10,
      layer,
    };
  };
  
  // Animation loop
  useEffect(() => {
    if (prefersReducedMotion || intensity === 'off') return;

    let lastTime = performance.now();
    const targetSnippetCount = config.count;
    const addInterval = config.interval;
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Add new snippets periodically
      if (currentTime - lastAddTimeRef.current > addInterval && snippets.length < targetSnippetCount) {
        setSnippets(prev => [...prev, generateSnippet()]);
        lastAddTimeRef.current = currentTime;
      }
      
      // Update snippet positions
      setSnippets(prev => {
        return prev
          .map(snippet => ({
            ...snippet,
            y: snippet.y + (deltaTime / 1000) * (100 / snippet.speed) * 100,
          }))
          .filter(snippet => snippet.y < 110); // Remove snippets that have left the screen
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [prefersReducedMotion, intensity, config, snippets.length]);
  
  if (prefersReducedMotion) {
    // Fallback for reduced motion
    return (
      <div className="code-rain-fallback" style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(3, 7, 18, 0.9) 0%, rgba(3, 7, 18, 1) 100%)',
        zIndex: 0,
      }} />
    );
  }
  
  return (
    <div
      ref={containerRef}
      className="code-rain-container"
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <AnimatePresence>
        {snippets.map(snippet => {
          const fontSize = {
            xs: '10px',
            sm: '12px',
            md: '14px',
            lg: '18px',
          }[snippet.size];
          
          return (
            <motion.div
              key={snippet.id}
              className="code-snippet"
              initial={{ opacity: 0 }}
              animate={{ opacity: snippet.opacity }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                left: `${snippet.x}%`,
                top: `${snippet.y}%`,
                fontSize,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                whiteSpace: 'nowrap',
                transform: `rotate(${snippet.rotation}deg)`,
                zIndex: snippet.layer,
                filter: snippet.layer === 1 ? 'blur(0.5px)' : 'none',
              }}
            >
              {tokenizeCode(snippet.code)}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default CodeRain;
