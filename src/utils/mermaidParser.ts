import { type Edge } from '@xyflow/react';


type CustomNodeData = {
  data: {
    description?: string;
    label: string;
    status: 'online' | 'warning' | 'offline';
  }
} & Node

type MermaidNode = {
  id: string;
  label: string;
  status?: 'online' | 'warning' | 'offline';
  description?: string;
};

type MermaidEdge = {
  source: string;
  target: string;
  label?: string;
};

type FlowData = {
  nodes: CustomNodeData[];
  edges: Edge[];
};

const parseMermaidFlowchart = (mermaidSyntax: string): FlowData => {
  const lines = mermaidSyntax.split('\n').map(line => line.trim());
  const nodes: MermaidNode[] = [];
  const edges: MermaidEdge[] = [];
  
  // Skip the flowchart declaration line
  const contentLines = lines.filter(line => 
    line && !line.startsWith('flowchart') && !line.startsWith('graph')
  );

  contentLines.forEach(line => {
    // Parse node definitions (e.g., "A[Service A]")
    const nodeMatch = line.match(/^(\w+)\[(.*?)\](\{.*?\})?$/);
    if (nodeMatch) {
      const [, id, label, metaStr] = nodeMatch;
      const meta = metaStr ? JSON.parse(metaStr.replace(/'/g, '"')) : {};
      nodes.push({
        id,
        label,
        status: meta.status || 'online',
        description: meta.description,
      });
      return;
    }

    // Parse edge definitions (e.g., "A --> B" or "A -->|label| B")
    const edgeMatch = line.match(/^(\w+)\s*--?>(?:\|(.*?)\|)?\s*(\w+)$/);
    if (edgeMatch) {
      const [, source, label, target] = edgeMatch;
      edges.push({ source, target, label });
    }
  });

  // Convert to React Flow format
  const flowNodes: CustomNodeData[] = nodes.map((node, index) => ({
    id: node.id,
    type: 'custom',
    position: { x: index * 200, y: index * 100 }, // Basic positioning
    data: {
      label: node.label,
      status: node.status || 'online',
      description: node.description,
    },
  }));

  const flowEdges: Edge[] = edges.map((edge, index) => ({
    id: `e${edge.source}-${edge.target}`,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    animated: true,
  }));

  return { nodes: flowNodes, edges: flowEdges };
};

export { parseMermaidFlowchart };
export type { FlowData, MermaidNode, MermaidEdge };
