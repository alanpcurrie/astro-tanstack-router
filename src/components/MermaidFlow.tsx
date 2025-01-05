import { makeStyles, tokens, Text, Card, Tooltip } from "@fluentui/react-components";
import {
  ReactFlow,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  Position,
  type Connection,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useReducer, useMemo } from "react";
import { parseMermaidFlowchart } from '~/utils/mermaidParser';

const useStyles = makeStyles({
  flowContainer: {
    width: "100%",
    height: "80vh",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    background: tokens.colorNeutralBackground1,
  },
  node: {
    padding: tokens.spacingVerticalM,
    background: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
    minWidth: "150px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      boxShadow: tokens.shadow4,
      transform: "translateY(-2px)",
    },
  },
  nodeContent: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  statusIndicator: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    marginRight: "8px",
  },
});

type FlowState = {
  nodesById: Record<string, Node>;
  edgesById: Record<string, Edge>;
  selectedNodeId: string | null;
}

type FlowAction =
  | { type: 'SET_NODES'; nodes: Node[] }
  | { type: 'UPDATE_NODES'; changes: NodeChange[] }
  | { type: 'SET_EDGES'; edges: Edge[] }
  | { type: 'UPDATE_EDGES'; changes: EdgeChange[] }
  | { type: 'ADD_EDGE'; edge: Edge }
  | { type: 'SELECT_NODE'; nodeId: string | null };

const initialState: FlowState = {
  nodesById: {},
  edgesById: {},
  selectedNodeId: null,
};

type ActionHandlers = {
  [K in FlowAction['type']]: (state: FlowState, action: Extract<FlowAction, { type: K }>) => FlowState;
};

const actionHandlers: ActionHandlers = {
  SET_NODES: (state, action) => ({
    ...state,
    nodesById: action.nodes.reduce((acc, node) => ({
      ...acc,
      [node.id]: node,
    }), {}),
  }),
  
  UPDATE_NODES: (state, action) => {
    const updatedNodes = applyNodeChanges(action.changes, Object.values(state.nodesById));
    return {
      ...state,
      nodesById: updatedNodes.reduce((acc, node) => ({
        ...acc,
        [node.id]: node,
      }), {}),
    };
  },
  
  SET_EDGES: (state, action) => ({
    ...state,
    edgesById: action.edges.reduce((acc, edge) => ({
      ...acc,
      [edge.id]: edge,
    }), {}),
  }),
  
  UPDATE_EDGES: (state, action) => {
    const updatedEdges = applyEdgeChanges(action.changes, Object.values(state.edgesById));
    return {
      ...state,
      edgesById: updatedEdges.reduce((acc, edge) => ({
        ...acc,
        [edge.id]: edge,
      }), {}),
    };
  },
  
  ADD_EDGE: (state, action) => ({
    ...state,
    edgesById: {
      ...state.edgesById,
      [action.edge.id]: action.edge,
    },
  }),
  
  SELECT_NODE: (state, action) => ({
    ...state,
    selectedNodeId: action.nodeId,
  }),
};

const flowReducer = (state: FlowState, action: FlowAction): FlowState => {
  const handler = actionHandlers[action.type];
  return handler(state, action as any);
};

const CustomNode = ({ data, isConnectable }: { 
  data: { 
    description?: string; 
    label: string; 
    status: 'online' | 'warning' | 'offline';
  }, 
  isConnectable: boolean 
}) => {
  const styles = useStyles();
  const statusColors = {
    online: tokens.colorStatusSuccessBackground1,
    warning: tokens.colorStatusWarningBackground1,
    offline: tokens.colorStatusDangerBackground1,
  };

  return (
    <div className={styles.node}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Tooltip content={data.description || 'No description available'} relationship="label">
        <div className={styles.nodeContent}>
          <div
            className={styles.statusIndicator}
            style={{ background: statusColors[data.status] }}
          />
          <Text>{data.label}</Text>
        </div>
      </Tooltip>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const MermaidFlow = () => {
  const styles = useStyles();
  const [state, dispatch] = useReducer(flowReducer, initialState);
  const nodes = useMemo(() => Object.values(state.nodesById), [state.nodesById]);
  const edges = useMemo(() => Object.values(state.edgesById), [state.edgesById]);
  const selectedNode = useMemo(
    () => state.selectedNodeId ? state.nodesById[state.selectedNodeId] : null,
    [state.selectedNodeId, state.nodesById]
  );

  useEffect(() => {
    const loadFlow = async () => {
      try {
        const response = await fetch('/src/data/flow.mmd');
        const mermaidText = await response.text();
        const flowData = parseMermaidFlowchart(mermaidText);
        dispatch({ type: 'SET_NODES', nodes: flowData.nodes });
        dispatch({ type: 'SET_EDGES', edges: flowData.edges });
      } catch (error) {
        console.error('Failed to load Mermaid flow:', error);
      }
    };
    
    loadFlow();
  }, []);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    dispatch({ type: 'UPDATE_NODES', changes });
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    dispatch({ type: 'UPDATE_EDGES', changes });
  }, []);

  const onConnect = useCallback((params: Connection) => {
    const newEdge = { ...params, animated: true, id: `e${params.source}-${params.target}` };
    dispatch({ type: 'ADD_EDGE', edge: newEdge });
  }, []);

  const onNodeClick = useCallback((_event: any, node: Node) => {
    dispatch({ type: 'SELECT_NODE', nodeId: node.id });
  }, []);

  const proOptions = { hideAttribution: true };

  return (
    <div>
      <div className={styles.flowContainer}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      {selectedNode && (
        <Card>
          <Text>Selected: {selectedNode.data?.label}</Text>
          <Text>Status: {selectedNode.data?.status}</Text>
          {selectedNode.data?.description && (
            <Text>Description: {selectedNode.data.description}</Text>
          )}
        </Card>
      )}
    </div>
  );
};

export default MermaidFlow;
