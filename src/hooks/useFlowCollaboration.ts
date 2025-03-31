import { useCallback, useEffect, useRef, useState } from "react";
import { PartySocket } from "partysocket";
import type { NodeChange, EdgeChange, Node, Edge } from "@xyflow/react";

// Define message data types
interface NodeUpdateData {
  id: string;
  type: string;
  data: Record<string, unknown>;
  position: { x: number; y: number };
  [key: string]: unknown;
}

interface EdgeUpdateData {
  id: string;
  source: string;
  target: string;
  [key: string]: unknown;
}

interface PositionUpdateData {
  id: string;
  position: { x: number; y: number };
}

interface DeleteData {
  id: string;
}


// Define message types
export type MessageType = 
  | "hello" 
  | "node_update" 
  | "edge_update" 
  | "node_delete" 
  | "edge_delete" 
  | "position_update" 
  | "request_state"
  | "clear_state"
  | "state_complete"
  | "active_users";

// Define message handlers
type MessageHandlers = {
  [key in MessageType]?: (data: unknown) => void;
};

// Define custom message handler type
export type MessageHandler = (message: { type: string; data: unknown }) => void;

// Active user type
export interface ActiveUser {
  id: string;
  name: string;
}

// Define hook props
interface UseFlowCollaborationProps {
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onMessage?: MessageHandler; // Optional message handler for custom message types
  onActiveUsersChange?: (users: ActiveUser[]) => void;
}

// Define hook return type
interface UseFlowCollaboration {
  isConnected: boolean;
  isInitialized: boolean;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  broadcastNodeUpdate: (node: Node) => void;
  broadcastEdgeUpdate: (edge: Edge) => void;
  broadcastNodeDelete: (nodeId: string) => void;
  broadcastEdgeDelete: (edgeId: string) => void;
  broadcastPositionUpdate: (nodeId: string, position: { x: number; y: number }) => void;
  onConnectionChange: (callback: (isConnected: boolean) => void) => void;
  sendMessage: (type: string, data: unknown) => void; // Generic message sender
  socket: PartySocket | null; // Expose socket for direct access if needed
}

export function useFlowCollaboration({
  onNodesChange,
  onEdgesChange,
  onMessage,
  onActiveUsersChange
}: UseFlowCollaborationProps): UseFlowCollaboration {
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const socketRef = useRef<PartySocket | null>(null);
  const connectionCallbacksRef = useRef<((isConnected: boolean) => void)[]>([]);
  
  // Define message handlers
  const messageHandlers = useRef<MessageHandlers>({
    node_update: (data: unknown) => {
      console.log("Received node update:", data);
      const nodeData = data as NodeUpdateData;
      
      // Use a more reliable approach for node updates
      // First check if the node exists
      onNodesChange([{ 
        type: 'remove', 
        id: nodeData.id 
      }]);
      
      // Then add it as a new node
      onNodesChange([{ 
        type: 'add', 
        item: nodeData 
      }]);
    },
    edge_update: (data: unknown) => {
      console.log("Received edge update:", data);
      const edgeData = data as EdgeUpdateData;
      
      // Use a more reliable approach for edge updates
      // First check if the edge exists
      onEdgesChange([{ 
        type: 'remove', 
        id: edgeData.id 
      }]);
      
      // Then add it as a new edge
      onEdgesChange([{ 
        type: 'add', 
        item: edgeData 
      }]);
    },
    node_delete: (data: unknown) => {
      console.log("Received node delete:", data);
      const deleteData = data as DeleteData;
      onNodesChange([{ type: 'remove', id: deleteData.id }]);
    },
    edge_delete: (data: unknown) => {
      console.log("Received edge delete:", data);
      const deleteData = data as DeleteData;
      onEdgesChange([{ type: 'remove', id: deleteData.id }]);
    },
    position_update: (data: unknown) => {
      console.log("Received position update:", data);
      const positionData = data as PositionUpdateData;
      onNodesChange([{ type: 'position', id: positionData.id, position: positionData.position }]);
    },
    clear_state: () => {
      console.log("Received clear state message");
      // Clear all nodes and edges
      onNodesChange([{ type: 'remove', id: 'all' }]);
      onEdgesChange([{ type: 'remove', id: 'all' }]);
    },
    state_complete: () => {
      console.log("State synchronization complete");
      setIsInitialized(true);
    },
    hello: (data: unknown) => {
      console.log("Received hello message:", data);
      // Forward to custom message handler if provided
      if (onMessage) {
        onMessage({ type: 'hello', data });
      }
    },
    active_users: (data: unknown) => {
      console.log("Received active users:", data);
      const users = data as ActiveUser[];
      
      // Notify about active users change if handler provided
      if (onActiveUsersChange) {
        onActiveUsersChange(users);
      }
    }
  }).current;
  
  // Set up socket connection
  useEffect(() => {
    console.log("Setting up PartySocket connection...");
    
    // Create socket connection
    const socket = new PartySocket({
      host: "127.0.0.1:1999", // Direct IP and port for local development
      room: "flowchart", // Must match the party name in partykit.json
    });
    
    // Set up event handlers
    socket.addEventListener("open", () => {
      console.log("Socket connected");
      setIsConnected(true);
      
      // Notify connection callbacks
      for (const callback of connectionCallbacksRef.current) {
        callback(true);
      }
      
      // Request initial state from server
      socket.send(JSON.stringify({
        type: "request_state",
        data: { timestamp: Date.now() }
      }));
    });
    
    socket.addEventListener("close", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
      setIsInitialized(false);
      
      // Notify connection callbacks
      for (const callback of connectionCallbacksRef.current) {
        callback(false);
      }
    });
    
    socketRef.current = socket;
    
    // Clean up on unmount
    return () => {
      console.log("Cleaning up socket connection");
      socket.close();
      socketRef.current = null;
    };
  }, []);
  
  // Set up message handler
  useEffect(() => {
    if (!socketRef.current) return;
    
    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Received message:", message.type);
        
        // Call the appropriate handler
        const handler = messageHandlers[message.type as MessageType];
        if (handler) {
          handler(message.data);
        } else {
          console.warn("Unknown message type:", message.type);
          // Forward to custom message handler if provided
          if (onMessage) {
            onMessage(message);
          }
        }
      } catch (error) {
        console.error("Error handling message:", error);
      }
    };
    
    socketRef.current.addEventListener("message", handleMessage);
    
    return () => {
      if (socketRef.current) {
        socketRef.current.removeEventListener("message", handleMessage);
      }
    };
  }, [messageHandlers, onMessage]);
  
  // Define broadcast functions
  const broadcastNodeUpdate = useCallback((node: Node) => {
    if (!socketRef.current || !isConnected) return;
    console.log("Broadcasting node update:", node);
    socketRef.current.send(JSON.stringify({
      type: "node_update",
      data: node
    }));
  }, [isConnected]);
  
  const broadcastEdgeUpdate = useCallback((edge: Edge) => {
    if (!socketRef.current || !isConnected) return;
    console.log("Broadcasting edge update:", edge);
    socketRef.current.send(JSON.stringify({
      type: "edge_update",
      data: edge
    }));
  }, [isConnected]);
  
  const broadcastNodeDelete = useCallback((nodeId: string) => {
    if (!socketRef.current || !isConnected) return;
    console.log("Broadcasting node delete:", nodeId);
    socketRef.current.send(JSON.stringify({
      type: "node_delete",
      data: { id: nodeId }
    }));
  }, [isConnected]);
  
  const broadcastEdgeDelete = useCallback((edgeId: string) => {
    if (!socketRef.current || !isConnected) return;
    console.log("Broadcasting edge delete:", edgeId);
    socketRef.current.send(JSON.stringify({
      type: "edge_delete",
      data: { id: edgeId }
    }));
  }, [isConnected]);
  
  const broadcastPositionUpdate = useCallback((nodeId: string, position: { x: number; y: number }) => {
    if (!socketRef.current || !isConnected) return;
    console.log("Broadcasting position update:", nodeId, position);
    socketRef.current.send(JSON.stringify({
      type: "position_update",
      data: { id: nodeId, position }
    }));
  }, [isConnected]);
  
  // Generic message sender
  const sendMessage = useCallback((type: string, data: unknown) => {
    if (!socketRef.current || !isConnected) return;
    console.log(`Sending message of type ${type}:`, data);
    socketRef.current.send(JSON.stringify({
      type,
      data
    }));
  }, [isConnected]);
  
  // Register connection change callback
  const onConnectionChange = useCallback((callback: (isConnected: boolean) => void) => {
    connectionCallbacksRef.current.push(callback);
    
    // Call immediately with current state
    if (isConnected) {
      callback(true);
    }
    
    // Return cleanup function
    return () => {
      connectionCallbacksRef.current = connectionCallbacksRef.current.filter(cb => cb !== callback);
    };
  }, [isConnected]);
  
  // Define custom node changes handler
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    console.log("Handling node changes:", changes);
    onNodesChange(changes);
  }, [onNodesChange]);
  
  // Define custom edge changes handler
  const handleEdgesChange = useCallback((changes: EdgeChange[]) => {
    console.log("Handling edge changes:", changes);
    onEdgesChange(changes);
  }, [onEdgesChange]);
  
  return {
    isConnected,
    isInitialized,
    onNodesChange: handleNodesChange,
    onEdgesChange: handleEdgesChange,
    broadcastNodeUpdate,
    broadcastEdgeUpdate,
    broadcastNodeDelete,
    broadcastEdgeDelete,
    broadcastPositionUpdate,
    onConnectionChange,
    sendMessage,
    socket: socketRef.current,
  };
}
