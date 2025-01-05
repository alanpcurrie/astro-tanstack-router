import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  NodeMouseHandler
} from "@xyflow/react";

export type Data = {
  readonly label: string;
  readonly status: 'online' | 'warning' | 'offline';
  readonly description?: string;
}

export type CustomNodeData = Node & { readonly data: Data };

export type FlowState = Readonly<{
  nodes: Array<Node>;
  edges: Array<Edge>;
  selectedNode: CustomNodeData | null;
}>

export type FlowNodeProps = {
  data: Data;
  isConnectable: boolean;
}

export type NodeDetailsProps = {
  node: CustomNodeData;
}

export type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  NodeMouseHandler
}
