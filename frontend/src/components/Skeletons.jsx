function Shimmer({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-border/60 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="card p-5">
      <Shimmer className="h-3 w-24 mb-4" />
      <Shimmer className="h-8 w-16 mb-3" />
      <Shimmer className="h-3 w-32" />
    </div>
  );
}

export function SkeletonTask() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Shimmer className="h-4 w-4 rounded" />
      <div className="flex-1">
        <Shimmer className="h-3.5 w-48 mb-2" />
        <Shimmer className="h-3 w-28" />
      </div>
      <Shimmer className="h-3 w-16" />
    </div>
  );
}

export function SkeletonProject() {
  return (
    <div className="card p-5">
      <Shimmer className="h-4 w-40 mb-3" />
      <Shimmer className="h-3 w-full mb-2" />
      <Shimmer className="h-3 w-3/4 mb-4" />
      <Shimmer className="h-2 w-full rounded-full mb-3" />
      <Shimmer className="h-3 w-24" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTask key={i} />
      ))}
    </div>
  );
}
