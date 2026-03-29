"use client";

import React from 'react';

interface TimelineProps {
  currentState: string;
  dates?: Record<string, string>;
}

const Timeline: React.FC<TimelineProps> = ({ currentState, dates }) => {
  const steps = ['Created', 'Agreed', 'In Delivery', 'Delivered', 'Completed'];
  const currentIndex = steps.findIndex(step => step.toLowerCase().replace(' ', '_') === currentState.toLowerCase());

  return (
    <div className="py-4 space-y-4">
      {steps.map((step, index) => {
        const stepKey = step.toLowerCase().replace(' ', '_');
        const date = dates?.[stepKey];
        const isCompleted = index <= currentIndex;
        
        return (
          <div key={step} className="flex items-center gap-4">
            <div className={`w-5 h-5 rounded-full flex-shrink-0 ${isCompleted ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-zinc-800 border border-white/5'}`} />
            <div className="flex-1">
              <p className={`text-sm font-bold ${isCompleted ? 'text-white' : 'text-zinc-500'}`}>{step}</p>
              {date && <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{date}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;