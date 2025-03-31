import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from "@xyflow/react";

import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  MiniMap,
  Position,
  Handle,
} from "@xyflow/react";

import { memo, useCallback, useEffect, useMemo } from "react";
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import { makeStyles, tokens, Text, Card, Tooltip } from "@fluentui/react-components";
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { parseMermaidFlowchart } from '~/utils/mermaidParser';

type NodeData = {
  label: string;
  status: 'online' | 'warning' | 'offline';
  description?: string;
  [key: string]: unknown;
}

type FlowNode = Node<NodeData>;
type NodesById = Record<string, FlowNode>;
type EdgesById = Record<string, Edge>;

type FlowState = {
  nodesById: NodesById;
  edgesById: EdgesById;
  selectedNodeId: string | null;
}

const initialState: FlowState = {
  nodesById: {},
  edgesById: {},
  selectedNodeId: null,
};

const mermaidStore = createStore({
  context: initialState,
  on: {
    updateNodes(context, event: { changes: Array<NodeChange> }) {
      const updatedNodes = applyNodeChanges(event.changes, Object.values(context.nodesById)) as Array<FlowNode>;
      const newNodesById = updatedNodes.reduce<NodesById>((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {});
      return {
        nodesById: newNodesById,
        edgesById: context.edgesById,
        selectedNodeId: context.selectedNodeId,
      };
    },
    updateEdges(context, event: { changes: Array<EdgeChange> }) {
      const updatedEdges = applyEdgeChanges(event.changes, Object.values(context.edgesById));
      const newEdgesById = updatedEdges.reduce<EdgesById>((acc, edge) => {
        acc[edge.id] = edge;
        return acc;
      }, {});
      return {
        nodesById: context.nodesById,
        edgesById: newEdgesById,
        selectedNodeId: context.selectedNodeId,
      };
    },
    setNodes(context, event: { nodes: Array<FlowNode> }) {
      const newNodesById = event.nodes.reduce<NodesById>((acc, node) => {
        acc[node.id] = node;
        return acc;
      }, {});
      return {
        nodesById: newNodesById,
        edgesById: context.edgesById,
        selectedNodeId: context.selectedNodeId,
      };
    },
    setEdges(context, event: { edges: Array<Edge> }) {
      const newEdgesById = event.edges.reduce<EdgesById>((acc, edge) => {
        acc[edge.id] = edge;
        return acc;
      }, {});
      return {
        nodesById: context.nodesById,
        edgesById: newEdgesById,
        selectedNodeId: context.selectedNodeId,
      };
    },
    addEdge(context, event: { edge: Edge }) {
      return {
        nodesById: context.nodesById,
        edgesById: {
          ...context.edgesById,
          [event.edge.id]: event.edge,
        },
        selectedNodeId: context.selectedNodeId,
      };
    },
    selectNode(context, event: { nodeId: string | null }) {
      return {
        nodesById: context.nodesById,
        edgesById: context.edgesById,
        selectedNodeId: event.nodeId,
      };
    },
  },
});

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
  minimap: {
    background: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
    "& .react-flow__minimap-mask": {
      fill: tokens.colorNeutralBackground3Hover,
    },
    "& .react-flow__minimap-node": {
      fill: tokens.colorBrandBackground,
      stroke: tokens.colorNeutralForeground1,
    },
  },
  controls: {
    button: {
      background: tokens.colorNeutralBackground1,
      border: `1px solid ${tokens.colorNeutralStroke1}`,
      color: tokens.colorNeutralForeground1,
      "&:hover": {
        background: tokens.colorNeutralBackground1Hover,
      },
      "&:active": {
        background: tokens.colorNeutralBackground1Pressed,
      },
    },
    "& .react-flow__controls-button": {
      background: tokens.colorNeutralBackground1,
      border: `1px solid ${tokens.colorNeutralStroke1}`,
      color: tokens.colorNeutralForeground1,
      width: "24px",
      height: "24px",
      "&:hover": {
        background: tokens.colorNeutralBackground1Hover,
      },
      "&:active": {
        background: tokens.colorNeutralBackground1Pressed,
      },
      "& svg": {
        fill: tokens.colorNeutralForeground1,
        width: "12px",
        height: "12px",
      },
    },
    "& .react-flow__controls-button path": {
      fill: tokens.colorNeutralForeground1,
    },
  },
});

const CustomNode = memo(({ data, isConnectable }: { 
  data: NodeData, 
  isConnectable: boolean 
}) => {
  const styles = useStyles();
  const statusColors = {
    online: tokens.colorPaletteGreenBorder2,
    warning: tokens.colorPaletteYellowBorder2,
    offline: tokens.colorPaletteRedBorder2,
  };

  return (
    <div 
      className={styles.node}
      style={{ 
        borderColor: statusColors[data.status],
        borderWidth: '2px',
        borderStyle: 'solid'
      }}
    >
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
});

const nodeTypes = {
  custom: CustomNode,
};

const queryClient = new QueryClient();

const MermaidFlowInner = () => {
  const styles = useStyles();
  const nodesById = useSelector(mermaidStore, (state: { context: FlowState }) => state.context.nodesById);
  const edgesById = useSelector(mermaidStore, (state: { context: FlowState }) => state.context.edgesById);
  const selectedNodeId = useSelector(mermaidStore, (state: { context: FlowState }) => state.context.selectedNodeId);

  const { isLoading, error, data } = useQuery({
    queryKey: ['mermaidFlow'],
    queryFn: async () => {
      const response = await fetch('/src/data/flow.mmd');
      const mermaidText = await response.text();
      return parseMermaidFlowchart(mermaidText);
    }
  });

  const nodes = useMemo(() => {
    return Object.values(nodesById).map((node) => ({
      ...node,
      type: 'custom',
      data: {
        label: node.data.label,
        status: node.data.status,
        description: node.data.description,
        selected: node.id === selectedNodeId,
      },
    }));
  }, [nodesById, selectedNodeId]);

  const edges = useMemo(() => {
    return Object.values(edgesById);
  }, [edgesById]);

  const updateFlow = useCallback((flowData: { nodes: Array<FlowNode>, edges: Array<Edge> }) => {
    mermaidStore.send({ type: 'setNodes', nodes: flowData.nodes });
    mermaidStore.send({ type: 'setEdges', edges: flowData.edges });
  }, []);

  const onNodesChange = useCallback((changes: Array<NodeChange>) => {
    mermaidStore.send({ type: 'updateNodes', changes });
  }, []);

  const onEdgesChange = useCallback((changes: Array<EdgeChange>) => {
    mermaidStore.send({ type: 'updateEdges', changes });
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    mermaidStore.send({
      type: 'addEdge',
      edge: { ...connection, id: `e${connection.source}-${connection.target}` },
    });
  }, []);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    mermaidStore.send({ type: 'selectNode', nodeId: node.id });
  }, []);

  useEffect(() => {
    if (data) {
      updateFlow(data);
    }
  }, [data, updateFlow]);

  const SelectedNodeCard = memo(({ node }: { node: FlowNode }) => (
    <Card>
      <Text>Selected: {node.data.label}</Text>
      <Text>Status: {node.data.status}</Text>
      {node.data.description && (
        <Text>Description: {node.data.description}</Text>
      )}
    </Card>
  ));

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading flow chart</div>;

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
          fitView
        >
          <Background />
          <Controls 
            className={styles.controls}
            position="top-right"
            showZoom={true}
            showFitView={true}
            showInteractive={false}
          />
          <MiniMap
            className={styles.minimap}
            nodeColor={tokens.colorBrandBackground}
            maskColor={tokens.colorNeutralBackground3Hover}
            position="bottom-right"
            pannable
            zoomable
            nodeStrokeWidth={3}
          />
        </ReactFlow>
      </div>
      {selectedNodeId && nodesById[selectedNodeId] && (
        <SelectedNodeCard node={nodesById[selectedNodeId]} />
      )}
    </div>
  );
};

const MermaidFlow = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <MermaidFlowInner />
      </ReactFlowProvider>
    </QueryClientProvider>
  );
};

export default MermaidFlow;
