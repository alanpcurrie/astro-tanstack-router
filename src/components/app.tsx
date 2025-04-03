import {
	FluentProvider
} from "@fluentui/react-components";
import {
	Outlet,
	RouterProvider,
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import Monty from "~components/Monty";
import System from "~components/System";
import FlowState from "~components/FlowState";
import SystemFlow from "~components/SystemFlow";
import MermaidFlow from "~components/MermaidFlow";
import ExperimentalFlow from "~components/ExperimentalFlow";
import NavBar from "~components/NavBar";
import { 
  cyberpunkTheme,
  appTokens
} from "../theme/c4Theme";

const Index = () => (
	<h1 style={{ color: cyberpunkTheme.colorNeutralForeground1 }}>Welcome to the Dashboard</h1>
);
const Settings = () => <h1 style={{ color: cyberpunkTheme.colorNeutralForeground1 }}>Settings</h1>;
const Profile = () => <h1 style={{ color: cyberpunkTheme.colorNeutralForeground1 }}>Profile</h1>;

const Layout = () => (
	<div style={{ 
		fontFamily: cyberpunkTheme.fontFamilyBase,
		backgroundColor: cyberpunkTheme.colorNeutralBackground1,
		minHeight: "100vh",
		display: "flex",
		flexDirection: "column"
	}}>
		<NavBar />
		<div
			style={{
				padding: appTokens.paddingL,
				backgroundColor: cyberpunkTheme.colorNeutralBackground1,
				borderRadius: cyberpunkTheme.borderRadiusSmall,
				margin: `0 ${appTokens.marginM}`,
				flex: 1, // Take up remaining space
				display: "flex",
				flexDirection: "column"
			}}
		>
			<Outlet />
		</div>
	</div>
);

const rootRoute = createRootRoute({
	component: Layout,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: Index,
});

const settingsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/settings",
	component: Settings,
});

const profileRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/profile",
	component: Profile,
});

const montyRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/monty",
	component: Monty,
});

const systemRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/system",
	component: System,
});

const systemFlowRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/system-flow",
	component: SystemFlow,
});

const flowRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/flow",
	component: FlowState,
});

const experimentalFlowRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/experimental-flow",
	component: ExperimentalFlow,
});

const mermaidFlowRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/mermaid-flow",
	component: MermaidFlow,
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	settingsRoute,
	profileRoute,
	montyRoute,
	systemRoute,
	systemFlowRoute,
	flowRoute,
	experimentalFlowRoute,
	mermaidFlowRoute,
]);

const router = createRouter({ routeTree });

export function App() {
	return (
		<FluentProvider theme={cyberpunkTheme}>
			<RouterProvider router={router} />
		</FluentProvider>
	);
}
