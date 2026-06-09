"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "../../../public/assets/logo/Logo.svg";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";

const SidebarNavbar = () => {
  const pathname = usePathname();

  const { data: session } = useSession();

  const navItems = [
    {
      name: "Dashboard",
      icon: "ri:dashboard-line",
      link: "/admin",
      iconactive: "ri:dashboard-fill",
      permission: "menu:dashboard",
    },
    {
      name: "Reports",
      icon: "mdi:file-outline",
      link: "/admin/reports",
      iconactive: "mdi:file",
      permission: "menu:dashboard",
    },
    {
      name: "Map",
      icon: "mdi:compass-outline",
      link: "/admin/map",
      iconactive: "mdi:compass",
      permission: "menu:dashboard",
    },
    {
      name: "Category",
      icon: "tabler:tag",
      link: "/admin/category",
      iconactive: "tabler:tag-filled",
      permission: "menu:category",
    },
    {
      name: "Users",
      icon: "solar:users-group-two-rounded-linear",
      link: "/admin/users",
      iconactive: "solar:users-group-two-rounded-bold",
      permission: "menu:users",
    },
    {
      name: "Hak Akses",
      icon: "mdi:shield-key-outline",
      link: "/admin/hak-akses",
      iconactive: "mdi:shield-key",
      permission: "menu:hak-akses",
    },
    {
      name: "Profile",
      icon: "ic:outline-account-circle",
      link: "/admin/profile",
      iconactive: "ic:round-account-circle",
      permission: null,
    },
  ];

  const userPermissions = session?.user?.permissions ?? [];

  const filteredNavItems = navItems.filter((item) => {
    if (item.permission === null) return true;
    return userPermissions.includes(item.permission);
  });

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-998 border-t py-3 px-4 
      lg:sticky lg:top-0 lg:flex lg:flex-col lg:h-screen lg:w-64 
      lg:border-t-0 lg:border-r lg:pt-8 lg:px-6 
      bg-cream-light-hover border-[#F3F4F6] border w-screen"
    >
      <div className="hidden lg:flex items-center gap-3 mb-10 px-2">
        <div className="relative h-10 w-10">
          <Image src={Logo} alt="Logo" fill className="object-contain" />
        </div>
        <span className="text-primary font-bold text-title1 font-poppins">Lost n Found</span>
      </div>

      <div className="w-full flex  items-center justify-between lg:flex-col lg:max-w-none lg:items-start lg:gap-4">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.link;

          return (
            <Link key={item.name} href={item.link} className="flex flex-1 flex-col items-center gap-1 transisi active:scale-95 lg:flex-row lg:w-full lg:gap-4 lg:py-3 lg:px-4 lg:rounded-lg">
              <Icon icon={isActive ? item.iconactive : item.icon} className={` h-5 md:h-7 w-auto transisi ${isActive ? "text-primary" : "text-cream-dark"}`} />

              <span className={`text-caption  md:text-title1  transition-colors ${isActive ? "text-primary font-bold" : "text-cream-dark"}`}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default SidebarNavbar;
