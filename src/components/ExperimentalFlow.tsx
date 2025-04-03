import {
  type Node,
  type Edge,
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Position,
  Handle,
  Panel,
  ReactFlowProvider,
  type NodeMouseHandler,
} from "@xyflow/react";
import { memo, useCallback, useEffect, useState } from "react";
import { makeStyles, tokens, Text, Badge, Spinner, Input, Button } from "@fluentui/react-components";
import { useFlowCollaboration, type MessageHandler, type ActiveUser } from "../hooks/useFlowCollaboration";
import { v4 as uuidv4 } from 'uuid';
import { c4NodeTypes } from './C4Nodes';

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
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalM}`,
    borderBottom: `1px solid ${tokens.colorBrandBackground}`,
    display: "flex",
    gap: tokens.spacingHorizontalM,
    backgroundColor: tokens.colorNeutralBackground1,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center", // Vertically align items
  },
  ghostButton: {
    backgroundColor: "transparent",
    color: tokens.colorNeutralForeground1,
    border: `1px solid ${tokens.colorNeutralForegroundInverted}`,
    borderRadius: tokens.borderRadiusMedium,
    "&:hover": {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  flowContainer: {
    flex: 1,
    position: "relative",
  },
  customNode: {
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
    width: "150px",
    fontSize: "12px",
    color: tokens.colorNeutralForeground1,
    textAlign: "center",
    border: `1px solid ${tokens.colorBrandBackground}`,
    backgroundColor: tokens.colorNeutralBackground1,
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
    gap: tokens.spacingHorizontalL,
  },
  nodeControls: {
    position: "absolute",
    top: tokens.spacingHorizontalL,
    left: tokens.spacingHorizontalL,
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground1,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
  },
  editPanel: {
    position: "absolute",
    top: tokens.spacingHorizontalL,
    right: tokens.spacingHorizontalL,
    zIndex: 10,
    width: "300px",
    backgroundColor: tokens.colorNeutralBackground1,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
  },
  editForm: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
  },
  nodeEditForm: {
    marginTop: tokens.spacingVerticalM,
  },
  formField: {
    marginBottom: tokens.spacingVerticalS,
  },
  buttonGroup: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalM,
  },
  toolbar: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalM,
  },
  statusPanel: {
    position: "absolute",
    bottom: tokens.spacingHorizontalL,
    right: tokens.spacingHorizontalL,
    zIndex: 10,
    backgroundColor: tokens.colorNeutralBackground1,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
    width: "300px",
  },
  statusHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: tokens.spacingVerticalS,
  },
  userList: {
    marginTop: tokens.spacingVerticalS,
  },
  userItem: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    padding: `${tokens.spacingVerticalXXS} 0`,
  },
  panelButton: {
    marginLeft: "auto",
  },
  messagingContainer: {
    position: "absolute",
    bottom: tokens.spacingHorizontalL,
    left: tokens.spacingHorizontalL,
    zIndex: 10,
    width: "300px",
    backgroundColor: tokens.colorNeutralBackground1,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow4,
  },
  messageList: {
    maxHeight: "150px",
    overflowY: "auto",
    marginBottom: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalM,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
  },
  messageItem: {
    padding: "4px 0",
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  messageInput: {
    display: "flex",
    gap: tokens.spacingHorizontalM,
  },
  collaborationStatus: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
  },
  userIndicator: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: tokens.colorBrandForeground1,
    marginRight: tokens.spacingHorizontalM,
  },
  nodeGroup: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS,
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
  const [connected, setConnected] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editedNodeData, setEditedNodeData] = useState<Record<string, string>>({});
  const [showMessageHistory, setShowMessageHistory] = useState(true);
  const [showStatusPanel, setShowStatusPanel] = useState(true);
  // const reactFlowInstance = useReactFlow();

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
    initialNodes,
    initialEdges,
    onMessage: handleCustomMessage,
    onActiveUsersChange: handleActiveUsersChange
  });

  // Get nodes and edges from the store
  const nodes = collaboration.nodes;
  const edges = collaboration.edges;
  const onNodesChange = collaboration.onNodesChange;
  const onEdgesChange = collaboration.onEdgesChange;
  const onConnect = collaboration.onConnect;

  // Handle node drag
  const onNodeDragStop: NodeMouseHandler = useCallback(
    (_, node) => {
      console.log("Node dragged:", node);
      collaboration.broadcastPositionUpdate(node.id, node.position);
      setLastUpdate(`Node ${node.id} moved to (${Math.round(node.position.x)}, ${Math.round(node.position.y)})`);
      return node; // Return the node to satisfy TypeScript
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
        return isConnected; // Return a value to satisfy TypeScript
      };
      
      collaboration.onConnectionChange(handleConnectionChange);
      
      return () => {
        // Clean up will be handled by the hook
      };
    }
    return undefined; // Return a value for the case when collaboration is falsy
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
    onNodesChange([{ type: 'add', item: newNode }]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`Node added: ${newNode.id}`);
  }, [nodes.length, collaboration, onNodesChange]);

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
    onNodesChange([{ type: 'add', item: newNode }]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`Person added: ${newNode.id}`);
  }, [nodes.length, collaboration, onNodesChange]);

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
    onNodesChange([{ type: 'add', item: newNode }]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`Container added: ${newNode.id}`);
  }, [nodes.length, collaboration, onNodesChange]);

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
    onNodesChange([{ type: 'add', item: newNode }]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`Component added: ${newNode.id}`);
  }, [nodes.length, collaboration, onNodesChange]);

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
    onNodesChange([{ type: 'add', item: newNode }]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`System added: ${newNode.id}`);
  }, [nodes.length, collaboration, onNodesChange]);

  // Delete selected nodes and edges
  const deleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => edge.selected);
    
    console.log("Deleting selected nodes:", selectedNodes);
    console.log("Deleting selected edges:", selectedEdges);
    
    if (selectedNodes.length === 0 && selectedEdges.length === 0) {
      console.log("No nodes or edges selected for deletion");
      return;
    }
    
    // Delete nodes
    if (selectedNodes.length > 0) {
      const nodesToDelete = new Set(selectedNodes.map((node) => node.id));
      
      // Broadcast node deletions
      for (const nodeId of nodesToDelete) {
        collaboration.broadcastNodeDelete(nodeId);
      }
      
      onNodesChange(
        Array.from(nodesToDelete).map(id => ({ type: 'remove', id }))
      );
    }
    
    // Delete edges
    if (selectedEdges.length > 0) {
      for (const edge of selectedEdges) {
        collaboration.broadcastEdgeDelete(edge.id);
      }
      onEdgesChange(
        selectedEdges.map(edge => ({ type: 'remove', id: edge.id }))
      );
    }
    
    setLastUpdate(`Deleted ${selectedNodes.length} nodes and ${selectedEdges.length} edges`);
  }, [nodes, edges, collaboration, onNodesChange, onEdgesChange]);

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
  const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges }: { 
    nodes: Node[]; 
    edges: Edge[];
  }) => {
    console.log("Selection changed:", { nodes: selectedNodes, edges: selectedEdges });
    
    // Set selected node for editing if exactly one node is selected
    if (selectedNodes.length === 1) {
      const node = selectedNodes[0];
      // Ensure node is defined before using it
      if (node) {
        setSelectedNode(node);
        
        // Initialize edit form with current node data
        const initialData: Record<string, string> = {};
        
        if (node.data) {
          // Use for...of instead of forEach
          for (const [key, value] of Object.entries(node.data)) {
            if (typeof value === 'string') {
              initialData[key] = value;
            }
          }
        }
        
        setEditedNodeData(initialData);
      }
    } else {
      setSelectedNode(null);
    }
    
    // Return the selection to satisfy TypeScript
    return { nodes: selectedNodes, edges: selectedEdges };
  }, []);

  // Update node data
  const updateNodeData = useCallback(() => {
    if (!selectedNode) return;
    
    // Create updated node with new data
    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        ...editedNodeData,
        // Convert 'external' string to boolean if it exists
        ...(editedNodeData.external !== undefined ? { 
          external: editedNodeData.external === 'true' 
        } : {})
      }
    };
    
    // Update node locally
    onNodesChange([{ 
      type: 'replace', 
      id: updatedNode.id,
      item: updatedNode as Node 
    }]);
    
    // Broadcast node update to other clients
    collaboration.broadcastNodeUpdate(updatedNode);
    
    setLastUpdate(`Updated ${selectedNode.type} node: ${selectedNode.id}`);
  }, [selectedNode, editedNodeData, collaboration, onNodesChange]);

  // Handle input change in edit form
  const handleEditInputChange = useCallback((field: string, value: string) => {
    setEditedNodeData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Add a domain event node
  const addDomainEventNode = useCallback((parentId?: string) => {
    if (!collaboration || !initialized) return;
    
    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      type: 'domainEvent',
      position: {
        x: parentId ? 50 : Math.random() * 500,
        y: parentId ? 50 : Math.random() * 300,
      },
      parentId: parentId,
      extent: parentId ? 'parent' : undefined,
      data: { 
        label: 'New Domain Event',
        description: 'Past-tense event description'
      },
    };
    
    // Add node locally
    onNodesChange([{ type: 'add', item: newNode }]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`Domain Event added: ${newNode.id}`);
  }, [collaboration, initialized, onNodesChange]);

  // Add a command node
  const addCommandNode = useCallback((parentId?: string) => {
    if (!collaboration || !initialized) return;
    
    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      type: 'command',
      position: {
        x: parentId ? 50 : Math.random() * 500,
        y: parentId ? 50 : Math.random() * 300,
      },
      parentId: parentId,
      extent: parentId ? 'parent' : undefined,
      data: { 
        label: 'New Command',
        description: 'Imperative action'
      },
    };
    
    // Add node locally
    onNodesChange([{ type: 'add', item: newNode }]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`Command added: ${newNode.id}`);
  }, [collaboration, initialized, onNodesChange]);

  // Add an actor node
  const addActorNode = useCallback((parentId?: string) => {
    if (!collaboration || !initialized) return;
    
    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      type: 'actor',
      position: {
        x: parentId ? 50 : Math.random() * 500,
        y: parentId ? 50 : Math.random() * 300,
      },
      parentId: parentId,
      extent: parentId ? 'parent' : undefined,
      data: { 
        label: 'New Actor',
        description: 'Person or system issuing commands'
      },
    };
    
    // Add node locally
    onNodesChange([{ type: 'add', item: newNode }]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`Actor added: ${newNode.id}`);
  }, [collaboration, initialized, onNodesChange]);

  // Add an aggregate node
  const addAggregateNode = useCallback((parentId?: string) => {
    if (!collaboration || !initialized) return;
    
    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      type: 'aggregate',
      position: {
        x: parentId ? 50 : Math.random() * 500,
        y: parentId ? 50 : Math.random() * 300,
      },
      parentId: parentId,
      extent: parentId ? 'parent' : undefined,
      data: { 
        label: 'New Aggregate',
        description: 'Cluster of domain objects'
      },
    };
    
    // Add node locally
    onNodesChange([{ type: 'add', item: newNode }]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`Aggregate added: ${newNode.id}`);
  }, [collaboration, initialized, onNodesChange]);

  // Add a policy node
  const addPolicyNode = useCallback((parentId?: string) => {
    if (!collaboration || !initialized) return;
    
    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      type: 'policy',
      position: {
        x: parentId ? 50 : Math.random() * 500,
        y: parentId ? 50 : Math.random() * 300,
      },
      parentId: parentId,
      extent: parentId ? 'parent' : undefined,
      data: { 
        label: 'New Policy',
        description: 'When [event], then [action]'
      },
    };
    
    // Add node locally
    onNodesChange([{ type: 'add', item: newNode }]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`Policy added: ${newNode.id}`);
  }, [collaboration, initialized, onNodesChange]);

  // Add a read model node
  const addReadModelNode = useCallback((parentId?: string) => {
    if (!collaboration || !initialized) return;
    
    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      type: 'readModel',
      position: {
        x: parentId ? 50 : Math.random() * 500,
        y: parentId ? 50 : Math.random() * 300,
      },
      parentId: parentId,
      extent: parentId ? 'parent' : undefined,
      data: { 
        label: 'New Read Model',
        description: 'Information view for decisions'
      },
    };
    
    // Add node locally
    onNodesChange([{ type: 'add', item: newNode }]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`Read Model added: ${newNode.id}`);
  }, [collaboration, initialized, onNodesChange]);

  // Add an external system node
  const addExternalSystemEventNode = useCallback((parentId?: string) => {
    if (!collaboration || !initialized) return;
    
    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      type: 'externalSystem',
      position: {
        x: parentId ? 50 : Math.random() * 500,
        y: parentId ? 50 : Math.random() * 300,
      },
      parentId: parentId,
      extent: parentId ? 'parent' : undefined,
      data: { 
        label: 'New External System',
        description: 'System outside your boundary'
      },
    };
    
    // Add node locally
    onNodesChange([{ type: 'add', item: newNode }]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`External System added: ${newNode.id}`);
  }, [collaboration, initialized, onNodesChange]);

  // Add a hot spot node
  const addHotSpotNode = useCallback((parentId?: string) => {
    if (!collaboration || !initialized) return;
    
    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      type: 'hotSpot',
      position: {
        x: parentId ? 50 : Math.random() * 500,
        y: parentId ? 50 : Math.random() * 300,
      },
      parentId: parentId,
      extent: parentId ? 'parent' : undefined,
      data: { 
        label: 'New Hot Spot',
        description: 'Area of confusion or conflict'
      },
    };
    
    // Add node locally
    onNodesChange([{ type: 'add', item: newNode }]);
    
    // Broadcast node creation to other clients
    collaboration.broadcastNodeUpdate(newNode);
    
    setLastUpdate(`Hot Spot added: ${newNode.id}`);
  }, [collaboration, initialized, onNodesChange]);

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <Button appearance="transparent" size="small" onClick={addNode} disabled={!initialized} className={styles.ghostButton}>Add Node</Button>
        
        {/* C4 Diagram Nodes */}
        <div className={styles.nodeGroup}>
          <Text size={200} weight="semibold" style={{ marginRight: '8px' }}>C4:</Text>
          <Button appearance="transparent" size="small" onClick={() => addPersonNode()} disabled={!initialized} className={styles.ghostButton}>Person</Button>
          <Button appearance="transparent" size="small" onClick={() => addContainerNode()} disabled={!initialized} className={styles.ghostButton}>Container</Button>
          <Button appearance="transparent" size="small" onClick={() => addComponentNode()} disabled={!initialized} className={styles.ghostButton}>Component</Button>
          <Button appearance="transparent" size="small" onClick={() => addSystemNode()} disabled={!initialized} className={styles.ghostButton}>System</Button>
        </div>
        
        {/* Event Storming Nodes */}
        <div className={styles.nodeGroup}>
          <Text size={200} weight="semibold" style={{ marginRight: '8px' }}>Event Storming:</Text>
          <Button appearance="transparent" size="small" onClick={() => addDomainEventNode()} disabled={!initialized} className={styles.ghostButton}>Domain Event</Button>
          <Button appearance="transparent" size="small" onClick={() => addCommandNode()} disabled={!initialized} className={styles.ghostButton}>Command</Button>
          <Button appearance="transparent" size="small" onClick={() => addActorNode()} disabled={!initialized} className={styles.ghostButton}>Actor</Button>
          <Button appearance="transparent" size="small" onClick={() => addAggregateNode()} disabled={!initialized} className={styles.ghostButton}>Aggregate</Button>
          <Button appearance="transparent" size="small" onClick={() => addPolicyNode()} disabled={!initialized} className={styles.ghostButton}>Policy</Button>
          <Button appearance="transparent" size="small" onClick={() => addReadModelNode()} disabled={!initialized} className={styles.ghostButton}>Read Model</Button>
          <Button appearance="transparent" size="small" onClick={() => addExternalSystemEventNode()} disabled={!initialized} className={styles.ghostButton}>External System</Button>
          <Button appearance="transparent" size="small" onClick={() => addHotSpotNode()} disabled={!initialized} className={styles.ghostButton}>Hot Spot</Button>
        </div>
        
        <Button appearance="subtle" size="small" onClick={deleteSelected} disabled={!initialized}>Delete Selected</Button>
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
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
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
              
              {/* C4 Nodes for Container */}
              <div className={styles.nodeGroup} style={{ marginTop: '8px' }}>
                <Text size={200} weight="semibold" style={{ marginRight: '8px' }}>C4:</Text>
                <Button appearance="transparent" size="small" onClick={() => addPersonNode(selectedNode.id)} className={styles.ghostButton}>Person</Button>
                <Button appearance="transparent" size="small" onClick={() => addComponentNode(selectedNode.id)} className={styles.ghostButton}>Component</Button>
                <Button appearance="transparent" size="small" onClick={() => addSystemNode(selectedNode.id)} className={styles.ghostButton}>System</Button>
                <Button appearance="transparent" size="small" onClick={() => addContainerNode(selectedNode.id)} className={styles.ghostButton}>Container</Button>
              </div>
              
              {/* Event Storming Nodes for Container */}
              <div className={styles.nodeGroup} style={{ marginTop: '8px' }}>
                <Text size={200} weight="semibold" style={{ marginRight: '8px' }}>Event Storming:</Text>
                <Button appearance="transparent" size="small" onClick={() => addDomainEventNode(selectedNode.id)} className={styles.ghostButton}>Domain Event</Button>
                <Button appearance="transparent" size="small" onClick={() => addCommandNode(selectedNode.id)} className={styles.ghostButton}>Command</Button>
                <Button appearance="transparent" size="small" onClick={() => addActorNode(selectedNode.id)} className={styles.ghostButton}>Actor</Button>
                <Button appearance="transparent" size="small" onClick={() => addAggregateNode(selectedNode.id)} className={styles.ghostButton}>Aggregate</Button>
              </div>
              <div className={styles.nodeGroup} style={{ marginTop: '8px', marginLeft: '96px' }}>
                <Button appearance="transparent" size="small" onClick={() => addPolicyNode(selectedNode.id)} className={styles.ghostButton}>Policy</Button>
                <Button appearance="transparent" size="small" onClick={() => addReadModelNode(selectedNode.id)} className={styles.ghostButton}>Read Model</Button>
                <Button appearance="transparent" size="small" onClick={() => addExternalSystemEventNode(selectedNode.id)} className={styles.ghostButton}>External System</Button>
                <Button appearance="transparent" size="small" onClick={() => addHotSpotNode(selectedNode.id)} className={styles.ghostButton}>Hot Spot</Button>
              </div>
            </Panel>
          )}
          
          {/* Node Edit Panel */}
          {selectedNode && (
            <Panel position="top-right" className={styles.editPanel}>
              <Text weight="semibold">Edit {selectedNode.type} Node</Text>
              <div className={styles.editForm}>
                <div>
                  <Text as="span" size={200} block id="label-input">Label</Text>
                  <Input 
                    value={editedNodeData.label || ''}
                    onChange={(_, data) => handleEditInputChange('label', data.value)}
                    aria-labelledby="label-input"
                  />
                </div>
                
                <div>
                  <Text as="span" size={200} block id="description-input">Description</Text>
                  <Input 
                    value={editedNodeData.description || ''}
                    onChange={(_, data) => handleEditInputChange('description', data.value)}
                    aria-labelledby="description-input"
                  />
                </div>
                
                {/* Role field (only for person nodes) */}
                {selectedNode.type === 'person' && (
                  <div>
                    <Text as="span" size={200} block id="role-input">Role</Text>
                    <Input 
                      value={editedNodeData.role || ''}
                      onChange={(_, data) => handleEditInputChange('role', data.value)}
                      aria-labelledby="role-input"
                    />
                  </div>
                )}
                
                {/* Technology field (for container and component nodes) */}
                {(selectedNode.type === 'container' || selectedNode.type === 'component') && (
                  <div>
                    <Text as="span" size={200} block id="technology-input">Technology</Text>
                    <Input 
                      value={editedNodeData.technology || ''}
                      onChange={(_, data) => handleEditInputChange('technology', data.value)}
                      aria-labelledby="technology-input"
                    />
                  </div>
                )}
                
                {/* External checkbox (only for system nodes) */}
                {selectedNode.type === 'system' && (
                  <div>
                    <Text as="span" size={200} block id="external-input">External System</Text>
                    <select 
                      value={editedNodeData.external || 'false'}
                      onChange={e => handleEditInputChange('external', e.target.value)}
                      aria-labelledby="external-input"
                      style={{ 
                        width: '100%', 
                        padding: '5px', 
                        marginTop: '4px',
                        borderRadius: '4px',
                        border: `1px solid ${tokens.colorNeutralStroke1}`
                      }}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                )}
                
                <Button 
                  appearance="primary" 
                  size="small"
                  onClick={updateNodeData}
                >
                  Save Changes
                </Button>
              </div>
            </Panel>
          )}
          
          {showMessageHistory && (
            <Panel position="bottom-left" className={styles.messagingContainer} style={{ 
              position: 'absolute', 
              bottom: tokens.spacingHorizontalL, 
              left: tokens.spacingHorizontalL,
              width: '300px',
              zIndex: 1000
            }}>
              <Text weight="semibold">Message History</Text>
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
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(_, data) => setMessageInput(data.value)}
                  disabled={!connected}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      sendMessage();
                    }
                  }}
                  style={{ width: '200px' }}
                />
                <Button 
                  appearance="primary"
                  size="small"
                  onClick={sendMessage}
                  disabled={!connected || !messageInput.trim()}
                >
                  Send
                </Button>
              </div>
              <Button 
                appearance="secondary" 
                onClick={() => setShowMessageHistory(false)}
                className={styles.panelButton}
              >
                Collapse
              </Button>
            </Panel>
          )}
          {!showMessageHistory && (
            <Button 
              appearance="secondary" 
              onClick={() => setShowMessageHistory(true)}
              style={{ 
                position: 'absolute', 
                bottom: tokens.spacingHorizontalL, 
                left: tokens.spacingHorizontalL,
                zIndex: 1000
              }}
            >
              Show Messages
            </Button>
          )}
          
          {showStatusPanel && (
            <Panel position="bottom-left" className={styles.statusPanel} style={{ 
              position: 'absolute', 
              bottom: tokens.spacingHorizontalL, 
              left: `calc(${tokens.spacingHorizontalL} + 350px)`,
              width: '250px',
              zIndex: 1000
            }}>
              <Button 
                appearance="subtle" 
                onClick={() => setShowStatusPanel(false)}
                style={{ 
                  position: 'absolute', 
                  top: '10px', 
                  right: '10px'
                }}
              >
                Collapse
              </Button>
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
          )}
          {!showStatusPanel && (
            <Button 
              appearance="secondary" 
              onClick={() => setShowStatusPanel(true)}
              style={{ 
                position: 'absolute', 
                bottom: tokens.spacingHorizontalL, 
                left: `calc(${tokens.spacingHorizontalL} + 350px)`,
                zIndex: 1000
              }}
            >
              Expand Status Panel
            </Button>
          )}
        </ReactFlow>
      </div>
    </div>
  );
}
