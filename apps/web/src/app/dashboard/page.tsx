// apps/web/src/app/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@agrochain/api';

export default function DashboardRouter() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await authAPI.getMe();
        const user = meRes.data.user;

        if (user.role === 'farmer') {
          router.push('/dashboard/farmer');
        } else if (user.role === 'trader') {
          router.push('/dashboard/trader');
        } else if (user.role === 'transporter') {
          router.push('/dashboard/transporter');
        } else {
          // Fallback for other roles or generic access
          router.push('/marketplace');
        }
      } catch (err) {
        console.error('Redirect failed:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );
}