"use client";
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 


import Logo from '../../../public/assets/logo/Logo.svg'; 
import DashboardIcon from '../../../public/Navbar-admin/Dashboard.svg';
import ReportsIcon from '../../../public/Navbar-admin/Reports.svg';
import MapIcon from '../../../public/Navbar-admin/map.svg';
import CategoryIcon from '../../../public/Navbar-admin/Category.svg';
import ProfileIcon from '../../../public/Navbar-admin/Profile.svg';
import DashboardIconActive from '../../../public/Navbar-admin/DashboardActive.svg';
import ReportsIconActive from '../../../public/Navbar-admin/ReportsActive.svg';
import MapIconActive from '../../../public/Navbar-admin/MapActive.svg';
import CategoryIconActive from '../../../public/Navbar-admin/CategoryActive.svg';
import ProfileIconActive from '../../../public/Navbar-admin/ProfileActive.svg';

const SidebarNavbar = () => {
  const pathname = usePathname(); 

  const navItems = [
    { name: 'Dashboard', icon: DashboardIcon, link: '/admin', iconactive: DashboardIconActive },
    { name: 'Reports', icon: ReportsIcon, link: '/admin/report', iconactive: ReportsIconActive },
    { name: 'Map', icon: MapIcon, link: '/admin/map', iconactive: MapIconActive },
    { name: 'Category', icon: CategoryIcon, link: '/admin/category', iconactive: CategoryIconActive },
    { name: 'Profile', icon: ProfileIcon, link: '/admin/profile', iconactive: ProfileIconActive },
  ];

  return (
    <nav className="fixed z-9999 bg-white border-gray-300 bottom-0 left-0 right-0 border-t pb-3 pt-3 px-4 lg:top-0 lg:bottom-0 lg:left-0 lg:w-64 lg:border-t-0 lg:border-r lg:pt-8 lg:px-6">
      
    
      <div className="hidden lg:flex items-center gap-3 mb-10 px-2">
        <div className="relative h-10 w-10">
    
          <Image src={Logo} alt="Logo" fill className="object-contain" />
        </div>
        <span className="text-blue-800 font-bold text-title1 font-poppins">Lost n Found</span>
      </div>

      <div className="mx-auto flex max-w-lg items-center justify-around 
        /* Desktop Adjustment */
        lg:flex-col lg:max-w-none lg:items-start lg:gap-4">
        
        {navItems.map((item) => {
          const isActive = pathname === item.link;

          return (
            <Link 
              key={item.name}
              href={item.link}
              className="flex flex-1 flex-col items-center gap-1 transition-all duration-200 active:scale-95
                /* Desktop Link Style */
                lg:flex-row lg:w-full lg:gap-4 lg:py-3 lg:px-4 lg:rounded-lg"
            >
              <div 
                className={`relative h-6 w-6 transition-all duration-200 ${
                  isActive 
                    ? '' 
                    : 'grayscale opacity-40'
                }`}
              >
                <Image 
                  src={isActive ? item.iconactive : item.icon} 
                  alt={item.name} 
                  fill
                  className="object-contain"
                />
              </div>

              <span
                className={`text-xs md:text-base font-bold transition-colors ${
                  isActive ? 'text-blue-700' : 'text-gray-400'
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