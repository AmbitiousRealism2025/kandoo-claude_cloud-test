# Code Rain System Specification

## Overview

The Code Rain system creates a living, breathing development environment where actual code snippets float from top to bottom, with proper syntax highlighting that matches modern terminal aesthetics like Warp or Fig.

## Architecture

### Core Data Structure

```typescript
interface CodeSnippet {
  id: string;
  code: string;
  language: 'jsx' | 'typescript' | 'javascript';
  size: 'xs' | 'sm' | 'md' | 'lg';
  speed: number; // 15-60 seconds for full traverse
  xPosition: number; // 0-100 percentage
  opacity: number; // 0.15-0.4
  rotation: number; // -5 to 5 degrees
  layer: 1 | 2 | 3; // z-index layer
  syntaxTokens: Token[];
}

interface Token {
  text: string;
  type: TokenType;
  color: string;
}

type TokenType = 
  | 'keyword'    // const, let, function, if, return
  | 'string'     // string literals
  | 'comment'    // comments
  | 'function'   // function names
  | 'variable'   // variable names
  | 'number'     // numeric literals
  | 'operator'   // =, +, -, *, /, ===
  | 'type'       // TypeScript types
  | 'jsx'        // JSX tags
  | 'bracket';   // {}, [], ()
```

## Snippet Library

### React Snippets
```javascript
const reactSnippets = [
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
];
```

### TypeScript Snippets
```javascript
const typeScriptSnippets = [
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
];
```

### JavaScript Patterns
```javascript
const jsSnippets = [
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
];
```

## Syntax Highlighting Theme

### Warp-Inspired Color Palette

```css
:root {
  /* Modern Terminal Palette */
  --syntax-keyword: #C792EA;     /* Purple - const, let, function, return */
  --syntax-string: #C3E88D;      /* Lime green - string literals */
  --syntax-comment: #546E7A;     /* Muted gray - comments */
  --syntax-function: #82AAFF;    /* Sky blue - function names */
  --syntax-variable: #F78C6C;    /* Orange - variables */
  --syntax-number: #FF5370;      /* Red - numbers */
  --syntax-operator: #89DDFF;    /* Cyan - operators */
  --syntax-type: #FFCB6B;        /* Yellow - types/interfaces */
  --syntax-jsx: #F07178;         /* Pink - JSX tags */
  --syntax-bracket: #ABB2BF;     /* Light gray - brackets */
  --syntax-punctuation: #909090; /* Dark gray - semicolons, commas */
}
```

## Animation Configuration

### Layer System

```typescript
interface Layer {
  id: 1 | 2 | 3;
  config: {
    opacity: number;
    sizeMultiplier: number;
    speedMultiplier: number;
    density: number; // snippets per viewport
    zIndex: number;
  };
}

const layers: Layer[] = [
  {
    id: 1,
    config: {
      opacity: 0.15,
      sizeMultiplier: 0.7,
      speedMultiplier: 1.5,
      density: 8,
      zIndex: 1,
    },
  },
  {
    id: 2,
    config: {
      opacity: 0.25,
      sizeMultiplier: 1.0,
      speedMultiplier: 1.0,
      density: 6,
      zIndex: 2,
    },
  },
  {
    id: 3,
    config: {
      opacity: 0.35,
      sizeMultiplier: 1.3,
      speedMultiplier: 0.8,
      density: 4,
      zIndex: 3,
    },
  },
];
```

### Physics Configuration

```javascript
const physicsConfig = {
  // Size distribution (weighted random)
  sizeDistribution: {
    xs: 0.4,  // 40% - 10px font
    sm: 0.3,  // 30% - 12px font
    md: 0.2,  // 20% - 14px font
    lg: 0.1,  // 10% - 18px font
  },
  
  // Speed range in seconds for full traverse
  speedRange: {
    min: 15,
    max: 60,
  },
  
  // Horizontal distribution
  xPositionVariance: {
    min: 0,
    max: 100,
    clustering: 0.3, // Tendency to cluster in lanes
  },
  
  // Rotation for natural movement
  rotationRange: {
    min: -5,
    max: 5,
  },
  
  // Opacity settings
  opacityRange: {
    min: 0.15,
    max: 0.4,
  },
};
```

### CSS Animation

```css
.code-snippet {
  position: absolute;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  white-space: nowrap;
  pointer-events: none;
  will-change: transform;
  animation: codeRain var(--duration) linear infinite;
  animation-delay: var(--delay);
  transform: rotate(var(--rotation));
  opacity: var(--opacity);
  filter: blur(var(--blur));
}

@keyframes codeRain {
  0% {
    transform: translateY(-100px) translateX(var(--drift)) 
               rotate(var(--rotation));
    opacity: 0;
  }
  5% {
    opacity: var(--opacity);
  }
  95% {
    opacity: var(--opacity);
  }
  100% {
    transform: translateY(calc(100vh + 100px)) 
               translateX(calc(var(--drift) * 1.5)) 
               rotate(var(--rotation));
    opacity: 0;
  }
}

/* Subtle drift effect */
@keyframes drift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(var(--drift-amount)); }
}
```

## Performance Optimizations

### Rendering Strategy

```typescript
class CodeRainOptimizer {
  private visibleSnippets: Set<string> = new Set();
  private snippetPool: CodeSnippet[] = [];
  private recycledSnippets: CodeSnippet[] = [];
  
  // Virtual scrolling - only render visible snippets
  updateVisibleSnippets(viewport: Viewport) {
    const buffer = 200; // px above and below viewport
    
    this.snippetPool.forEach(snippet => {
      const isVisible = this.isInViewport(snippet, viewport, buffer);
      
      if (isVisible && !this.visibleSnippets.has(snippet.id)) {
        this.renderSnippet(snippet);
        this.visibleSnippets.add(snippet.id);
      } else if (!isVisible && this.visibleSnippets.has(snippet.id)) {
        this.hideSnippet(snippet);
        this.visibleSnippets.delete(snippet.id);
      }
    });
  }
  
  // Recycle snippets instead of creating new ones
  getSnippet(): CodeSnippet {
    return this.recycledSnippets.pop() || this.createSnippet();
  }
  
  recycleSnippet(snippet: CodeSnippet) {
    this.recycledSnippets.push(snippet);
  }
}
```

### GPU Acceleration

```css
.code-rain-container {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.code-snippet {
  transform: translate3d(0, 0, 0);
  will-change: transform, opacity;
}
```

### Memory Management

```javascript
const memoryConfig = {
  maxSnippets: 50,        // Maximum concurrent snippets
  poolSize: 100,          // Pre-allocated snippet pool
  recycleThreshold: 0.8,  // Start recycling at 80% capacity
  gcInterval: 30000,      // Garbage collection every 30s
};
```

## Responsive Behavior

```typescript
interface ResponsiveConfig {
  breakpoint: string;
  layers: number;
  density: number;
  enabled: boolean;
}

const responsiveConfigs: ResponsiveConfig[] = [
  {
    breakpoint: 'mobile',     // < 768px
    layers: 1,
    density: 3,
    enabled: true,
  },
  {
    breakpoint: 'tablet',     // 768px - 1200px
    layers: 2,
    density: 5,
    enabled: true,
  },
  {
    breakpoint: 'desktop',    // 1200px - 2000px
    layers: 3,
    density: 8,
    enabled: true,
  },
  {
    breakpoint: 'ultrawide',  // > 2000px
    layers: 3,
    density: 12,
    enabled: true,
  },
];
```

## Accessibility

```javascript
const accessibilityConfig = {
  // Respect reduced motion preference
  respectReducedMotion: true,
  
  // Alternative for reduced motion
  reducedMotionFallback: 'static-gradient',
  
  // ARIA labels
  ariaLabel: 'Decorative code animation background',
  
  // Focus management
  preventFocusCapture: true,
  
  // Settings
  userControls: {
    toggle: true,
    intensity: ['low', 'medium', 'high', 'off'],
    speed: ['slow', 'normal', 'fast'],
  },
};
```

## Dynamic Content

### Context-Aware Snippets

```javascript
function getContextualSnippets(activeColumn: string): string[] {
  const contextMap = {
    vibes: [
      `// TODO: brilliant idea`,
      `useState('inspired')`,
      `brainstorm.push(idea)`,
      `createConcept()`,
    ],
    mapping: [
      `interface ProjectPlan {}`,
      `const roadmap = defineSteps()`,
      `type Sprint = Week[]`,
      `plan.validate()`,
    ],
    flow: [
      `async function implement()`,
      `while (flowing) { code() }`,
      `commits.push(changes)`,
      `refactor(codebase)`,
    ],
    proving: [
      `expect(result).toBe(expected)`,
      `test('should work', () =>`,
      `assert.equal(actual, expected)`,
      `coverage: 98.5%`,
    ],
    shipped: [
      `deploy({ production: true })`,
      `release: 'v1.0.0'`,
      `celebrate() 🎉`,
      `metrics.track('success')`,
    ],
  };
  
  return contextMap[activeColumn] || [];
}
```

### Syntax Tokenizer

```javascript
class SyntaxTokenizer {
  private keywords = new Set([
    'const', 'let', 'var', 'function', 'async', 'await',
    'if', 'else', 'for', 'while', 'return', 'import', 
    'export', 'default', 'class', 'extends', 'new',
  ]);
  
  private operators = new Set([
    '=', '==', '===', '!=', '!==', '<', '>', '<=', '>=',
    '+', '-', '*', '/', '%', '&&', '||', '!', '?', ':',
  ]);
  
  tokenize(code: string): Token[] {
    const tokens: Token[] = [];
    const regex = /(\w+|"[^"]*"|'[^']*'|`[^`]*`|\/\/.*|[^\w\s])/g;
    
    let match;
    while ((match = regex.exec(code)) !== null) {
      const text = match[0];
      const type = this.getTokenType(text);
      const color = this.getTokenColor(type);
      
      tokens.push({ text, type, color });
    }
    
    return tokens;
  }
  
  private getTokenType(text: string): TokenType {
    if (this.keywords.has(text)) return 'keyword';
    if (this.operators.has(text)) return 'operator';
    if (/^["'`]/.test(text)) return 'string';
    if (/^\/\//.test(text)) return 'comment';
    if (/^\d+/.test(text)) return 'number';
    if (/^[A-Z]/.test(text)) return 'type';
    if (/^</.test(text)) return 'jsx';
    if (/^[{}\[\]()]/.test(text)) return 'bracket';
    if (/^[a-z]\w*\(/.test(text)) return 'function';
    return 'variable';
  }
  
  private getTokenColor(type: TokenType): string {
    const colorMap = {
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
    
    return colorMap[type] || '#FFFFFF';
  }
}
```

## Implementation Example

```typescript
// CodeRain.tsx
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCodeRainStore } from '@/stores/codeRainStore';
import { tokenizeCode } from '@/utils/syntaxHighlight';

export const CodeRain: React.FC = () => {
  const { snippets, settings } = useCodeRainStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (settings.respectReducedMotion && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    
    // Initialize code rain
    const rainController = new CodeRainController({
      container: containerRef.current,
      snippets: getSnippetLibrary(),
      settings,
    });
    
    rainController.start();
    
    return () => rainController.stop();
  }, [settings]);
  
  return (
    <div 
      ref={containerRef}
      className="code-rain-container"
      aria-hidden="true"
    >
      <AnimatePresence>
        {snippets.map(snippet => (
          <CodeSnippet key={snippet.id} snippet={snippet} />
        ))}
      </AnimatePresence>
    </div>
  );
};
```
