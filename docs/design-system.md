# Design System & Visual Specifications

## Core Design Philosophy

The Kandoo VibeFlow design system embodies the intersection of natural flow states and cyberpunk aesthetics. Every visual element should feel like it exists in a space between the organic and the digital, where glass surfaces refract light like water while maintaining the precision of code.

## Color System

### Base Colors

```css
:root {
  /* Dark foundation */
  --base-900: #030712;  /* Deep navy - main background */
  --base-800: #0F172A;  /* Navy - card backgrounds */
  --base-700: #1E293B;  /* Slate - borders */
  --base-600: #334155;  /* Medium slate - subtle borders */
  --base-500: #475569;  /* Light slate - disabled state */
  --base-400: #64748B;  /* Muted text */
  --base-300: #94A3B8;  /* Secondary text */
  --base-200: #CBD5E1;  /* Primary text */
  --base-100: #E2E8F0;  /* Bright text */
  --base-50:  #F8FAFC;  /* Pure white text */
}
```

### Neon Accent Colors

```css
:root {
  /* Primary neons */
  --neon-cyan: #4FD1FF;
  --neon-purple: #C084FC;
  --neon-pink: #F472B6;
  --neon-emerald: #34D399;
  --neon-yellow: #FDE047;
  --neon-orange: #FB923C;
  
  /* Glow effects */
  --glow-cyan: 0 0 20px rgba(79, 209, 255, 0.5);
  --glow-purple: 0 0 20px rgba(192, 132, 252, 0.5);
  --glow-pink: 0 0 20px rgba(244, 114, 182, 0.5);
  --glow-emerald: 0 0 20px rgba(52, 211, 153, 0.5);
}
```

### Stage Gradients

```css
:root {
  /* Sacred stage colors */
  --gradient-vibes: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --gradient-mapping: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --gradient-flow: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  --gradient-proving: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  --gradient-shipped: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}
```

## Typography

### Font Stack

```css
:root {
  /* Display - Hero titles */
  --font-display: 'Chakra Petch', 'Orbitron', sans-serif;
  
  /* UI - Interface elements */
  --font-ui: 'Space Grotesk', 'Inter', -apple-system, sans-serif;
  
  /* Code - Monospace elements */
  --font-code: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  
  /* Body - Content text */
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### Type Scale

```css
:root {
  /* Fluid typography */
  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
  --text-3xl: clamp(2rem, 1.7rem + 1.5vw, 2.5rem);
  --text-4xl: clamp(2.5rem, 2rem + 2.5vw, 3.5rem);
  
  /* Line heights */
  --leading-tight: 1.1;
  --leading-snug: 1.3;
  --leading-normal: 1.5;
  --leading-relaxed: 1.7;
  
  /* Letter spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.02em;
  --tracking-wider: 0.04em;
}
```

## Glassmorphism System

### Glass Surfaces

```css
.glass-surface {
  /* Base glass properties */
  background: linear-gradient(
    135deg,
    rgba(14, 24, 42, 0.45),
    rgba(14, 24, 42, 0.68)
  );
  backdrop-filter: blur(12px) saturate(1.8);
  -webkit-backdrop-filter: blur(12px) saturate(1.8);
  
  /* Glass border */
  border: 1px solid;
  border-image: linear-gradient(
    135deg,
    rgba(79, 209, 255, 0.25),
    rgba(192, 132, 252, 0.15)
  ) 1;
  
  /* Inner glow */
  box-shadow: 
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05),
    inset 0 -1px 0 0 rgba(255, 255, 255, 0.02);
}

.glass-surface-hover {
  background: linear-gradient(
    135deg,
    rgba(14, 24, 42, 0.55),
    rgba(14, 24, 42, 0.75)
  );
  
  box-shadow: 
    inset 0 1px 0 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 0 rgba(255, 255, 255, 0.04),
    0 0 30px rgba(79, 209, 255, 0.15);
}
```

### Glass Variants

```css
/* Light glass - for overlays */
.glass-light {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
}

/* Heavy glass - for modals */
.glass-heavy {
  background: rgba(14, 24, 42, 0.85);
  backdrop-filter: blur(20px) saturate(2);
}

/* Frosted glass - for disabled states */
.glass-frosted {
  background: rgba(148, 163, 184, 0.1);
  backdrop-filter: blur(4px) grayscale(0.5);
}

/* Neon glass - for active/selected states */
.glass-neon {
  background: linear-gradient(
    135deg,
    rgba(79, 209, 255, 0.1),
    rgba(192, 132, 252, 0.05)
  );
  backdrop-filter: blur(12px) saturate(2);
  box-shadow: var(--glow-cyan);
}
```

## Animation System

### Spring Physics

```javascript
// Framer Motion spring configs
export const springConfigs = {
  // Snappy - for quick interactions
  snappy: {
    type: "spring",
    stiffness: 400,
    damping: 30,
  },
  
  // Smooth - for standard animations
  smooth: {
    type: "spring",
    stiffness: 100,
    damping: 20,
  },
  
  // Gentle - for subtle movements
  gentle: {
    type: "spring",
    stiffness: 50,
    damping: 15,
  },
  
  // Bouncy - for playful elements
  bouncy: {
    type: "spring",
    stiffness: 600,
    damping: 15,
  },
};
```

### Transition Timings

```css
:root {
  /* Duration tokens */
  --duration-instant: 50ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 1000ms;
  
  /* Easing functions */
  --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-back: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-spring: cubic-bezier(0.43, 0.13, 0.23, 0.96);
}
```

### Micro-interactions

```css
/* Hover lift */
@keyframes hover-lift {
  to {
    transform: translateY(-2px);
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.15),
      0 0 30px rgba(79, 209, 255, 0.1);
  }
}

/* Pulse glow */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(79, 209, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(79, 209, 255, 0.5);
  }
}

/* Ripple effect */
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
```

## Component Patterns

### Card Design

```css
.vibe-card {
  /* Glass base */
  background: var(--glass-surface);
  backdrop-filter: var(--backdrop-blur);
  border: 1px solid rgba(79, 209, 255, 0.1);
  border-radius: 12px;
  
  /* Subtle gradient overlay */
  position: relative;
  overflow: hidden;
  
  /* Inner shadow for depth */
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 4px 6px rgba(0, 0, 0, 0.1);
  
  /* Smooth transitions */
  transition: all var(--duration-normal) var(--ease-spring);
}

.vibe-card::before {
  /* Gradient shimmer effect */
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.05),
    transparent
  );
  transition: left 0.5s ease;
}

.vibe-card:hover::before {
  left: 100%;
}
```

### Button Styles

```css
.btn-glass {
  /* Base glass button */
  background: rgba(79, 209, 255, 0.1);
  border: 1px solid rgba(79, 209, 255, 0.3);
  color: var(--neon-cyan);
  backdrop-filter: blur(8px);
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  font-family: var(--font-ui);
  font-weight: 500;
  transition: all var(--duration-fast) var(--ease-spring);
}

.btn-glass:hover {
  background: rgba(79, 209, 255, 0.2);
  border-color: rgba(79, 209, 255, 0.5);
  box-shadow: var(--glow-cyan);
  transform: translateY(-2px);
}

.btn-glass:active {
  transform: translateY(0);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

### Input Fields

```css
.input-glass {
  /* Glass input field */
  background: rgba(14, 24, 42, 0.3);
  border: 1px solid rgba(79, 209, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--base-100);
  font-family: var(--font-ui);
  backdrop-filter: blur(8px);
  transition: all var(--duration-fast) var(--ease-spring);
}

.input-glass:focus {
  outline: none;
  border-color: var(--neon-cyan);
  background: rgba(14, 24, 42, 0.5);
  box-shadow: 
    0 0 0 3px rgba(79, 209, 255, 0.1),
    var(--glow-cyan);
}

.input-glass::placeholder {
  color: var(--base-500);
}
```

## Layout System

### Grid Configuration

```css
:root {
  /* Spacing scale */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  
  /* Container widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}
```

### Column Layout

```css
.kanban-board {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-4);
  padding: var(--space-6);
  min-height: 100vh;
  
  /* Responsive adjustments */
  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    overflow-x: auto;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
```

## Visual Effects

### Backdrop Patterns

```css
.vibe-pattern {
  /* Subtle dot pattern */
  background-image: radial-gradient(
    circle at 1px 1px,
    rgba(79, 209, 255, 0.05) 1px,
    transparent 1px
  );
  background-size: 40px 40px;
}

.grid-pattern {
  /* Grid overlay */
  background-image: 
    linear-gradient(rgba(79, 209, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(79, 209, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}
```

### Glow Effects

```css
.neon-text {
  color: var(--neon-cyan);
  text-shadow: 
    0 0 10px rgba(79, 209, 255, 0.8),
    0 0 20px rgba(79, 209, 255, 0.6),
    0 0 30px rgba(79, 209, 255, 0.4);
}

.aurora-border {
  /* Animated gradient border */
  background: linear-gradient(
    45deg,
    #4FD1FF,
    #C084FC,
    #F472B6,
    #34D399,
    #4FD1FF
  );
  background-size: 400% 400%;
  animation: aurora 15s ease infinite;
}

@keyframes aurora {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

## Accessibility

### Focus States

```css
.focus-visible {
  /* High contrast focus ring */
  outline: 2px solid var(--neon-cyan);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(79, 209, 255, 0.2);
}

/* Skip to content */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--neon-purple);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: 0 0 8px 0;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Color Contrast

```css
/* High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --base-900: #000000;
    --base-100: #FFFFFF;
    --neon-cyan: #00FFFF;
    --glass-surface: rgba(0, 0, 0, 0.9);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .code-rain-container {
    display: none;
  }
}
```

## Dark/Light Mode

```css
/* Dark mode (default) */
:root[data-theme="dark"] {
  /* ... dark theme variables ... */
}

/* Light mode (optional) */
:root[data-theme="light"] {
  --base-900: #F8FAFC;
  --base-800: #E2E8F0;
  --base-100: #0F172A;
  
  --glass-surface: rgba(255, 255, 255, 0.7);
  --backdrop-blur: blur(12px) saturate(1.2);
}
```
