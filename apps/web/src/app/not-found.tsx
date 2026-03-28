"use client";

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-12 text-center">
      <h1 className="text-9xl font-black mb-4 text-emerald-500">404</h1>
      <h2 className="text-4xl font-black mb-8">Crop Not Found</h2>
      <p className="text-zinc-500 mb-12 max-w-md">
        The page you're looking for doesn't exist or has been harvested.
      </p>
      <Link 
        href="/dashboard"
        className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-emerald-400 transition-all"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
