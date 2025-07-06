import { createRouter, createRootRoute, createRoute, redirect } from '@tanstack/react-router';
import Root from './Root';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import UsersPage from '../pages/users/UsersPage';
import RecordingsPage from '../pages/recordings/RecordingsPage';
import TagsPage from '../pages/tags/TagsPage';
import type { AuthContextType } from '../contexts/AuthContext';

const rootRoute = createRootRoute();

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  component: Root,
  beforeLoad: ({ context }) => {
    // @ts-expect-error context is not inferred correctly, but will be available at runtime
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
      });
    }
  },
});

const indexRoute = createRoute({
    getParentRoute: () => authenticatedRoute,
    path: '/',
    beforeLoad: () => {
        throw redirect({
            to: '/dashboard',
        });
    },
});

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const usersRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/users',
  component: UsersPage,
});

const recordingsRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/recordings',
  component: RecordingsPage,
});

const tagsRoute = createRoute({
    getParentRoute: () => authenticatedRoute,
    path: '/tags',
    component: TagsPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  authenticatedRoute.addChildren([indexRoute, dashboardRoute, usersRoute, recordingsRoute, tagsRoute]),
]);

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined! as AuthContextType,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
