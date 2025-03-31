import {
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type NodeMouseHandler,
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Position,
  Handle,
  applyNodeChanges,
  applyEdgeChanges,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import { memo, useCallback, useEffect, useState } from "react";
import { makeStyles, tokens, Text, Card, Tooltip, Button, Badge, Spinner, Input } from "@fluentui/react-components";
import { useFlowCollaboration, type MessageHandler, type ActiveUser } from "../hooks/useFlowCollaboration";
import { v4 as uuidv4 } from 'uuid';
import { c4NodeTypes } from "./C4Nodes";

import "@xyflow/react/dist/style.css";

// Define custom node styles
const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  controls: {
    padding: "8px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    display: "flex",
    gap: "8px",
  },
  flowContainer: {
    flex: 1,
    position: "relative",
  },
  customNode: {
    padding: "10px",
    borderRadius: "3px",
    width: "150px",
    fontSize: "12px",
    color: tokens.colorNeutralForeground1,
    textAlign: "center",
    border: `1px solid ${tokens.colorBrandStroke1}`,
    backgroundColor: tokens.colorBrandBackground,
  },
  statusPanel: {
    backgroundColor: tokens.colorNeutralBackground1,
    padding: "10px",
    borderRadius: "4px",
    boxShadow: tokens.shadow4,
  },
  collaborationStatus: {
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  userIndicator: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: tokens.colorPaletteGreenForeground1,
    marginRight: "8px",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    flexDirection: "column",
    gap: "16px",
  },
  messagingContainer: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    width: "300px",
    backgroundColor: tokens.colorNeutralBackground1,
    padding: "10px",
    borderRadius: "4px",
    boxShadow: tokens.shadow4,
    zIndex: 1000,
  },
  messageList: {
    maxHeight: "150px",
    overflowY: "auto",
    marginBottom: "10px",
    padding: "8px",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: "4px",
  },
  messageItem: {
    padding: "4px 0",
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  messageInput: {
    display: "flex",
    gap: "8px",
  },
  nodeControls: {
    position: "absolute",
    top: "20px",
    left: "20px",
    backgroundColor: tokens.colorNeutralBackground1,
    padding: "10px",
    borderRadius: "4px",
    boxShadow: tokens.shadow4,
    zIndex: 1000,
  },
} as const);

// Custom node component
const CustomNode = memo(({ data }: { data: { label: string } }) => {
  const styles = useStyles();
  
  return (
    <div className={styles.customNode}>
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

// Define node types
const nodeTypes = {
  customNode: CustomNode,
  ...c4NodeTypes
};

// Initial nodes
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'customNode',
    position: { x: 100, y: 100 },
    data: { label: 'Node 1' },
  },
  {
    id: '2',
    type: 'customNode',
    position: { x: 300, y: 100 },
    data: { label: 'Node 2' },
  },
  {
    id: '3',
    type: 'customNode',
    position: { x: 500, y: 100 },
    data: { label: 'Node 3' },
  },
];

// Initial edges
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

// Message interface
interface Message {
  id: string;
  content: string;
  type: 'sent' | 'received';
  timestamp: number;
}

// Main component
export default function ExperimentalFlow() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
}

// Flow content component that uses the hooks
function FlowContent() {
  const styles = useStyles();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [connected, setConnected] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowInstance = useReactFlow();

  // Define custom message handler
  const handleCustomMessage: MessageHandler = useCallback((message) => {
    if (message.type === 'hello') {
      console.log('Handling hello message:', message.data);
      // Add received message to the messages list
      setMessages(prev => [...prev, {
        id: uuidv4(),
        content: (message.data as { message: string }).message,
        type: 'received',
        timestamp: Date.now()
      }]);
    }
  }, []);

  // Handle active users updates
  const handleActiveUsersChange = useCallback((users: ActiveUser[]) => {
    console.log('Active users updated:', users);
    setActiveUsers(users);
  }, []);

  // Initialize collaboration hook with message handler
  const collaboration = useFlowCollaboration({
    onNodesChange: useCallback(
      (changes: NodeChange[]) => {
        console.log("Node changes:", changes);
        setNodes((nds) => applyNodeChanges(changes, nds));
      },
      []
    ),
    onEdgesChange: useCallback(
      (changes: EdgeChange[]) => {
        console.log("Edge changes:", changes);
        setEdges((eds) => applyEdgeChanges(changes, eds));
      },
      []
    ),
    onMessage: handleCustomMessage,
    onActiveUsersChange: handleActiveUsersChange
  });

  // Connect nodes when a connection is created
  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        id: `e${connection.source}-${connection.target}`,
        source: connection.source || "",
        target: connection.target || "",
      };
      setEdges((eds) => [...eds, newEdge]);
      
      // Broadcast edge update
      collaboration.broadcastEdgeUpdate(newEdge);
      setLastUpdate(`Edge created: ${newEdge.id}`);
    },
    [collaboration]
  );

  // Handle node drag
  const onNodeDragStop: NodeMouseHandler = useCallback(
    (_, node) => {
      console.log("Node dragged:", node);
      collaboration.broadcastPositionUpdate(node.id, node.position);
      setLastUpdate(`Node ${node.id} moved to (${Math.round(node.position.x)}, ${Math.round(node.position.y)})`);
    },
    [collaboration]
  );

  // Update connection status when collaboration status changes
  useEffect(() => {
    if (collaboration) {
      setConnected(collaboration.isConnected);
      setInitialized(collaboration.isInitialized);
      
      // Set up connection status listener
      const handleConnectionChange = (isConnected: boolean) => {
        setConnected(isConnected);
      };
      
      collaboration.onConnectionChange(handleConnectionChange);
      
      return () => {
        // Clean up will be handled by the hook
      };
    }
  }, [collaboration]);

  // Add a new node
  const addNode = useCallback(() => {
    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      type: 'customNode',
      position: {
        x: Math.random() * 500,
        y: Math.random() * 300,
      },
      data: { label: `Node ${nodes.length + 1}` },
    };
    
    console.log("Adding new node:", newNode);
    
    // Add node locally
    setNodes((nds) => [...nds, newNode]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`Node added: ${newNode.id}`);
  }, [nodes.length, collaboration]);

  // Add a new person node
  const addPersonNode = useCallback((parentId?: string) => {
    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      type: 'person',
      position: {
        x: parentId ? 50 : Math.random() * 500,
        y: parentId ? 50 : Math.random() * 300,
      },
      parentId: parentId,
      extent: parentId ? 'parent' : undefined,
      data: { 
        label: `Person ${nodes.length + 1}`,
        role: 'User',
        description: 'A user of the system'
      },
    };
    
    console.log("Adding new person node:", newNode);
    
    // Add node locally
    setNodes((nds) => [...nds, newNode]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`Person added: ${newNode.id}`);
  }, [nodes.length, collaboration]);

  // Add a new container node
  const addContainerNode = useCallback((parentId?: string) => {
    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      type: 'container',
      position: {
        x: parentId ? 50 : Math.random() * 500,
        y: parentId ? 50 : Math.random() * 300,
      },
      parentId: parentId,
      extent: parentId ? 'parent' : undefined,
      style: {
        width: 300,
        height: 300,
      },
      data: { 
        label: `Container ${nodes.length + 1}`,
        technology: 'Spring Boot',
        description: 'A container component'
      },
    };
    
    console.log("Adding new container node:", newNode);
    
    // Add node locally
    setNodes((nds) => [...nds, newNode]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`Container added: ${newNode.id}`);
  }, [nodes.length, collaboration]);

  // Add a new component node
  const addComponentNode = useCallback((parentId?: string) => {
    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      type: 'component',
      position: {
        x: parentId ? 50 : Math.random() * 500,
        y: parentId ? 50 : Math.random() * 300,
      },
      parentId: parentId,
      extent: parentId ? 'parent' : undefined,
      data: { 
        label: `Component ${nodes.length + 1}`,
        technology: 'React',
        description: 'A component in the system'
      },
    };
    
    console.log("Adding new component node:", newNode);
    
    // Add node locally
    setNodes((nds) => [...nds, newNode]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`Component added: ${newNode.id}`);
  }, [nodes.length, collaboration]);

  // Add a new system node
  const addSystemNode = useCallback((parentId?: string) => {
    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      type: 'system',
      position: {
        x: parentId ? 50 : Math.random() * 500,
        y: parentId ? 50 : Math.random() * 300,
      },
      parentId: parentId,
      extent: parentId ? 'parent' : undefined,
      data: { 
        label: `System ${nodes.length + 1}`,
        external: Math.random() > 0.5, // Randomly set as external or internal
        description: 'A system in the architecture'
      },
    };
    
    console.log("Adding new system node:", newNode);
    
    // Add node locally
    setNodes((nds) => [...nds, newNode]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`System added: ${newNode.id}`);
  }, [nodes.length, collaboration]);

  // Delete selected nodes and edges
  const deleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => edge.selected);
    
    console.log("Deleting selected:", { nodes: selectedNodes, edges: selectedEdges });
    
    // Delete nodes
    if (selectedNodes.length > 0) {
      // Also delete any child nodes
      const nodesToDelete = new Set<string>();
      
      // First collect all selected nodes
      for (const node of selectedNodes) {
        nodesToDelete.add(node.id);
      }
      
      // Then collect all child nodes of selected container nodes
      for (const node of selectedNodes) {
        if (node.type === 'container') {
          const childNodes = nodes.filter(n => n.parentId === node.id);
          for (const child of childNodes) {
            nodesToDelete.add(child.id);
          }
        }
      }
      
      // Delete all collected nodes
      for (const nodeId of nodesToDelete) {
        collaboration.broadcastNodeDelete(nodeId);
      }
      
      setNodes((nds) => nds.filter((node) => !nodesToDelete.has(node.id)));
    }
    
    // Delete edges
    if (selectedEdges.length > 0) {
      for (const edge of selectedEdges) {
        collaboration.broadcastEdgeDelete(edge.id);
      }
      setEdges((eds) => eds.filter((edge) => !edge.selected));
    }
    
    setLastUpdate(`Deleted ${selectedNodes.length} nodes and ${selectedEdges.length} edges`);
  }, [nodes, edges, collaboration]);

  // Send a message
  const sendMessage = useCallback(() => {
    if (!messageInput.trim() || !connected) return;

    // Send message using the collaboration hook
    collaboration.sendMessage('hello', { message: messageInput });

    // Add sent message to the messages list
    setMessages(prev => [...prev, {
      id: uuidv4(),
      content: messageInput,
      type: 'sent',
      timestamp: Date.now()
    }]);

    // Clear input
    setMessageInput('');
  }, [messageInput, connected, collaboration]);

  // Handle node selection
  const onSelectionChange = useCallback(({ nodes: selectedNodes }: { nodes: Node[] }) => {
    if (selectedNodes.length === 1) {
      const node = selectedNodes[0];
      setSelectedNode(node || null);
    } else {
      setSelectedNode(null);
    }
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <Button appearance="primary" onClick={addNode} disabled={!initialized}>Add Node</Button>
        <Button appearance="primary" onClick={() => addPersonNode()} disabled={!initialized}>Add Person</Button>
        <Button appearance="primary" onClick={() => addContainerNode()} disabled={!initialized}>Add Container</Button>
        <Button appearance="primary" onClick={() => addComponentNode()} disabled={!initialized}>Add Component</Button>
        <Button appearance="primary" onClick={() => addSystemNode()} disabled={!initialized}>Add System</Button>
        <Button appearance="outline" onClick={deleteSelected} disabled={!initialized}>Delete Selected</Button>
      </div>
      
      <div className={styles.flowContainer}>
        {!initialized && (
          <div className={styles.loadingOverlay}>
            <Spinner size="large" />
            <Text size={400} weight="semibold" style={{ color: 'white' }}>
              {connected ? 'Loading flowchart data...' : 'Connecting to server...'}
            </Text>
          </div>
        )}
        
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={collaboration.onNodesChange}
          onEdgesChange={collaboration.onEdgesChange}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
          
          {selectedNode && selectedNode.type === 'container' && (
            <Panel position="top-left" className={styles.nodeControls}>
              <Text weight="semibold">Add to Container: {(selectedNode.data as { label: string }).label}</Text>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <Button size="small" onClick={() => addPersonNode(selectedNode.id)}>Add Person</Button>
                <Button size="small" onClick={() => addComponentNode(selectedNode.id)}>Add Component</Button>
                <Button size="small" onClick={() => addSystemNode(selectedNode.id)}>Add System</Button>
                <Button size="small" onClick={() => addContainerNode(selectedNode.id)}>Add Container</Button>
              </div>
            </Panel>
          )}
          
          <Panel position="top-right" className={styles.statusPanel}>
            <div className={styles.collaborationStatus}>
              <Badge 
                appearance="filled" 
                color={connected ? "success" : "danger"}
              >
                {connected ? "Connected" : "Disconnected"}
              </Badge>
              
              {connected && (
                <Badge 
                  appearance="filled" 
                  color={initialized ? "success" : "warning"}
                >
                  {initialized ? "Synchronized" : "Synchronizing..."}
                </Badge>
              )}
            </div>
            
            <div>
              <Text size={200}>Active Users: {activeUsers.length}</Text>
              <div>
                {activeUsers.map((user) => (
                  <div key={user.id}>
                    <span className={styles.userIndicator} />
                    {user.name}
                  </div>
                ))}
                {activeUsers.length === 0 && (
                  <Text size={200} italic>No active users</Text>
                )}
              </div>
            </div>
            
            {lastUpdate && (
              <div style={{ marginTop: "10px" }}>
                <Text size={200}>Last update:</Text>
                <div>{lastUpdate}</div>
              </div>
            )}
          </Panel>

          {/* Messaging Panel */}
          <Panel position="bottom-left" className={styles.messagingContainer}>
            <Text weight="semibold">Systems Diagram</Text>
            <div className={styles.messageList}>
              {messages.map((msg) => (
                <div key={msg.id} className={styles.messageItem}>
                  <Text size={200} weight={msg.type === 'sent' ? 'semibold' : 'regular'}>
                    {msg.type === 'sent' ? 'Sent: ' : ''}{msg.content}
                  </Text>
                </div>
              ))}
              {messages.length === 0 && (
                <Text size={200} italic>No messages yet</Text>
              )}
            </div>
            <div className={styles.messageInput}>
              <Input 
                value={messageInput}
                onChange={(e, data) => setMessageInput(data.value)}
                placeholder="Type a message..."
                disabled={!connected}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
              />
              <Button 
                appearance="primary"
                onClick={sendMessage}
                disabled={!connected || !messageInput.trim()}
              >
                Send
              </Button>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
