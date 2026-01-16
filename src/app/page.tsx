"use client";

import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import the Right Panel component we created
import RightPanel from '@/components/layout/right-panel';

// ---------------------------------------------------------
// 1. INITIAL STATE
// ---------------------------------------------------------
const initialNodes: Node[] = [
  { 
    id: 'client-1', 
    position: { x: 50, y: 250 }, 
    data: { label: 'Client (Internet)' }, 
    type: 'input', // 'input' type usually means it only has a source handle
    // We lock this node so users can't delete it
    deletable: false,
  },
];

const initialEdges: Edge[] = [];

// ---------------------------------------------------------
// 2. THE GAME CANVAS COMPONENT
// ---------------------------------------------------------
const DevOpsGameCanvas = () => {
  // Ref for the wrapper div to handle screen positioning
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // Game State
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // React Flow Hooks
  const { screenToFlowPosition } = useReactFlow();

  // -------------------------------------------------------
  // REACT FLOW EVENT HANDLERS
  // -------------------------------------------------------
  
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  // -------------------------------------------------------
  // DRAG AND DROP HANDLERS
  // -------------------------------------------------------

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      // 1. Get the type passed from the Sidebar
      const type = event.dataTransfer.getData('application/reactflow');

      // 2. validation
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // 3. Calculate position relative to the canvas
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // 4. Create the new node object
      const newNode: Node = {
        id: `${type.toLowerCase()}-${Date.now()}`,
        type: 'default', // Using default for now, you can create custom types later
        position,
        data: { 
          label: `${type} Node`, // Temp label
          // Default Game Data for this node
          cpuLevel: 1,
          ramLevel: 1,
          software: []
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition],
  );

  // -------------------------------------------------------
  // SELECTION & RIGHT PANEL HANDLERS
  // -------------------------------------------------------

  // When a user clicks a node
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // Prevent opening panel for the "Client" node or non-interactive nodes
    if (node.id === 'client-1') {
      setSelectedNodeId(null);
      return;
    }
    setSelectedNodeId(node.id);
  }, []);

  // When user clicks the background (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Function passed to RightPanel to update node data
  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // Deep merge the data
          return { 
            ...node, 
            data: { ...node.data, ...newData } 
          };
        }
        return node;
      })
    );
  }, []);

  // Helper to find the currently selected node object
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  return (
    <div className="flex-1 h-screen w-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
      >
        <Background gap={12} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {/* THE CONFIGURATION PANEL */}
      <RightPanel 
        selectedNode={selectedNode} 
        onClose={() => setSelectedNodeId(null)}
        onUpdateNode={updateNodeData}
      />
    </div>
  );
};

// ---------------------------------------------------------
// 3. EXPORT WITH PROVIDER
// ---------------------------------------------------------
export default function App() {
  return (
    <ReactFlowProvider>
      <DevOpsGameCanvas />
    </ReactFlowProvider>
  );
}