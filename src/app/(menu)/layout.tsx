"use client";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  const title = usePathname().split("/").pop();
  const router = useRouter();
  function goBack() {
    router.back();
  }

  return (
    <div className="min-h-screen flex flex-col  bg-cream">
      <header className="w-full p-6 bg-cream-light-hover shadow">
        <div className="flex gap-6 items-center text-dark">
          <Icon icon="material-symbols:arrow-back-rounded" width="24" height="24" className="h-full w-auto" onClick={goBack} />

          <h1 className="font-poppins  text-title1 md:text-h4 font-semibold capitalize">{title}</h1>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-9">{children}</main>
    </div>
  );
}
