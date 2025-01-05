
import {
  Handle,
  MiniMap,
  Controls,
  Position,
  ReactFlow,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import {
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type NodeMouseHandler
} from "@xyflow/react";
import { useState, useCallback } from "react";
import { makeStyles, tokens, Text, Card, Tooltip } from "@fluentui/react-components";
import "@xyflow/react/dist/style.css";


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

const initialNodes: CustomNodeData[] = [
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

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
  { id: "e2-4", source: "2", target: "4" },
  { id: "e3-5", source: "3", target: "5" },
];

type Data = {
  label: string;
  status: 'online' | 'warning' | 'offline';
  description?: string;
}

type CustomNodeData = Node & {data: Data};


const nodeTypes = {
  custom: CustomNode,
};

const Flow = () => {
  const styles = useStyles();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<CustomNodeData | null>(null);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => [...eds, { ...params, animated: true, id: `e${params.source}-${params.target}` }]);
  }, []);

  const onNodeClick: NodeMouseHandler = (_event, node) => {
    const customNode = node as Node & { data: CustomNodeData['data'] };
    setSelectedNode(customNode);
  };

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
