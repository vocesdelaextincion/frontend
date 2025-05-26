import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

import AuthLayout from "../layouts/authLayout/AuthLayout";
import Login from "../pages/login/Login";

// LAYOUTS
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  // id: "auth",
  path: "app",
  component: AuthLayout,
  // Podés agregar protección acá
  // beforeLoad: ({ context }) => {
  // if (!context.auth?.isAuthenticated) {
  //   throw redirect({ to: "/login" });
  // }
  // },
});

// ROUTES
// UNAUTH
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <div>Home</div>,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

// AUTH
const dashboardRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/dashboard",
  component: () => <div>Dashboard</div>,
});
const recordingsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/recordings",
  component: () => <div>Recordings</div>,
});
const tagsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/tags",
  component: () => <div>Tags</div>,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  homeRoute,
  authLayoutRoute.addChildren([dashboardRoute, recordingsRoute, tagsRoute]),
]);

export const router = createRouter({
  routeTree,
  // context: {
  //   auth: undefined, // lo podés completar desde un provider
  // },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
