import { Skeleton } from "@/components/ui/skeleton";

export default function DetailItemSkeleton() {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-4">
        <Skeleton className="w-full aspect-video rounded-2xl" />

        <div className="flex justify-between items-start gap-4">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-9 w-16 rounded-lg" />
        </div>

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>

      <Skeleton className="w-full h-12 rounded-xl" />
    </div>
  );
}
