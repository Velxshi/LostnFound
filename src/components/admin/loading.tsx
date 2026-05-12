import { Spinner } from "@/components/ui/spinner"

export function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center gap-6">
      <Spinner className="size-8 text-[#2848b7]" />
    </div>
  )
}
