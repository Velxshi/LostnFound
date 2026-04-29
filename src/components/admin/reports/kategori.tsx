"use client";
import { useEffect, useState } from "react";


export default function Kategori({ onCategoryChange }: { onCategoryChange: (category: string) => void }) {
const [isOpen, setIsOpen] = useState(false);
const [selected, setSelected] = useState('Kategori');


 const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {   
                const response = await fetch('/api/categories');
                const data = await response.json();
        setCategories(data.categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
        };
        fetchData();
    }, []);

const handleSelect = (category: any) => {
  if (category === "") {
    setSelected('Kategori');
    onCategoryChange("");
  } else {
    setSelected(category.name);
    onCategoryChange(category.id.toString()); 
  }
  setIsOpen(false);
};
return (
    <div className="relative inline-block w-full lg:h-12 cursor-pointer">
    <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl bg-white px-5 py-3 text-sm font-medium text-gray-800 shadow-sm transition-all hover:bg-gray-50 active:scale-95"
    >
        <span className="font-poppins">{selected}</span>
        <svg
        className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.5"
        >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    </button>

    {isOpen && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl bg-white shadow-lg  animate-in fade-in zoom-in duration-100 cursor-pointer">
        <div className="py-1">
            {categories.map((category: any) => (
           <button
                key={category.id}
            
                onClick={() => handleSelect(category)}
                className="block w-full px-5 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors font-poppins">
                {category.name}
              </button>
            ))}
        </div>
        </div>
    )}
    </div>
);
};

