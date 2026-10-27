import React from 'react';

export function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-3">
      <SkeletonBlock className="h-5 w-2/3" />
      <SkeletonBlock className="h-4 w-1/2" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-5/6" />
    </div>
  );
}

export function SectionSkeleton({ count = 3 }) {
  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="space-y-6">
          {Array.from({ length: count }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SkeletonBlock;
