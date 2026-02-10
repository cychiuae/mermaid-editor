# Mermaid Editor

A visual editor for creating [Mermaid](https://mermaid.js.org/) diagrams with real-time code generation. Build flowcharts and sequence diagrams through an interactive canvas, then export the generated Mermaid code, SVG, or PNG.

## Features

### Flowchart

- **6 node shapes** — rectangle, rounded, diamond, circle, stadium, hexagon
- **3 edge styles** — solid (`-->`), dotted (`-.->`), thick (`==>`)
- **4 directions** — TB, LR, BT, RL
- **Auto-layout** via Dagre algorithm
- Inline text editing (double-click nodes/edges)
- Multi-select and bulk delete

### Sequence Diagram

- **Participants** with aliases, participant/actor types
- **10 arrow types** — solid/dotted x arrow/open/cross/async + bidirectional
- **Notes** — left of, right of, over (single or multiple participants)
- **7 fragment types** — loop, alt/else, opt, par/and, critical/option, break, rect
- **Activations** — explicit activate/deactivate bars
- **Auto-numbering** — optional sequential message numbers

### General

- **Undo/Redo** with full state history
- **Import** existing Mermaid code
- **Export** to Mermaid (.mmd), SVG, or PNG
- **Live code panel** showing generated Mermaid syntax
- **Persistent state** — auto-saves to localStorage
- **Keyboard shortcuts** — Ctrl+Z undo, Ctrl+Y redo, Del delete, Esc cancel

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Opens at `http://localhost:5173`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Tech Stack

- [React 19](https://react.dev/) + TypeScript
- [Vite](https://vite.dev/) — build tool
- [@xyflow/react](https://reactflow.dev/) v12 — flowchart canvas
- Custom SVG canvas — sequence diagram rendering
- [Zustand](https://zustand.docs.pmnd.rs/) v5 — state management
- [Dagre](https://github.com/dagrejs/dagre) — auto-layout algorithm
- [Tailwind CSS](https://tailwindcss.com/) v4 — styling
- [Motion](https://motion.dev/) v12 — animations
- [Lucide](https://lucide.dev/) — icons

## Architecture

The app supports two diagram types, switched via a toolbar picker:

- **Flowchart mode** renders an interactive React Flow canvas with draggable nodes and connectable edges.
- **Sequence mode** renders a custom SVG canvas with pan/zoom, participants, messages, notes, and fragments.

State is managed through Zustand slices (nodes, edges, graph direction, history, UI, sequence data). History captures snapshots of both diagram types for unified undo/redo.

```
src/
├── canvas/        # React Flow flowchart canvas
├── nodes/         # Flowchart node components (6 shapes)
├── edges/         # Flowchart edge components (3 styles)
├── sequence/      # Sequence diagram canvas + layout engine
├── toolbar/       # Toolbar with diagram-specific controls
├── properties/    # Right-panel property editors
├── code-panel/    # Live Mermaid code viewer
├── mermaid/       # Code generation and parsing
├── store/         # Zustand state slices
├── hooks/         # Keyboard shortcuts, auto-layout, import/export
└── types/         # TypeScript type definitions
```
