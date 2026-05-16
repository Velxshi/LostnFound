import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="container flex flex-col relative">
      <Skeleton className="h-8 w-52 mb-3" />
      <div className="grid grid-cols-2 lg:grid-cols-4 lg:gap-16 gap-3 mt-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>

      <div className="mt-5 flex flex-row items-center justify-between mb-3 gap-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      <Skeleton className="h-74.5 rounded-xl" />

      <div className="flex flex-row items-center justify-between mb-4 mt-5">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
