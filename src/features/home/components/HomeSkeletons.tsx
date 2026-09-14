import React from 'react';

export const HomeSkeletons: React.FC = () => {
  return (
    <div
      className="px-8 pt-6 pb-32 min-h-full bg-linear-to-b from-[#2a2a2a] via-[#1a1a1a] to-[#0e0e0e] text-white select-none animate-pulse"
      id="home-skeleton-stage"
    >
      {/* 1. Good Evening Section Skeleton */}
      <section className="mb-12" id="skeleton-greeting-section">
        <div className="flex items-center justify-between mb-6">
          <div className="h-9 w-52 bg-white/10 rounded-lg" />
          <div className="h-7 w-24 bg-white/5 rounded-full border border-white/5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={`quick-${i}`}
              className="flex items-center bg-white/5 rounded-lg overflow-hidden pr-16 h-20 border border-white/5"
            >
              <div className="w-20 h-20 bg-white/10 shrink-0" />
              <div className="px-5 flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded-md w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Made For You Section Skeleton */}
      <section className="mb-12" id="skeleton-recommendations-section">
        <div className="flex justify-between items-end mb-6">
          <div className="h-7 w-40 bg-white/10 rounded-md" />
          <div className="h-3.5 w-16 bg-white/5 rounded-md" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={`made-for-you-${i}`}
              className="bg-[#1a1a1a] p-4 rounded-xl flex flex-col h-full border border-white/5"
            >
              <div className="aspect-square rounded-md bg-white/10 mb-4" />
              <div className="h-4 bg-white/10 rounded-md w-4/5 mb-2.5" />
              <div className="h-3 bg-white/5 rounded-md w-full mb-1.5" />
              <div className="h-3 bg-white/5 rounded-md w-3/5" />
            </div>
          ))}
        </div>
      </section>

      {/* 3. Recently Played Section Skeleton */}
      <section className="mb-12" id="skeleton-recent-section">
        <div className="flex justify-between items-end mb-6">
          <div className="h-7 w-48 bg-white/10 rounded-md" />
          <div className="h-3.5 w-16 bg-white/5 rounded-md" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={`recent-${i}`} className="flex flex-col">
              <div className="aspect-square rounded-lg bg-white/10 mb-3" />
              <div className="h-4 bg-white/10 rounded-md w-3/4 mb-1.5" />
              <div className="h-3 bg-white/5 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}