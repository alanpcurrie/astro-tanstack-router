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
import {  useCallback, useEffect, useReducer, useMemo } from "react";
import { parse } from 'yaml';

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
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalS}`,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase200,
    width: 'fit-content',
  },
  online: {
    backgroundColor: tokens.colorStatusSuccessBackground1,
    color: tokens.colorStatusSuccessForeground1,
  },
  warning: {
    backgroundColor: tokens.colorStatusWarningBackground1,
    color: tokens.colorStatusWarningForeground1,
  },
  offline: {
    backgroundColor: tokens.colorStatusDangerBackground1,
    color: tokens.colorStatusDangerForeground1,
  },
  detailsPanel: {
    position: 'absolute',
    right: '20px',
    top: '20px',
    width: '300px',
    zIndex: 1000,
    padding: tokens.spacingVerticalM,
  },
  detailsContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
});

type FlowData = {
  nodes: CustomNodeData[];
  edges: Edge[];
}

type CustomNodeData = {
  data: {
    description?: string;
    label: string;
    status: 'online' | 'warning' | 'offline';
  }
} & Node

type FlowState = {
  nodesById: Record<string, CustomNodeData>;
  edgesById: Record<string, Edge>;
  selectedNodeId: string | null;
}

type FlowAction =
  | { type: 'SET_NODES'; nodes: CustomNodeData[] }
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

const loadFlowFromYaml = async (): Promise<FlowData> => {
  const response = await fetch('/src/data/flow.yml');
  const yamlText = await response.text();
  return parse(yamlText) as FlowData;
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
  return (
    <Tooltip content={data.description ??  "default node"} relationship="label">
      <div className={styles.node}>
        <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
        <div className={styles.nodeContent}>
          <div className={`${styles.statusIndicator} ${styles[data.status]}`} />
          <Text>{data.label}</Text>
        </div>
        <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      </div>
    </Tooltip>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const Flow = () => {
  const styles = useStyles();
  const [state, dispatch] = useReducer(flowReducer, initialState);
  const nodes = useMemo(() => Object.values(state.nodesById), [state.nodesById]);
  const edges = useMemo(() => Object.values(state.edgesById), [state.edgesById]);
  const selectedNode = useMemo(
    () => state.selectedNodeId ? state.nodesById[state.selectedNodeId] : null,
    [state.selectedNodeId, state.nodesById]
  );

  useEffect(() => {
    loadFlowFromYaml().then((flowData) => {
      dispatch({ type: 'SET_NODES', nodes: flowData.nodes });
      dispatch({ type: 'SET_EDGES', edges: flowData.edges });
    });
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
    <Card>
      <Text weight="semibold" size={500}>Systems Diagram</Text>
      <div className={styles.flowContainer}>
        {selectedNode && (
          <Card className={styles.detailsPanel}>
            <div className={styles.detailsContent}>
              <Text weight="semibold" size={500}>{selectedNode.data.label}</Text>
              <div className={`${styles.statusBadge} ${styles[selectedNode.data.status]}`}>
                <div className={`${styles.statusIndicator} ${styles[selectedNode.data.status]}`} />
                <Text>{selectedNode.data.status.charAt(0).toUpperCase() + selectedNode.data.status.slice(1)}</Text>
              </div>
              {selectedNode.data.description && (
                <Text>{selectedNode.data.description?.toString() || ''}</Text>
              )}
              <Text size={200}>Node ID: {selectedNode.id}</Text>
            </div>
          </Card>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          proOptions={proOptions}
        >
          <Background />
          <Controls />
          <MiniMap 
            nodeColor={tokens.colorNeutralBackground3}
            maskColor={tokens.colorNeutralBackground1Hover}
            style={{
              backgroundColor: tokens.colorNeutralBackground2,
              border: `1px solid ${tokens.colorNeutralStroke1}`,
              borderRadius: tokens.borderRadiusSmall,
            }}
            zoomable
            pannable
          />
        </ReactFlow>
      </div>
    </Card>
  );
};

export default Flow;
