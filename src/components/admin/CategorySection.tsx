"use client";
import SearchComponent from "@/components/common/button/Search";
import { useEffect, useState } from "react";
import CardStatistik from "./CardStatistik";
import { CategoryItemProps, ItemsResponse } from "@/types/categoryItems.types";
import CategoryItem from "./CategoryItem";
import Toast from "./Category/Toast/Toast";
import ModalAdd from "./Category/Modals/modalAdd";
import ModalEdit from "./Category/Modals/modalEdit";
import ModalDelete from "./Category/Modals/modalDelete";

// function CardStatistik

export default function CategorySection() {
  const [search, setSearch] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);
  const [items, setItems] = useState<ItemsResponse | null>(null);

  useEffect(() => {
    fetch(`/api/categories?search=${search}`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Gagal load reports: ", err));
  }, [search]);

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

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastWarna, setToastWarna] = useState("");

  const handleSuccessAction = (message: string, color: string) => {
    setToastMessage(message);
    setToastWarna(color);
    setShowToast(true);
  };

  const [popup, setPopup] = useState(false);
  return (
    <div className="w-full min-h-screen p-6 md:p-9">
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} warna={toastWarna} />}

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

          <div className="mt-4 flex flex-col gap-4 w-full">
            {items?.categories.map((item) => (
              <CategoryItem key={item.id} data={item} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      </div>

      <ModalAdd isOpen={popup} onClose={() => setPopup(false)} onSuccess={() => handleSuccessAction("Berhasil ditambahkan", "#D1E7DD")} />

      <ModalEdit
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setcategoryDipilih(null);
        }}
        category={categoryDipilih}
        onSuccess={() => handleSuccessAction("Berhasil Diubah", "#D1E7DD")}
      />

      <ModalDelete isOpen={DeleteOpen} onClose={() => setDeleteOpen(false)} category={categoryDipilih} onSuccess={() => handleSuccessAction("Berhasil Dihapus", "#D1E7DD")} />
    </div>
  );
}
