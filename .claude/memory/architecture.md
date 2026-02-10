# File Architecture

```
src/
  main.tsx                    # Entry point, imports app.css
  App.tsx                     # ReactFlowProvider wrapper, AppInner with canvas+toolbar+panels
  app.css                     # Tailwind import, React Flow styles, animations (edge-draw, selection-pulse, node transitions)

  types/
    node.ts                   # NodeShape, FlowchartNodeData, FlowchartNode, NODE_SHAPE_LABELS
    edge.ts                   # EdgeStyle, FlowchartEdgeData, FlowchartEdge, EDGE_STYLE_LABELS
    graph.ts                  # GraphDirection, DIRECTION_LABELS
    toolbar.ts                # ToolbarAction type

  store/
    index.ts                  # Combined AppState type, useStore hook (create with all slices)
    nodes-slice.ts            # NodesSlice - CRUD, editing, delete animation
    edges-slice.ts            # EdgesSlice - CRUD, onConnect, edge styles
    graph-slice.ts            # GraphSlice - direction
    history-slice.ts          # HistorySlice - undo/redo with debounced snapshots
    ui-slice.ts               # UISlice - activeShape, code panel, adding mode

  nodes/
    index.ts                  # nodeTypes map (module-level)
    BaseFlowchartNode.tsx     # Shared base with motion animations, handles, inline editor
    InlineEditor.tsx           # Input component for double-click label editing
    RectangleNode.tsx         # rounded-none
    RoundedNode.tsx           # rounded-lg
    DiamondNode.tsx           # SVG polygon, custom handles
    CircleNode.tsx            # rounded-full, fixed 80x80
    StadiumNode.tsx           # rounded-full (pill shape)
    HexagonNode.tsx           # SVG polygon, custom handles

  edges/
    index.ts                  # edgeTypes map (module-level)
    EdgeLabel.tsx             # Inline-editable edge label with double-click
    SolidEdge.tsx             # strokeWidth: 2
    DottedEdge.tsx            # strokeDasharray: '5 5'
    ThickEdge.tsx             # strokeWidth: 4

  canvas/
    Canvas.tsx                # ReactFlow wrapper, pane click for adding nodes
    CanvasControls.tsx        # Zoom in/out/fit buttons
    ConnectionLine.tsx        # Custom bezier connection line

  toolbar/
    Toolbar.tsx               # Main toolbar container
    ToolbarButton.tsx         # Animated button with hover/tap
    ShapePicker.tsx           # Dropdown grid for 6 shapes
    EdgeStylePicker.tsx       # Dropdown for 3 edge styles
    DirectionPicker.tsx       # Dropdown for 4 directions
    ExportMenu.tsx            # Mermaid/SVG/PNG export dropdown

  code-panel/
    CodePanel.tsx             # Collapsible side panel with live mermaid code
    CopyButton.tsx            # Clipboard copy with checkmark feedback

  properties/
    PropertiesPanel.tsx       # Contextual panel for selected node/edge
    NodeProperties.tsx        # Label input + shape grid
    EdgeProperties.tsx        # Label input + style buttons

  mermaid/
    generate.ts               # Main generator: nodes + edges -> mermaid flowchart string
    node-syntax.ts            # Shape -> mermaid bracket syntax mapping
    edge-syntax.ts            # Style -> arrow syntax mapping (with/without labels)
    sanitize.ts               # HTML entity escaping for mermaid

  layout/
    dagre-layout.ts           # Dagre auto-layout with shape-aware sizing
    layout-options.ts         # LayoutOptions type + defaults

  hooks/
    use-mermaid-code.ts       # Memoized mermaid code generation
    use-auto-layout.ts        # Dagre layout + fitView
    use-keyboard-shortcuts.ts # Delete, Ctrl+Z/Y, Escape
    use-export.ts             # Mermaid/SVG/PNG download

  utils/
    id-generator.ts           # Sequential node_N / edge_N IDs
    constants.ts              # Default values, grid size, debounce timing
```
