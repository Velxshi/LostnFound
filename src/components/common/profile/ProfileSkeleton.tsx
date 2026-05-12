import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="w-full max-w-2xl">
      <div className="bg-cream-light-hover rounded-2xl px-6 py-2 md:py-3 flex gap-3 md:gap-5 items-center w-full max-w-2xl shadow mb-6 md:mb-9">
        <Skeleton className="h-14 w-14 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 w-full">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      <div className="bg-cream-light-hover rounded-2xl px-4 py-5 flex flex-col gap-6 w-full max-w-2xl shadow">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-full flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
