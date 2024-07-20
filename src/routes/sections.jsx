import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import ProtectedRoute from 'src/components/hoc/ProtectedRoute';

import DashboardLayout from 'src/layouts/dashboard';
import NewsEdit from 'src/sections/news/view/news-edit';
import NewsNew from 'src/sections/news/view/news-new';
import OrdersPage from 'src/pages/orders';
export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UsersPage = lazy(() => import('src/pages/users'));
export const TrainersPage = lazy(() => import('src/pages/trainers'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const SubscriptionsPage = lazy(() => import('src/pages/subscriptions'));
export const ExercisesPage = lazy(() => import('src/pages/exercises'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ProgramsPage = lazy(() => import('src/pages/programs'));
export const ProgramFormPage = lazy(() => import('src/pages/program-form'));
export const NewsPage = lazy(() => import('src/pages/news'));
// export const OrdersPage = lazy(() => import('src/pages/orders'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        { element: <UsersPage />, index: true },
        { path: 'users', element: <UsersPage /> },
        {
          path: 'products',
          element: <ProductsPage />,
        },
        {
          path: 'orders',
          element: <OrdersPage />,
        },
        // {
        //   path: 'news',
        //   element: <Outlet />,
        //   children: [
        //     { element: <NewsPage />, index: true }, // Default route for '/news'
        //     { path: 'new', element: <NewsNew /> },     // '/news/new'
        //     { path: ':id', element: <NewsEdit /> },  // '/news/:id'
        //   ], 
        // },
        // { path: 'subscriptions', element: <SubscriptionsPage /> },
        // { path: 'exercises', element: <ExercisesPage /> },
        // { path: 'programs', element: <ProgramsPage /> },
        // { path: 'program-form/:param', element: <ProgramFormPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'home',
      element: <IndexPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
