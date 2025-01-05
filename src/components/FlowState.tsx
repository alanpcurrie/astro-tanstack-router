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
} from "@xyflow/react";
import { memo, useCallback } from "react";
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import { makeStyles, tokens, Text, Card, Tooltip } from "@fluentui/react-components";

import "@xyflow/react/dist/style.css";

const initialNodes: Array<CustomNodeData> = [
  {
    id: "1",
    type: "custom",
    data: { 
      label: "Main Power Core",
      status: "online",
      description: "Central power distribution system - Operating at 98% efficiency",
    },
    position: { x: 250, y: 0 },
  },
  {
    id: "2",
    type: "custom",
    data: { 
      label: "Life Support Systems",
      status: "warning",
      description: "Atmospheric regulation and recycling - Filter maintenance required",
    },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    type: "custom",
    data: { 
      label: "Navigation Systems",
      status: "online",
      description: "Guidance and positioning systems - All systems nominal",
    },
    position: { x: 400, y: 100 },
  },
  {
    id: "4",
    type: "custom",
    data: { 
      label: "Environmental Control",
      status: "offline",
      description: "Temperature and humidity control - System maintenance in progress",
    },
    position: { x: 100, y: 200 },
  },
  {
    id: "5",
    type: "custom",
    data: { 
      label: "Propulsion Systems",
      status: "online",
      description: "Main thrusters and maneuvering systems - Operating at full capacity",
    },
    position: { x: 400, y: 200 },
  },
];

const initialEdges: Array<Edge> = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e3-5", source: "3", target: "5" },
];

const useStyles = makeStyles({
  flowContainer: {
    width: "100%",
    height: "80vh",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    background: tokens.colorNeutralBackground1
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
    }
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

type Data = {
  readonly label: string;
  readonly status: 'online' | 'warning' | 'offline';
  readonly description?: string;
}

type CustomNodeData = Node & { readonly data: Data };

type FlowState = Readonly<{
  nodes: Array<Node>;
  edges: Array<Edge>;
  selectedNode: CustomNodeData | null;
}>

const updateNodes = (changes: Array<NodeChange>) => (nodes: Array<Node>): Array<Node> =>
  applyNodeChanges(changes, nodes);

const updateEdges = (changes: Array<EdgeChange>) => (edges: Array<Edge>): Array<Edge> =>
  applyEdgeChanges(changes, edges);

const addEdge = (connection: Connection) => (edges: Array<Edge>): Array<Edge> => [
  ...edges,
  {
    ...connection,
    animated: true,
    id: `e${connection.source}-${connection.target}`,
  },
];

const flowStore = createStore({
  context: {
    nodes: initialNodes,
    edges: initialEdges,
    selectedNode: null,
  } as FlowState,
  on: {
    updateNodes: (context, event: { changes: Array<NodeChange> }) => ({
      ...context,
      nodes: updateNodes(event.changes)(context.nodes),
    }),
    updateEdges: (context, event: { changes: Array<EdgeChange> }) => ({
      ...context,
      edges: updateEdges(event.changes)(context.edges),
    }),
    connect: (context, event: { connection: Connection }) => ({
      ...context,
      edges: addEdge(event.connection)(context.edges),
    }),
    selectNode: (context, event: { node: CustomNodeData }) => ({
      ...context,
      selectedNode: event.node,
    }),
  },
});

const CustomNode = memo(({ data, isConnectable }: { 
  data: Data;
  isConnectable: boolean;
}) => {
  const styles = useStyles();
  return (
    <Tooltip content={data.description ?? "default node"} relationship="label">
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
});

CustomNode.displayName = 'CustomNode';

const NodeDetailsCard = memo(({ node }: { node: CustomNodeData }) => {
  const styles = useStyles();
  
  return (
    <Card className={styles.detailsPanel}>
      <div className={styles.detailsContent}>
        <Text weight="semibold" size={500}>{node.data.label}</Text>
        <div className={`${styles.statusBadge} ${styles[node.data.status]}`}>
          <div className={`${styles.statusIndicator} ${styles[node.data.status]}`} />
          <Text>
            {node.data.status.charAt(0).toUpperCase() + node.data.status.slice(1)}
          </Text>
        </div>
        {node.data.description && (
          <Text>{node.data.description}</Text>
        )}
        <Text size={200}>Node ID: {node.id}</Text>
      </div>
    </Card>
  );
});

NodeDetailsCard.displayName = 'NodeDetailsCard';

const nodeTypes = {
  custom: CustomNode,
};

const Flow = () => {
  const styles = useStyles();
  const nodesState = useSelector(flowStore, state => state.context.nodes);
  const edgesState = useSelector(flowStore, state => state.context.edges);
  const selectedNode = useSelector(flowStore, state => state.context.selectedNode);

  const onNodesChange = useCallback((changes: Array<NodeChange>) => {
    flowStore.send({ type: 'updateNodes', changes });
  }, []);

  const onEdgesChange = useCallback((changes: Array<EdgeChange>) => {
    flowStore.send({ type: 'updateEdges', changes });
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    flowStore.send({ type: 'connect', connection });
  }, []);

  const onNodeClick: NodeMouseHandler = (_event, node) => {
    flowStore.send({ type: 'selectNode', node: node as CustomNodeData });
  };

  const proOptions = { hideAttribution: true };

  return (
    <Card>
      <Text weight="semibold" size={500}>Systems Diagram</Text>
      <div className={styles.flowContainer}>
        {selectedNode && <NodeDetailsCard node={selectedNode} />}
        <ReactFlow
          nodes={nodesState}
          edges={edgesState}
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
