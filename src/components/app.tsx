import {
	Link,
	Outlet,
	RouterProvider,
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Monty from "./Monty";

const Index = () => (
	<h1
		style={{
			color: "white",
		}}
	>
		Welcome to the Dashboard
	</h1>
);
const Settings = () => (
	<h1
		style={{
			color: "white",
		}}
	>
		Settings
	</h1>
);
const Profile = () => (
	<h1
		style={{
			color: "white",
		}}
	>
		Profile
	</h1>
);

const Layout = () => (
	<div style={{ fontFamily: "Arial, sans-serif" }}>
		<nav
			style={{
				backgroundColor: "#333",
				padding: "10px 0",
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
							color: "white",
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
							color: "white",
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
							color: "white",
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
							color: "white",
							textDecoration: "none",
							fontSize: "16px",
						}}
					>
						Monty
					</Link>
				</li>
			</ul>
		</nav>
		<hr />
		<div style={{ padding: "20px" }}>
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

const routeTree = rootRoute.addChildren([
	indexRoute,
	settingsRoute,
	profileRoute,
	montyRoute,
]);
const router = createRouter({ routeTree });

export function App() {
	return <RouterProvider router={router} />;
}
