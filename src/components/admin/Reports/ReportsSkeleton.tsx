import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsSkeleton() {
  return (
    <div className="w-full">
      <div className="flex flex-col w-full mx-auto">
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="pt-5 relative z-20 flex gap-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="pt-5 relative z-20">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <div className="pt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
