import { Spinner } from "@/components/ui/spinner";
import { motion as Motion } from "motion/react";

export function Loading() {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-6">
      <Spinner className="size-8 text-primary" />
      <Motion.p className="font-poppins font-semibold text-body md:text-title2 text-primary" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
        Mohon Tunggu Sebentar :D
      </Motion.p>
    </div>
  );
}
