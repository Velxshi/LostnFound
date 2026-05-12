import { Skeleton } from "@/components/ui/skeleton";

export default function CategorySkeleton() {
  return (
    <div className="w-full min-h-screen p-6 md:p-9">
      <Skeleton className="h-8 w-52 mb-3" />

      <div className="lg:hidden mb-4">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      <div className="flex justify-between items-center gap-4 mt-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center gap-4">
        <div className="lg:flex hidden w-full">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="h-13.25 w-full lg:w-80 rounded-lg" />
      </div>

      <div className="mt-4 flex flex-col gap-4 w-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
