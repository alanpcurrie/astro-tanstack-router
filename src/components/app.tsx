import {
	type BrandVariants,
	createDarkTheme,
	createLightTheme,
	FluentProvider,
	type Theme,
	webLightTheme,
} from "@fluentui/react-components";
import {
	Link,
	Outlet,
	RouterProvider,
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Monty from "~components/Monty";
import System from "~components/System";
import FlowState from "~components/FlowState";
import SystemFlow from "~components/SystemFlow";
import MermaidFlow from "~components/MermaidFlow";

const cazoo: BrandVariants = { 
	10: "#060201",
	20: "#24120B",
	30: "#3E1A13",
	40: "#532117",
	50: "#69271B",
	60: "#802D1F",
	70: "#983323",
	80: "#B03827",
	90: "#C93E2B",
	100: "#DA4E37",
	110: "#E2654C",
	120: "#E97A62",
	130: "#EF8F79",
	140: "#F5A390",
	150: "#F9B8A7",
	160: "#FCCCBF"
};

const lightTheme: Theme = {
	...createLightTheme(cazoo), 
};

const darkTheme: Theme = {
	...createDarkTheme(cazoo), 
};

const COLOR_PINK = "#ff0090";
const COLOR_CYAN = "#00e5ff";
const COLOR_DARK_BG = "#0f0e17";
const COLOR_LIGHT_TEXT = "#f4f4f8";
const COLOR_MINT = "#00f5d4";
const COLOR_PURPLE = "#a239ca";
const COLOR_ORANGE = "#ff6f3c";
const COLOR_VIOLET = "#e500ff";
const COLOR_YELLOW = "#ffde7d";
const COLOR_WHITE = "white";
const COLOR_NAV_BG = "#333";
const COLOR_MAGENTA = "#ff00ff";

const FONT_FAMILY_COURIER = "'Courier New', Courier, monospace";

const BORDER_RADIUS_MEDIUM = "12px";
const BORDER_RADIUS_SMALL = "8px";

const SHADOW_SMALL = `0px 0px 10px ${COLOR_PINK}`;
const SHADOW_LARGE = `0px 0px 20px ${COLOR_CYAN}`;

const SPACING_HORIZONTAL_M = "16px";
const SPACING_VERTICAL_M = "12px";
const SPACING_HORIZONTAL_L = "24px";

const cyberpunkTheme: Theme = {
	...webLightTheme,
	colorBrandBackground: COLOR_PINK,
	colorBrandBackgroundHover: COLOR_CYAN,
	colorNeutralBackground1: COLOR_DARK_BG,
	colorNeutralForeground1: COLOR_LIGHT_TEXT,
	colorBrandForeground1: COLOR_MINT,
	colorNeutralStroke1: COLOR_PURPLE,
	colorBrandBackgroundPressed: COLOR_ORANGE,
	colorNeutralForeground2: COLOR_YELLOW,

	fontFamilyBase: FONT_FAMILY_COURIER,
	fontFamilyMonospace: FONT_FAMILY_COURIER,
	fontWeightBold: 700,

	borderRadiusMedium: BORDER_RADIUS_MEDIUM,
	borderRadiusSmall: BORDER_RADIUS_SMALL,

	shadow2: SHADOW_SMALL,
	shadow4: SHADOW_LARGE,

	spacingHorizontalM: SPACING_HORIZONTAL_M,
	spacingVerticalM: SPACING_VERTICAL_M,
	spacingHorizontalL: SPACING_HORIZONTAL_L,
};

const Index = () => (
	<h1 style={{ color: COLOR_WHITE }}>Welcome to the Dashboard</h1>
);
const Settings = () => <h1 style={{ color: COLOR_WHITE }}>Settings</h1>;
const Profile = () => <h1 style={{ color: COLOR_WHITE }}>Profile</h1>;

const Layout = () => (
	<div style={{ fontFamily: FONT_FAMILY_COURIER }}>
		<nav
			style={{
				backgroundColor: COLOR_NAV_BG,
				padding: "10px 0",
				borderRadius: BORDER_RADIUS_MEDIUM,
				boxShadow: SHADOW_LARGE,
			}}
		>
			<ul
				style={{
					listStyle: "none",
					padding: 0,
					margin: 0,
					display: "flex",
					justifyContent: "center",
				}}
			>
				<li style={{ margin: "0 10px" }}>
					<Link
						to="/"
						style={{
							color: COLOR_PINK,
							textDecoration: "none",
							fontSize: "16px",
						}}
					>
						Dashboard
					</Link>
				</li>
				<li style={{ margin: "0 10px" }}>
					<Link
						to="/settings"
						style={{
							color: COLOR_CYAN,
							textDecoration: "none",
							fontSize: "16px",
						}}
					>
						Settings
					</Link>
				</li>
				<li style={{ margin: "0 10px" }}>
					<Link
						to="/profile"
						style={{
							color: COLOR_MINT,
							textDecoration: "none",
							fontSize: "16px",
						}}
					>
						Profile
					</Link>
				</li>
				<li style={{ margin: "0 10px" }}>
					<Link
						to="/monty"
						style={{
							color: COLOR_VIOLET,
							textDecoration: "none",
							fontSize: "16px",
						}}
					>
						Monty
					</Link>
				</li>
				<li style={{ margin: "0 10px" }}>
					<Link
						to="/system"
						style={{
							color: COLOR_ORANGE,
							textDecoration: "none",
							fontSize: "16px",
						}}
					>
						System
					</Link>
				</li>
				<li style={{ margin: "0 10px" }}>
					<Link
						to="/system-flow"
						style={{
							color: COLOR_CYAN,
							textDecoration: "none",
							fontSize: "16px",
						}}
					>
						System Flow
					</Link>
				</li>
				<li style={{ margin: "0 10px" }}>
					<Link
						to="/flow"
						style={{
							color: COLOR_MAGENTA,
							textDecoration: "none",
							fontSize: "16px",
						}}
					>
						Flow
					</Link>
				</li>
				<li style={{ margin: "0 10px" }}>
					<Link
						to="/mermaid-flow"
						style={{
							color: COLOR_YELLOW,
							textDecoration: "none",
							fontSize: "16px",
						}}
					>
						Mermaid Flow
					</Link>
				</li>
			</ul>
		</nav>
		<hr />
		<div
			style={{
				padding: "20px",
				backgroundColor: COLOR_DARK_BG,
				borderRadius: BORDER_RADIUS_SMALL,
			}}
		>
			<Outlet />
		</div>
		<TanStackRouterDevtools />
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
