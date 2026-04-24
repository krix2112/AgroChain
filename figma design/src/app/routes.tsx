import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import Homepage from './pages/Homepage';
import FPOLogin from './pages/FPOLogin';
import FPORegister from './pages/FPORegister';
import TraderLogin from './pages/TraderLogin';
import TraderDashboard from './pages/TraderDashboard';
import Dashboard from './pages/Dashboard';
import Farmers from './pages/Farmers';
import Procurement from './pages/Procurement';
import Lots from './pages/Lots';
import Marketplace from './pages/Marketplace';
import Trades from './pages/Trades';
import Payments from './pages/Payments';
import PayoutTransparency from './pages/PayoutTransparency';
import TrustProfile from './pages/TrustProfile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: 'login',
    element: <FPOLogin />,
  },
  {
    path: 'register',
    element: <FPORegister />,
  },
  {
    path: 'trader/login',
    element: <TraderLogin />,
  },
  {
    path: 'trader/dashboard',
    element: <TraderDashboard />,
  },
  {
    path: 'dashboard',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: 'farmers',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Farmers />,
      },
    ],
  },
  {
    path: 'procurement',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Procurement />,
      },
    ],
  },
  {
    path: 'lots',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Lots />,
      },
    ],
  },
  {
    path: 'marketplace',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Marketplace />,
      },
    ],
  },
  {
    path: 'trades',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Trades />,
      },
    ],
  },
  {
    path: 'payments',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Payments />,
      },
    ],
  },
  {
    path: 'payout-transparency',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PayoutTransparency />,
      },
    ],
  },
  {
    path: 'trust-profile',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <TrustProfile />,
      },
    ],
  },
]);
