"use client";
import { useEffect, useState } from "react";
import { CategoryItemProps } from "@/types/categoryItems.types";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Kategori({ onCategoryChange }: { onCategoryChange: (category: string) => void }) {
  const [categories, setCategories] = useState<CategoryItemProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok)
          toast.error("Gagal mengambil data, silakan memuat ulang", {
            className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]",
            position: "top-right",
          });
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        toast.error("Gagal mengambil data, silakan memuat ulang", {
          className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]",
          position: "top-right",
        });
      }
    };
    fetchData();
  }, []);

  const handleChange = (value: string) => {
    onCategoryChange(value === "all" ? "" : value);
  };

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-full lg:h-12 rounded-xl bg-cream-light px-5 font-poppins text-body font-medium text-dark shadow-sm">
        <SelectValue placeholder="Kategori" />
      </SelectTrigger>
      <SelectContent className="rounded-2xl bg-cream-light font-poppins">
        <SelectItem value="all" className="text-body text-cream-dark-active">
          Semua Kategori
        </SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id.toString()} className="text-body text-cream-dark-active">
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
