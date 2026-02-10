# Mermaid Editor - Project Memory

## Tech Stack
- Vite + React 19 + TypeScript
- @xyflow/react v12 (React Flow) - interactive graph canvas
- Tailwind CSS v4 via `@tailwindcss/vite` plugin (imported as `@import "tailwindcss"` in CSS)
- motion v12 (Framer Motion successor) - import from `motion/react`
- Zustand v5 - state management with slices pattern
- @dagrejs/dagre - auto-layout algorithm
- lucide-react - icons

## Key Architecture Decisions
- `nodeTypes`/`edgeTypes` defined at **module level** (src/nodes/index.ts, src/edges/index.ts) to prevent React Flow re-mounts
- `ReactFlowProvider` wraps entire App; `useReactFlow()` available everywhere inside
- Delete animation uses flag-based approach (`isDeleting` on node data), not AnimatePresence, since React Flow controls the render tree
- History `pushHistory` is debounced 300ms; only on meaningful mutations
- RF instance stored in module-level variable for `screenToFlowPosition` in Canvas.tsx

## React Flow v12 API Notes
- `NodeProps<T>` and `EdgeProps<T>` generics expect the **full Node/Edge type**, not just the data type
  - Correct: `NodeProps<FlowchartNode>` where `FlowchartNode = Node<FlowchartNodeData>`
  - Wrong: `NodeProps<FlowchartNodeData>` - causes constraint errors
- `MarkerType` enum imported from `@xyflow/react` (re-exported from `@xyflow/system`): `MarkerType.Arrow`, `MarkerType.ArrowClosed`
- `toSvg`/`toPng` do NOT exist in @xyflow/react v12 - need manual SVG serialization or html-to-image library
- `applyNodeChanges`/`applyEdgeChanges` used for controlled flow
- `ReactFlowInstance.screenToFlowPosition()` for coordinate projection

## File Structure
See [architecture.md](./architecture.md) for full file map.

## Supported Mermaid Features
- **Node Shapes**: rectangle `[text]`, rounded `(text)`, diamond `{text}`, circle `((text))`, stadium `([text])`, hexagon `{{text}}`
- **Edge Types**: solid `-->`, dotted `-.->`, thick `==>`
- **Directions**: TB, LR, BT, RL

## Store Slices (src/store/)
- NodesSlice: nodes CRUD, inline editing, delete animation
- EdgesSlice: edges CRUD, onConnect with animation class, default edge style
- GraphSlice: direction (TB/LR/BT/RL)
- HistorySlice: past/future stacks, debounced pushHistory, undo/redo
- UISlice: activeShape, isCodePanelOpen, isAddingNode
