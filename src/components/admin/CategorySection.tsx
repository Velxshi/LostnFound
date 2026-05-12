"use client";
import SearchComponent from "@/components/common/button/Search";
import { useCallback, useEffect, useRef, useState } from "react";
import CardStatistik from "./CardStatistik";
import { CategoryItemProps, ItemsResponse } from "@/types/categoryItems.types";
import CategoryItem from "./CategoryItem";

import ModalDelete from "./Category/Modals/modalDelete";
import { toast } from "sonner";
import { BlurFade } from "../ui/blur-fade";
import CategorySkeleton from "./Category/CategorySkeleton";
import CategoryModal from "./Category/Modals/CategoryModal";
import { Spinner } from "../ui/spinner";

// function CardStatistik
export default function CategorySection() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [items, setItems] = useState<ItemsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const isFirstLoad = useRef(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const refreshData = useCallback(async () => {
    try {
      if (isFirstLoad.current) {
        setLoading(true);
      } else {
        setSearching(true);
      }

      const res = await fetch(`/api/categories?search=${debouncedSearch}`);
      if (!res.ok) toast.error("Gagal load kategori", { className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]", position: "top-right" });
      const data = await res.json();
      setItems(data);
    } catch (err) {
      toast.error("Gagal load kategori", { className: "font-poppins !text-center !bg-[#FFDAD6] !border !border-[#C4C5D5] !rounded-xl !text-[#BA1A1A] !w-fit !min-w-[200px] !max-w-[90vw]", position: "top-right" });
    } finally {
      setLoading(false);
      setSearching(false);
      isFirstLoad.current = false;
    }
  }, [debouncedSearch]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const totalItems = items?.totalItems || 0;
  const totalCategories = items?.totalCategories || 0;

  const statistikItem = [
    {
      label: "Total Barang",
      icon: "tabler:layout-2",
      total: totalItems,
    },
    {
      label: "Kategori",
      icon: "gravity-ui:shapes-3",
      total: totalCategories,
    },
  ];

  const [editOpen, setEditOpen] = useState(false);
  const [DeleteOpen, setDeleteOpen] = useState(false);
  const [categoryDipilih, setcategoryDipilih] = useState<CategoryItemProps | null>(null);

  const handleEdit = (category: CategoryItemProps) => {
    setcategoryDipilih(category);

    setEditOpen(true);
  };

  const handleDelete = (category: CategoryItemProps) => {
    setcategoryDipilih(category);
    setDeleteOpen(true);
  };

  const handleSuccessAction = (message: string) => {
    toast.success(message, { className: "font-poppins !text-center !bg-[#D1E7DD] !border !border-[#BADBCC] !rounded-xl !text-[#0F5132] !w-fit !min-w-[200px] !max-w-[90vw]", position: "top-right" });
    refreshData();
  };

  const [popup, setPopup] = useState(false);

  if (loading) return <CategorySkeleton />;
  return (
    <div className="w-full min-h-screen p-6 md:p-9">
      <BlurFade delay={0.45} inView>
        <div className="w-full">
          <h1 className="text-2xl font-bold text-dark font-poppins">Kelola Kategori</h1>

          <div className="mt-3">
            <div className="lg:hidden">
              <SearchComponent onSearch={setSearch} />
            </div>
            <div className="flex justify-between items-center gap-4 mt-4">
              {statistikItem.map((item) => (
                <CardStatistik key={item.label} icon={item.icon} label={item.label} total={item.total} />
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center gap-4">
              <div className="lg:flex hidden w-full">
                <SearchComponent onSearch={setSearch} />
              </div>
              <button className="bg-primary hover:bg-primary-hover text-cream font-bold py-2 px-4 rounded-lg w-full h-13.25 font-poppins cursor-pointer lg:w-80 active:scale-95  duration-150 transition-colors" onClick={() => setPopup(true)}>
                Tambah Kategori
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-4 w-full relative">
              {searching && (
                <div className="w-full inset-0 absolute flex justify-center items-center z-50 bg-[#F7F3F0]">
                  <Spinner className="size-5 text-primary" />
                </div>
              )}
              {items?.categories.map((item) => (
                <CategoryItem key={item.id} data={item} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
              {items?.categories.length === 0 && (
                <div className="w-full flex justify-center items-center z-50 bg-[#F7F3F0]">
                  <p className="text-dark font-poppins">Kategori tidak ditemukan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </BlurFade>

      <CategoryModal isOpen={popup} onClose={() => setPopup(false)} onSuccess={() => handleSuccessAction("Berhasil ditambahkan")} />
      <CategoryModal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setcategoryDipilih(null);
        }}
        onSuccess={() => handleSuccessAction("Berhasil diubah")}
        category={categoryDipilih}
      />

      <ModalDelete isOpen={DeleteOpen} onClose={() => setDeleteOpen(false)} category={categoryDipilih} onSuccess={() => handleSuccessAction("Berhasil Dihapus")} />
    </div>
  );
}
