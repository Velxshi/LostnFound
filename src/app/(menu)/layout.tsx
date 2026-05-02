"use client";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const titleMap: { [key: string]: string } = {
    "/about": "Tentang Website Kami",
    "/notifications": "Notifikasi",
    "/reports": "Laporan Saya",
    "/form/temuan": "Laporkan Barang Temuan",
    "/form/hilang": "Laporkan Barang Hilang",
    "/form/klaim": "Form Klaim Barang",
    "/form/informasi": "Form Informasi Penemuan",
  };

  const title = titleMap[pathname] || pathname.split("/").pop();

  function goBack() {
    router.back();
  }

  return (
    <div className="min-h-screen flex flex-col  bg-cream">
      <header className="w-full p-6 bg-cream-light-hover shadow">
        <div className="flex gap-6 items-center text-dark">
          <Icon icon="material-symbols:arrow-back-rounded" width="24" height="24" className="h-full w-auto cursor-pointer" onClick={goBack} />

          <h1 className="font-poppins  text-title1 md:text-h5 font-semibold capitalize">{title}</h1>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-9 ">{children}</main>
    </div>
  );
}
