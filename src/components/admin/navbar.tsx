"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 

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

const BottomNavbar = () => {
  const pathname = usePathname(); 

  const navItems = [
    { name: 'Dashboard', icon: DashboardIcon, link: '/admin/dashboard', iconactive: DashboardIconActive },
    { name: 'Reports', icon: ReportsIcon, link: '/admin/reports', iconactive: ReportsIconActive },
    { name: 'Map', icon: MapIcon, link: '/admin/map', iconactive: MapIconActive },
    { name: 'Category', icon: CategoryIcon, link: '/admin/category', iconactive: CategoryIconActive },
    { name: 'Profile', icon: ProfileIcon, link: '/admin/profile', iconactive: ProfileIconActive },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-300 bg-white pb-3 pt-3 px-4 z-50 ">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.link;

          return (
            <Link 
              key={item.name}
              href={item.link}
              className="flex flex-1 flex-col items-center gap-1 transition-all duration-200 active:scale-90"
            >
              <div 
                className={`relative h-6 w-6 transition-all duration-200 ${
                  isActive 
                    ? 'text-blue-700 disabled ' 
                    : 'grayscale opacity-50'
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
                className={`text-caption font-bold transition-colors ${
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

export default BottomNavbar;