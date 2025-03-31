import type * as Party from "partykit/server";

// Message data type definitions
interface HelloMessageData {
  message: string;
}

interface NodeUpdateData {
  id: string;
  type: string;
  data: Record<string, unknown>;
  position: { x: number; y: number };
}

interface EdgeUpdateData {
  id: string;
  source: string;
  target: string;
  type?: string;
}

interface PositionUpdateData {
  id: string;
  position: { x: number; y: number };
}

interface DeleteData {
  id: string;
}

interface RequestStateData {
  timestamp: number;
}

interface ActiveUsersData {
  id: string;
  name: string;
}

// Message type union
type MessageType = 
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

// Message data union
type MessageDataType = 
  | HelloMessageData
  | NodeUpdateData
  | EdgeUpdateData
  | DeleteData
  | PositionUpdateData
  | RequestStateData
  | { timestamp: number }
  | ActiveUsersData[];

// Message interface
interface Message {
  type: MessageType;
  data: MessageDataType;
}

// Flow state interface
interface FlowState {
  nodes: Record<string, NodeUpdateData>;
  edges: Record<string, EdgeUpdateData>;
  lastUpdated: number;
}

export default class FlowchartServer implements Party.Server {
  constructor(readonly party: Party.Party) {}

  // Initialize flow state
  private flowState: FlowState = {
    nodes: {},
    edges: {},
    lastUpdated: Date.now()
  };

  // Track connected users
  private activeUsers: Map<string, { id: string, name: string }> = new Map();

  // Default nodes and edges to use if no state exists
  private defaultState: FlowState = {
    nodes: {
      "1": {
        id: "1",
        type: "customNode",
        position: { x: 100, y: 100 },
        data: { label: "Node 1" }
      },
      "2": {
        id: "2",
        type: "customNode",
        position: { x: 300, y: 100 },
        data: { label: "Node 2" }
      },
      "3": {
        id: "3",
        type: "customNode",
        position: { x: 500, y: 100 },
        data: { label: "Node 3" }
      }
    },
    edges: {
      "e1-2": {
        id: "e1-2",
        source: "1",
        target: "2"
      },
      "e2-3": {
        id: "e2-3",
        source: "2",
        target: "3"
      }
    },
    lastUpdated: Date.now()
  };

  // Load state from storage on server start
  async onStart() {
    try {
      console.log("Starting FlowchartServer...");
      const storedState = await this.party.storage.get<FlowState>("flowState");
      if (storedState) {
        this.flowState = storedState;
        console.log("Loaded flow state from storage:", JSON.stringify(this.flowState, null, 2));
      } else {
        console.log("No stored state found, using default state");
        // Initialize with default nodes and edges
        this.flowState = this.defaultState;
        // Save the default state
        await this.saveFlowState();
      }
    } catch (error) {
      console.error("Error loading flow state:", error);
      // If there's an error, use the default state
      this.flowState = this.defaultState;
      await this.saveFlowState();
    }
  }

  async onConnect(conn: Party.Connection) {
    console.log(`New connection: ${conn.id}`);
    
    // Add user to active users with a default name
    const userName = `User ${this.activeUsers.size + 1}`;
    this.activeUsers.set(conn.id, { id: conn.id, name: userName });
    
    // Broadcast updated user list
    this.broadcastActiveUsers();
    
    // Send the current flow state to the new connection
    await this.sendFlowState(conn);
  }

  async onClose(conn: Party.Connection) {
    console.log(`Connection closed: ${conn.id}`);
    
    // Remove user from active users
    this.activeUsers.delete(conn.id);
    
    // Broadcast updated user list
    this.broadcastActiveUsers();
  }

  // Broadcast active users to all connections
  private broadcastActiveUsers() {
    const users = Array.from(this.activeUsers.values());
    console.log(`Broadcasting ${users.length} active users`);
    
    this.party.broadcast(JSON.stringify({
      type: "active_users",
      data: users
    }));
  }

  async onMessage(message: string, sender: Party.Connection) {
    try {
      const parsedMessage = JSON.parse(message) as Message;
      console.log(`Received message from ${sender.id}:`, parsedMessage.type);
      
      // Handle different message types
      switch (parsedMessage.type) {
        case "hello":
          // Handle hello messages - broadcast to all clients
          console.log(`Hello message from ${sender.id}:`, parsedMessage.data);
          this.party.broadcast(JSON.stringify(parsedMessage), []);
          break;
        case "node_update":
          await this.handleNodeUpdate(parsedMessage.data as NodeUpdateData, sender);
          break;
        case "edge_update":
          await this.handleEdgeUpdate(parsedMessage.data as EdgeUpdateData, sender);
          break;
        case "node_delete":
          await this.handleNodeDelete(parsedMessage.data as DeleteData, sender);
          break;
        case "edge_delete":
          await this.handleEdgeDelete(parsedMessage.data as DeleteData, sender);
          break;
        case "position_update":
          await this.handlePositionUpdate(parsedMessage.data as PositionUpdateData, sender);
          break;
        case "request_state":
          // Send the current state to the requesting connection
          console.log(`State requested by ${sender.id}`);
          await this.sendFlowState(sender);
          break;
        case "clear_state":
          // Handle clear state request - clear the state and notify all clients
          console.log(`Clear state requested by ${sender.id}`);
          this.flowState = {
            nodes: {},
            edges: {},
            lastUpdated: Date.now()
          };
          await this.saveFlowState();
          this.party.broadcast(JSON.stringify({
            type: "clear_state",
            data: { timestamp: Date.now() }
          }), []);
          break;
        case "active_users":
          console.log("Received active users message, ignoring");
          break;
        default:
          console.log(`Unknown message type: ${parsedMessage.type}`);
      }
    } catch (error) {
      console.error(`Error processing message: ${error}`);
    }
  }

  // Send the current flow state to a connection
  private async sendFlowState(conn: Party.Connection) {
    console.log(`Sending flow state to ${conn.id}. Nodes: ${Object.keys(this.flowState.nodes).length}, Edges: ${Object.keys(this.flowState.edges).length}`);
    
    try {
      // First, send a clear state message to ensure the client starts fresh
      conn.send(JSON.stringify({
        type: "clear_state",
        data: { timestamp: Date.now() }
      }));
      
      // Add a small delay to ensure the clear state message is processed
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Send all nodes
      for (const nodeId in this.flowState.nodes) {
        const nodeData = this.flowState.nodes[nodeId];
        console.log(`Sending node ${nodeId} to ${conn.id}:`, JSON.stringify(nodeData));
        conn.send(JSON.stringify({
          type: "node_update",
          data: nodeData
        }));
        
        // Add a small delay between messages to ensure they're processed in order
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Add a small delay before sending edges to ensure nodes are processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Send all edges
      for (const edgeId in this.flowState.edges) {
        const edgeData = this.flowState.edges[edgeId];
        console.log(`Sending edge ${edgeId} to ${conn.id}:`, JSON.stringify(edgeData));
        conn.send(JSON.stringify({
          type: "edge_update",
          data: edgeData
        }));
        
        // Add a small delay between messages to ensure they're processed in order
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // Add a small delay before sending state complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Send a state complete message
      conn.send(JSON.stringify({
        type: "state_complete",
        data: { timestamp: Date.now() }
      }));
    } catch (error) {
      console.error(`Error sending flow state to ${conn.id}:`, error);
    }
  }

  // Handle node update
  private async handleNodeUpdate(data: NodeUpdateData, sender: Party.Connection) {
    console.log(`Handling node update: ${data.id}`);
    try {
      // Ensure the node has all required properties
      if (!data.id || !data.type || !data.position || !data.data) {
        console.error("Invalid node data received:", data);
        return;
      }
      
      // Update the node in the flow state
      this.flowState.nodes[data.id] = data;
      this.flowState.lastUpdated = Date.now();
      
      // Broadcast the update to all other connections
      this.party.broadcast(JSON.stringify({
        type: "node_update",
        data
      }), [sender.id]); // Exclude the sender
      
      // Save the updated state
      await this.saveFlowState();
    } catch (error) {
      console.error(`Error handling node update for ${data.id}:`, error);
    }
  }

  // Handle edge update
  private async handleEdgeUpdate(data: EdgeUpdateData, sender: Party.Connection) {
    console.log(`Handling edge update: ${data.id}`);
    try {
      // Ensure the edge has all required properties
      if (!data.id || !data.source || !data.target) {
        console.error("Invalid edge data received:", data);
        return;
      }
      
      // Update the edge in the flow state
      this.flowState.edges[data.id] = data;
      this.flowState.lastUpdated = Date.now();
      
      // Broadcast the update to all other connections
      this.party.broadcast(JSON.stringify({
        type: "edge_update",
        data
      }), [sender.id]); // Exclude the sender
      
      // Save the updated state
      await this.saveFlowState();
    } catch (error) {
      console.error(`Error handling edge update for ${data.id}:`, error);
    }
  }

  // Handle node delete
  private async handleNodeDelete(data: DeleteData, sender: Party.Connection) {
    console.log(`Handling node delete: ${data.id}`);
    try {
      // Delete the node from the flow state
      delete this.flowState.nodes[data.id];
      this.flowState.lastUpdated = Date.now();
      
      // Broadcast the delete to all other connections
      this.party.broadcast(JSON.stringify({
        type: "node_delete",
        data
      }), [sender.id]); // Exclude the sender
      
      // Save the updated state
      await this.saveFlowState();
    } catch (error) {
      console.error(`Error handling node delete for ${data.id}:`, error);
    }
  }

  // Handle edge delete
  private async handleEdgeDelete(data: DeleteData, sender: Party.Connection) {
    console.log(`Handling edge delete: ${data.id}`);
    try {
      // Delete the edge from the flow state
      delete this.flowState.edges[data.id];
      this.flowState.lastUpdated = Date.now();
      
      // Broadcast the delete to all other connections
      this.party.broadcast(JSON.stringify({
        type: "edge_delete",
        data
      }), [sender.id]); // Exclude the sender
      
      // Save the updated state
      await this.saveFlowState();
    } catch (error) {
      console.error(`Error handling edge delete for ${data.id}:`, error);
    }
  }

  // Handle position update
  private async handlePositionUpdate(data: PositionUpdateData, sender: Party.Connection) {
    console.log(`Handling position update: ${data.id}`);
    try {
      // Update the node position in the flow state
      const node = this.flowState.nodes[data.id];
      if (node) {
        node.position = data.position;
        this.flowState.lastUpdated = Date.now();
        
        // Broadcast the position update to all other connections
        this.party.broadcast(JSON.stringify({
          type: "position_update",
          data
        }), [sender.id]); // Exclude the sender
        
        // Save the updated state
        await this.saveFlowState();
      } else {
        console.warn(`Node ${data.id} not found for position update`);
      }
    } catch (error) {
      console.error(`Error handling position update for ${data.id}:`, error);
    }
  }

  // Save the flow state to storage
  private async saveFlowState() {
    try {
      console.log("Saving flow state to storage...");
      await this.party.storage.put("flowState", this.flowState);
    } catch (error) {
      console.error("Error saving flow state:", error);
    }
  }
}
