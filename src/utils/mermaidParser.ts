import type { Edge, Node } from '@xyflow/react';

/**
 * F# Inspired Domain-Driven Design Type System
 * 
 * This module implements domain modeling principles from Scott Wlaschin's 
 * "Domain Modeling Made Functional" using TypeScript. While TypeScript lacks several
 * F# features for proper Algebraic Data Types (ADTs):
 * - True discriminated unions with associated data
 * - Pattern matching with exhaustiveness checking
 * - Type inference for generic constraints
 * - Record types with structural equality
 * - Units of measure
 * 
 * We approximate these concepts using TypeScript's type system:
 * - Union types with type predicates for discrimination
 * - Switch statements with type narrowing
 * - Readonly interfaces for immutable records
 * - Type aliases for domain primitives
 * 
 * Domain Type Categories (from the book):
 * 1. Single Case Types (Wrapped Primitives):
 *    - DisplayText: String wrapper for UI text
 *    - NodeIdentifier: String wrapper for IDs
 * 
 * 2. Sum Types (Discriminated Unions):
 *    - NodeStatus: Union of possible states
 *    - NodeVisualizationType: Union of rendering options
 *    - Result<T, E>: Success | Error (not implemented due to TS limitations)
 * 
 * 3. Product Types (Records):
 *    - Point2D: Immutable coordinate pair
 *    - NodeDisplayProperties: Bundle of display attributes
 * 
 * 4. Constrained Types:
 *    - ValidatedMermaidNode: Constrained version of UnparsedMermaidNode
 *    - ValidatedMermaidConnection: Ensures valid source/target
 * 
 * 5. Workflows (Type Transformations):
 *    - UnparsedMermaidNode -> ValidatedMermaidNode
 *    - UnparsedMermaidConnection -> ValidatedMermaidConnection
 * 
 * Key principles from the book:
 * - Make illegal states unrepresentable through type design
 * - Use types as a domain modeling tool
 * - Keep data immutable
 * - Model workflows as type transformations
 * - Capture business rules in the type system
 */

/**
 * F# Inspired Domain-Driven Design Type System
 * 
 * This type system follows F# DDD patterns to create a strongly-typed
 * and domain-focused codebase.
 */

// Single Case Types (Wrapped Primitives)
// These provide semantic meaning and type safety for primitive values
type DisplayText = string;
type NodeIdentifier = string;

// Sum Types (String Literal Unions)
// These represent a fixed set of possible values or states
type NodeStatus = 'online' | 'warning' | 'offline';
type NodeVisualizationType = 'custom' | 'default';

// Product Types (Records)
// These represent composite data structures with multiple fields
type Point2D = {
  readonly x: number;
  readonly y: number;
};

type NodeDisplayProperties = {
  readonly label: DisplayText;
  readonly description?: DisplayText;
  readonly status: NodeStatus;
};

// Constrained Types with Validation
// These types may have optional fields and require validation before use
type UnparsedMermaidNode = {
  readonly id: NodeIdentifier | undefined;
  readonly label: DisplayText | undefined;
  readonly status?: NodeStatus;
  readonly description?: DisplayText | undefined;
};

type ConnectionLabel = DisplayText;

type UnparsedMermaidConnection = {
  readonly sourceId: NodeIdentifier | undefined;
  readonly targetId: NodeIdentifier | undefined;
  readonly label?: ConnectionLabel | undefined;
};

type ValidatedMermaidNode = Readonly<{
  id: NodeIdentifier;
  label: DisplayText;
  status: NodeStatus;
  description?: DisplayText;
}>;

type ValidatedMermaidConnection = Readonly<{
  sourceId: NodeIdentifier;
  targetId: NodeIdentifier;
  label?: DisplayText;
}>;

// Flow-specific Types
type CustomNodeData = Node & {
  readonly data: NodeDisplayProperties;
  readonly position: Point2D;
  readonly coordinates: Point2D;
  readonly visualType?: NodeVisualizationType;
};

type FlowData = Readonly<{
  nodes: Array<CustomNodeData>;
  edges: Array<Edge>;
}>;

type MermaidSyntaxLine = string;
type OptionalMetadataLine = string | undefined;
type NodeDefinitionWithMetadata = [MermaidSyntaxLine, OptionalMetadataLine];

const NODE_DEFINITION_REGEX = /^(\w+)\[(.*?)\]$/;
const NODE_METADATA_REGEX = /^%%\|\s*({.*})$/;
const EDGE_DEFINITION_REGEX = /^(\w+)\s*--?>(?:\|(.*?)\|)?\s*(\w+)$/;
const FLOWCHART_DECLARATION_REGEX = /^(flowchart|graph)/;
const NEWLINE = '\n';
const VALID_STATUS: Array<NodeStatus> = ['online', 'warning', 'offline'] as const;

const addOptionalField = <T>(field: T | undefined, key: string): Record<string, T> =>
  field ? { [key]: field } : {};

const getDefaultStatus = (status: NodeStatus) =>
  VALID_STATUS.includes(status as NodeStatus) ? status as NodeStatus : 'online';

const getNodeLabel = (label: string | undefined) =>
  label ?? 'Untitled Node';

const createNodeDisplayProperties = (node: UnparsedMermaidNode): NodeDisplayProperties => ({
  label: getNodeLabel(node.label),
  status: node.status ?? 'offline',
  ...addOptionalField(node?.description, 'description')
});

const parseNodeMetadata = (metadataStr: string): Pick<UnparsedMermaidNode, 'status' | 'description'> => {
  try {
    const meta = JSON.parse(metadataStr);
    return {
      status: getDefaultStatus(meta.status),
      ...addOptionalField(meta?.description, 'description')
    };
  } catch {
    console.warn('Failed to parse node metadata');
    return { status: 'online' };
  }
};

const createEdgeId = (source: string, target: string) =>
  `e${source}-${target}`;

const calculateNodePosition = (index: number) => ({
  x: index * 200,
  y: index * 100,
});

const toFlowNode = (node: ValidatedMermaidNode, index: number): CustomNodeData => ({
  id: node.id,
  position: calculateNodePosition(index),
  visualType: 'custom',
  data: createNodeDisplayProperties(node),
  coordinates: calculateNodePosition(index),
});

const toFlowEdge = (edge: ValidatedMermaidConnection) => ({
  id: createEdgeId(edge.sourceId, edge.targetId),
  source: edge.sourceId,
  target: edge.targetId,
  label: edge.label,
  animated: true,
});

const parseNode = (line: string) => {
  const nodeMatch = line.match(NODE_DEFINITION_REGEX);
  if (!nodeMatch) return null;
  const [, id, label] = nodeMatch;
  return { id, label };
};

const parseNodeWithMetadata = ([line, nextLine]: NodeDefinitionWithMetadata) => {
  const node = parseNode(line);
  if (!node) return null;
  
  const [, metadata] = nextLine?.match(NODE_METADATA_REGEX) ?? [];
  return metadata 
    ? { ...node, ...parseNodeMetadata(metadata) }
    : node;
};

const parseEdge = (line: string): UnparsedMermaidConnection | null => {
  const edgeMatch = line.match(EDGE_DEFINITION_REGEX);
  if (!edgeMatch) return null;
  const [, source, label, target] = edgeMatch;
  return { sourceId: source, targetId: target, label };
};

const isContentLine = (line: string) => 
  line.length > 0 && !FLOWCHART_DECLARATION_REGEX.test(line);

const isValidEdge = (edge: UnparsedMermaidConnection): edge is ValidatedMermaidConnection =>
  edge.sourceId !== undefined && edge.targetId !== undefined;

const isValidNode = (node: UnparsedMermaidNode): node is ValidatedMermaidNode =>
  node.id !== undefined;

const isNonNullNode = (node: UnparsedMermaidNode | null) =>
  node !== null;

const isNonNullEdge = (edge: UnparsedMermaidConnection | null) =>
  edge !== null;

const parseMermaidFlowchart = (mermaidSyntax: string) => {
  const lines = mermaidSyntax
    .split(NEWLINE)
    .map(line => line.trim())
    .filter(isContentLine);
  
  const getLinePairs = lines.map((line, i) => [line, lines[i + 1]] as NodeDefinitionWithMetadata);
  
  const nodes = getLinePairs
    .map(parseNodeWithMetadata)
    .filter(isNonNullNode);

  const edges = lines
    .map(parseEdge)
    .filter(isNonNullEdge);

  const flowNodes = nodes
    .filter(isValidNode)
    .map(toFlowNode);

  const flowEdges = edges
    .filter(isValidEdge)
    .map(toFlowEdge);

  return { nodes: flowNodes, edges: flowEdges };
};

export { parseMermaidFlowchart };
export type { FlowData, UnparsedMermaidNode, UnparsedMermaidConnection };
