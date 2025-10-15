import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { ConfigLayout } from 'src/layouts/config-split';
import { ContentLayout } from 'src/layouts/content-page';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

import { CustomerLayout } from '../../layouts/customer-split';

// ----------------------------------------------------------------------
const HomePage = lazy(() => import('src/pages/content-page/home'));
const ChatPage = lazy(() => import('src/pages/content-page/chat'));
const CustomerPage = lazy(() => import('src/pages/content-page/customer'));
const OttPage = lazy(() => import('src/pages/content-page/ott'));
const ReportPage = lazy(() => import('src/pages/content-page/report'));
const AdminPage = lazy(() => import('src/pages/content-page/admin'));
const CenterPage = lazy(() => import('src/pages/content-page/center'));
const UserPage = lazy(() => import('src/pages/content-page/user'));
const ClassPage = lazy(() => import('src/pages/content-page/class'));

const FingerMathPage = lazy(() => import('src/pages/content-page/fingermath'));
const SorobanPage = lazy(() => import('src/pages/content-page/soroban'));
const FranchisePage = lazy(() => import('src/pages/content-page/franchise'));

const GuidePage = lazy(() => import('src/pages/content-page/guide'));

const PermissionPage = lazy(() => import('src/pages/content-page/config/permission'));
const StaffGroupPage = lazy(() => import('src/pages/content-page/config/staff-group'));
const TicketPage = lazy(() => import('src/pages/content-page/ticket'));
// ----------------------------------------------------------------------

const layoutContent = (
  <ContentLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </ContentLayout>
);
const customerContent = (
  <CustomerLayout>
    <Suspense>
      <Outlet />
    </Suspense>
  </CustomerLayout>
);

export const contentPageRoutes = [
  {
    path: 'content',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    // element: CONFIG.auth.skip ? <>{layoutContent}</> :  <>{layoutContent}</>,
    children: [
      { element: <HomePage />, index: true },
      { path: 'report', element: <ReportPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'center', element: <CenterPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'class', element: <ClassPage /> },
      { path: 'fingermath', element: <FingerMathPage /> },
      { path: 'soroban', element: <SorobanPage /> },
      { path: 'franchise', element: <FranchisePage /> },
      { path: 'guide', element: <GuidePage /> },
      { path: 'chat', element: <ChatPage /> },
      {
        path: 'customer',
        element: <>{customerContent}</>,
        children: [
          {
            path: 'saved-contacts',
            element: <CustomerPage isSaved />,
            index: true,
          },
          {
            path: 'temporary-contacts',
            element: <CustomerPage />,
          },
        ],
      },
      {
        path: 'ticket',
        element: <Outlet />,
        children: [
          {
            element: <TicketPage title="" />,
            index: true,
          },
          {
            path: 'edit-ticket',
            element: <TicketPage isEdit />,
          },
        ],
      },
      { path: 'ott', element: <OttPage /> },
      {
        path: 'config',
        element: (
          <ConfigLayout>
            <Suspense fallback={<LoadingScreen />}>
            <Outlet />
            </Suspense>
          </ConfigLayout>
        ),
        children: [
          { path: 'permission', element: <PermissionPage />, index: true },
          { path: 'staff-group', element: <StaffGroupPage /> },
        ],
      },
    ],
  },
];
