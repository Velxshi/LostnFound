"use client";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 


import Logo from '../../../public/assets/logo/Logo.svg'; 
import { Icon } from '@iconify/react';

const SidebarNavbar = () => {
  const pathname = usePathname(); 

  const navItems = [
    { name: 'Dashboard', icon: 'ri:dashboard-line', link: '/admin', iconactive: 'ri:dashboard-fill' },
    { name: 'Reports', icon: 'mdi:file-outline', link: '/admin/report', iconactive: 'mdi:file' },
    { name: 'Map', icon: 'mdi:compass-outline', link: '/admin/map', iconactive: 'mdi:compass' },
    { name: 'Category', icon: 'tabler:tag', link: '/admin/category', iconactive: 'tabler:tag-filled' },
    { name: 'Profile', icon: 'ic:outline-account-circle', link: '/admin/profile', iconactive: 'ic:round-account-circle' },
  ];

  return (
    <nav className="fixed z-998 bg-white border-gray-300 bottom-0 left-0 right-0 border-t pb-3 pt-3 px-4 lg:top-0 lg:bottom-0 lg:left-0 lg:w-64 lg:border-t-0 lg:border-r lg:pt-8 lg:px-6">
      
    
      <div className="hidden lg:flex items-center gap-3 mb-10 px-2">
        <div className="relative h-10 w-10">
    
          <Image src={Logo} alt="Logo" fill className="object-contain" />
        </div>
        <span className="text-blue-800 font-bold text-title1 font-poppins">Lost n Found</span>
      </div>

      <div className="mx-auto flex max-w-lg items-center justify-around lg:flex-col lg:max-w-none lg:items-start lg:gap-4">
        
        {navItems.map((item) => {
          const isActive = pathname === item.link;

          return (
            <Link 
              key={item.name}
              href={item.link}
              className="flex flex-1 flex-col items-center gap-1 transition-all duration-200 active:scale-95 lg:flex-row lg:w-full lg:gap-4 lg:py-3 lg:px-4 lg:rounded-lg"
            >
              <div 
                className={`relative h-6 w-6 transition-all duration-200 ${
                  isActive ? '' : 'grayscale opacity-40'
                }`}
              >
                <Icon
                  icon={isActive ? item.iconactive : item.icon} 
                  className="text-[28px] text-[#2848B7]"
                />
              </div>

              <span
                className={`text-xs  md:text-base font-bold transition-colors ${
                  isActive ? 'text-[#2848B7]' : 'text-gray-400'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default SidebarNavbar;