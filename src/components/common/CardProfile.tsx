"use client";

import { Icon } from "@iconify/react";
import { useRouter, usePathname } from "next/navigation";
import { BlurFade } from "@/components/ui/blur-fade";
import { signOut, useSession } from "next-auth/react";
import { ProfilePicture } from "../ui/profile-picture";
export default function CardProfile() {
  const router = useRouter();
  const path = usePathname();
  const { data: session } = useSession();

  function isAdmin() {
    return path.startsWith("/admin");
  }
  function handlePush(link: string) {
    router.push(link);
  }

  function handleLogout() {
    signOut({
      callbackUrl: "/login", // Setelah logout, arahkan ke halaman login
      redirect: true,
    });
  }

  const menus = [
    {
      id: 1,
      title: "Laporan Saya",
      icon: "material-symbols:account-circle-outline",
      hint: "Lihat semua laporan yang saya buat",
      link: "/reports",
    },
    {
      id: 2,
      title: "Notifikasi",
      icon: "material-symbols:notifications-outline",
      hint: null,
      link: "/notifications",
    },
    {
      id: 3,
      title: isAdmin() ? "Masuk ke Mode Pengguna" : "Masuk Ke Mode Admin",
      icon: "material-symbols:change-circle-outline",
      hint: null,
      link: isAdmin() ? "/" : "/admin/dashboard",
    },
    {
      id: 4,
      title: "Mengenai Website Kami",
      icon: "mdi:heart-outline",
      hint: null,
      link: "/about",
    },
    {
      id: 5,
      title: "Keluar",
      icon: "material-symbols:logout",
      hint: "Keluar dari akun",
      action: "logout",
    },
  ];

  return (
    <div className="w-full max-w-2xl">
      <BlurFade delay={0.25} inView>
        <div className="bg-cream-light-hover rounded-2xl px-6 py-2 md:py-3 flex gap-3 md:gap-5 items-center w-full max-w-2xl shadow mb-6 md:mb-9">
          <div className="bg-primary p-1 rounded-full h-full w-auto shadow">
            <ProfilePicture />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-primary font-poppins font-bold text-title2 md:text-h5">{session?.user?.name ?? "Reina Ueda"}</h1>
            <h4 className="text-dark font-jakarta text-body md:text-title2">{session?.user?.email ?? "email@example.com"}</h4>
          </div>
        </div>
      </BlurFade>

      <BlurFade delay={0.75} inView>
        <div className="bg-cream-light-hover rounded-2xl px-4 py-5 flex flex-col gap-6 w-full max-w-2xl shadow">
          {menus.map((menu) => {
            return (
              <div
                key={menu.id}
                className="w-full flex justify-between items-center group cursor-pointer"
                onClick={() => {
                  if (menu.link) {
                    handlePush(menu.link);
                  } else if (menu.action === "logout") {
                    handleLogout();
                  }
                }}
              >
                <div className="flex gap-4 items-center">
                  <div className="h-full w-auto rounded-full p-2.5 bg-cream ">
                    <Icon icon={menu.icon} width="24" height="24" className="h-full w-auto text-primary" />
                  </div>

                  <div className="flex flex-col gap-1 transition group-hover:scale-105  duration-300">
                    <h3 className="text-dark font-poppins text-body font-medium">{menu.title}</h3>
                    {menu.hint && <h5 className="text-cream-dark font-jakarta text-caption ">{menu.hint}</h5>}
                  </div>
                </div>

                <Icon icon="weui:arrow-outlined" width="6.98" height="11.68" className="h-6 w-auto text-cream-dark transition group-hover:scale-150  duration-300" />
              </div>
            );
          })}
        </div>
      </BlurFade>
    </div>
  );
}
