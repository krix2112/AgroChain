import { Suspense } from 'react';
import TraderDashboard from '../../../components/figma/TraderDashboard';

export default function TraderDashboardPage() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <TraderDashboard />
    </Suspense>
  );
}
