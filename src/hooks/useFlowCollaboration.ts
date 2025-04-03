import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";
import { applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import type {
	Connection,
	Edge,
	EdgeChange,
	Node,
	NodeChange,
} from "@xyflow/react";
import { PartySocket } from "partysocket";
import { useCallback, useEffect, useRef, useState } from "react";


type NodeUpdateData = {
	id: string;
	type: string;
	data: Record<string, unknown>;
	position: { x: number; y: number };
	[key: string]: unknown;
}

type EdgeUpdateData = {
	id: string;
	source: string;
	target: string;
	[key: string]: unknown;
}

type PositionUpdateData = {
	id: string;
	position: { x: number; y: number };
}

type DeleteData = {
	id: string;
}

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

type MessageHandlers = {
	[key in MessageType]?: (data: unknown) => void;
};
export type MessageHandler = (message: { type: string; data: unknown }) => void;

export type ActiveUser = {
	id: string;
	name: string;
}

type FlowState = {
	nodes: Array<Node>;
	edges: Array<Edge>;
	isConnected: boolean;
}

type UseFlowCollaborationProps = {
	initialNodes?: Array<Node>;
	initialEdges?: Array<Edge>;
	onMessage?: MessageHandler; 
	onActiveUsersChange?: (users: ActiveUser[]) => void;
}

type UseFlowCollaboration = {
	isConnected: boolean;
	isInitialized: boolean;
	nodes: Array<Node>;
	edges: Array<Edge>;
	onNodesChange: (changes: NodeChange[]) => void;
	onEdgesChange: (changes: EdgeChange[]) => void;
	onConnect: (connection: Connection) => void;
	broadcastNodeUpdate: (node: Node) => void;
	broadcastEdgeUpdate: (edge: Edge) => void;
	broadcastNodeDelete: (nodeId: string) => void;
	broadcastEdgeDelete: (edgeId: string) => void;
	broadcastPositionUpdate: (
		nodeId: string,
		position: { x: number; y: number },
	) => void;
	onConnectionChange: (callback: (isConnected: boolean) => void) => void;
	sendMessage: (type: string, data: unknown) => void;
	socket: PartySocket | null;
}

const updateNodes =
	(changes: Array<NodeChange>) =>
	(nodes: Array<Node>): Array<Node> =>
		applyNodeChanges(changes, nodes);

const updateEdges =
	(changes: Array<EdgeChange>) =>
	(edges: Array<Edge>): Array<Edge> =>
		applyEdgeChanges(changes, edges);

const addEdge =
	(connection: Connection) =>
	(edges: Array<Edge>): Array<Edge> => [
		...edges,
		{
			...connection,
			animated: true,
			id: `e${connection.source}-${connection.target}`,
		},
	];

export function useFlowCollaboration({
	initialNodes = [],
	initialEdges = [],
	onMessage,
	onActiveUsersChange,
}: UseFlowCollaborationProps): UseFlowCollaboration {
	const [isInitialized, setIsInitialized] = useState(false);
	const socketRef = useRef<PartySocket | null>(null);
	const connectionCallbacksRef = useRef<((isConnected: boolean) => void)[]>([]);

	const flowStore = useRef(
		createStore({
			context: {
				nodes: initialNodes,
				edges: initialEdges,
				isConnected: false,
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
				setNodes: (context, event: { nodes: Array<Node> }) => ({
					...context,
					nodes: event.nodes,
				}),
				setEdges: (context, event: { edges: Array<Edge> }) => ({
					...context,
					edges: event.edges,
				}),
				setConnected: (context, event: { isConnected: boolean }) => ({
					...context,
					isConnected: event.isConnected,
				}),
				reset: () => ({
					nodes: [],
					edges: [],
					isConnected: false,
				}),
			},
		}),
	).current;

	const nodes = useSelector(flowStore, (state) => state.context.nodes);
	const edges = useSelector(flowStore, (state) => state.context.edges);
	const isConnected = useSelector(flowStore, (state) => state.context.isConnected);
	const messageHandlers = useRef<MessageHandlers>({
		node_update: (data: unknown) => {
			console.log("Received node update:", data);
			const nodeData = data as NodeUpdateData;

			flowStore.send({
				type: "updateNodes",
				changes: [{ type: "remove", id: nodeData.id }],
			});
			flowStore.send({
				type: "updateNodes",
				changes: [{ type: "add", item: nodeData }],
			});
		},
		edge_update: (data: unknown) => {
			console.log("Received edge update:", data);
			const edgeData = data as EdgeUpdateData;

			
			flowStore.send({
				type: "updateEdges",
				changes: [{ type: "remove", id: edgeData.id }],
			});

			flowStore.send({
				type: "updateEdges",
				changes: [{ type: "add", item: edgeData }],
			});
		},
		node_delete: (data: unknown) => {
			console.log("Received node delete:", data);
			const deleteData = data as DeleteData;
			flowStore.send({
				type: "updateNodes",
				changes: [{ type: "remove", id: deleteData.id }],
			});
		},
		edge_delete: (data: unknown) => {
			console.log("Received edge delete:", data);
			const deleteData = data as DeleteData;
			flowStore.send({
				type: "updateEdges",
				changes: [{ type: "remove", id: deleteData.id }],
			});
		},
		position_update: (data: unknown) => {
			console.log("Received position update:", data);
			const positionData = data as PositionUpdateData;
			flowStore.send({
				type: "updateNodes",
				changes: [
					{
						type: "position",
						id: positionData.id,
						position: positionData.position,
					},
				],
			});
		},
		clear_state: () => {
			console.log("Received clear state message");
			flowStore.send({ type: "reset" });
		},
		state_complete: () => {
			console.log("State synchronization complete");
			setIsInitialized(true);
		},
		hello: (data: unknown) => {
			console.log("Received hello message:", data);
			if (onMessage) {
				onMessage({ type: "hello", data });
			}
		},
		active_users: (data: unknown) => {
			console.log("Received active users:", data);
			const users = data as ActiveUser[];

			if (onActiveUsersChange) {
				onActiveUsersChange(users);
			}
		},
	}).current;

	useEffect(() => {
		console.log("Setting up PartySocket connection...");

		const socket = new PartySocket({
			host: "127.0.0.1:1999", 
			room: "flowchart",
		});

		socket.addEventListener("open", () => {
			console.log("Socket connected");
			flowStore.send({ type: "setConnected", isConnected: true });

			for (const callback of connectionCallbacksRef.current) {
				callback(true);
			}
			for (const callback of connectionCallbacksRef.current) {
				callback(true);
			}

			socket.send(
				JSON.stringify({
					type: "request_state",
					data: { timestamp: Date.now() },
				}),
			);
		});

		socket.addEventListener("close", () => {
			console.log("Socket disconnected");
			flowStore.send({ type: "setConnected", isConnected: false });
			setIsInitialized(false);

			for (const callback of connectionCallbacksRef.current) {
				callback(false);
			}
		});

		socketRef.current = socket;

		return () => {
			console.log("Cleaning up socket connection");
			socket.close();
			socketRef.current = null;
		};
	}, [flowStore]);

	useEffect(() => {
		if (!socketRef.current) return;

		const handleMessage = (event: MessageEvent) => {
			try {
				const message = JSON.parse(event.data);
				console.log("Received message:", message.type);

				const handler = messageHandlers[message.type as MessageType];
				if (handler) {
					handler(message.data);
				} else {
					console.warn("Unknown message type:", message.type);
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

	const onNodesChange = useCallback(
		(changes: NodeChange[]) => {
			console.log("Handling node changes:", changes);
			flowStore.send({ type: "updateNodes", changes });
		},
		[flowStore],
	);

	const onEdgesChange = useCallback(
		(changes: EdgeChange[]) => {
			console.log("Handling edge changes:", changes);
			flowStore.send({ type: "updateEdges", changes });
		},
		[flowStore],
	);

	const onConnect = useCallback(
		(connection: Connection) => {
			console.log("Handling connection:", connection);
			flowStore.send({ type: "connect", connection });
		},
		[flowStore],
	);

	// Define broadcast functions
	const broadcastNodeUpdate = useCallback(
		(node: Node) => {
			if (!socketRef.current || !isConnected) return;
			console.log("Broadcasting node update:", node);
			socketRef.current.send(
				JSON.stringify({
					type: "node_update",
					data: node,
				}),
			);
		},
		[isConnected],
	);

	const broadcastEdgeUpdate = useCallback(
		(edge: Edge) => {
			if (!socketRef.current || !isConnected) return;
			console.log("Broadcasting edge update:", edge);
			socketRef.current.send(
				JSON.stringify({
					type: "edge_update",
					data: edge,
				}),
			);
		},
		[isConnected],
	);

	const broadcastNodeDelete = useCallback(
		(nodeId: string) => {
			if (!socketRef.current || !isConnected) return;
			console.log("Broadcasting node delete:", nodeId);
			socketRef.current.send(
				JSON.stringify({
					type: "node_delete",
					data: { id: nodeId },
				}),
			);
		},
		[isConnected],
	);

	const broadcastEdgeDelete = useCallback(
		(edgeId: string) => {
			if (!socketRef.current || !isConnected) return;
			console.log("Broadcasting edge delete:", edgeId);
			socketRef.current.send(
				JSON.stringify({
					type: "edge_delete",
					data: { id: edgeId },
				}),
			);
		},
		[isConnected],
	);

	const broadcastPositionUpdate = useCallback(
		(nodeId: string, position: { x: number; y: number }) => {
			if (!socketRef.current || !isConnected) return;
			console.log("Broadcasting position update:", nodeId, position);
			socketRef.current.send(
				JSON.stringify({
					type: "position_update",
					data: { id: nodeId, position },
				}),
			);
		},
		[isConnected],
	);

	const sendMessage = useCallback(
		(type: string, data: unknown) => {
			if (!socketRef.current || !isConnected) return;
			console.log(`Sending message of type ${type}:`, data);
			socketRef.current.send(
				JSON.stringify({
					type,
					data,
				}),
			);
		},
		[isConnected],
	);

	const onConnectionChange = useCallback(
		(callback: (isConnected: boolean) => void) => {
			connectionCallbacksRef.current.push(callback);

			if (isConnected) {
				callback(true);
			}

			return () => {
				connectionCallbacksRef.current = connectionCallbacksRef.current.filter(
					(cb) => cb !== callback,
				);
			};
		},
		[isConnected],
	);

	return {
		isConnected,
		isInitialized,
		nodes,
		edges,
		onNodesChange,
		onEdgesChange,
		onConnect,
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
