'use client';
import SearchComponent from "@/components/admin/reports/Search";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import ListCategory from "@/components/admin/Category/ListCategory";
import ModalAdd from "@/components/admin/Category/Modals/modalAdd";
import ModalEdit from "@/components/admin/Category/Modals/modalEdit";
import ModalDelete from "@/components/admin/Category/Modals/modalDelete";
import Toast from "@/components/admin/Category/Toast/Toast";
export default function Category(){

const [categories, setCategories] = useState<any>([]);
const [search, setSearch] = useState("");
const [popup, setpopup] = useState(false);

const [editOpen, seteditOpen] = useState(false);
const [DeleteOpen, setDeleteOpen] = useState(false);
const [categoryDipilih, setcategoryDipilih] = useState<any>(null);

const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState("");
const [toastWarna, setToastWarna] = useState("");


 const fetchData = async () => {
    try {
      const response = await fetch(`/api/categories?search=${search}`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleEdit = (category: any) => {
    setcategoryDipilih(category);
    seteditOpen(true);
  };

  const handleDelete = (category: any) => {
    setcategoryDipilih(category);
    setDeleteOpen(true);
};

const handleSuccessAction = (message: string, color: string) => {
    setToastMessage(message);
    setToastWarna(color);
    setShowToast(true);
    fetchData();
  };

    const totalbarang = categories.totalItems;
    const totalcategories = categories.totalCategories;

    return (


        <div className="w-full min-h-screen p-6">
            {showToast && (
        <Toast
        message={toastMessage} 
        onClose={() => setShowToast(false)}
        warna={toastWarna}        
        />
      )}
            <div className="w-full ">
            <h1 className="text-2xl font-bold text-gray-800 font-poppins">Kelola Kategori</h1>
            <div className="mt-3">
            <div className="lg:hidden">
            <SearchComponent onSearch={setSearch} />
            </div>
            <div className=" flex justify-between items-center gap-4 mt-4">
                <div className="card w-full h-24.5 md:h-36  bg-[#FEFEFE] rounded-[20px] flex flex-col items-center justify-center gap-2">
                    <div className="logo">
                        <Icon icon="tabler:layout-2" className="text-[#2848B7]  w-full md:w-6.75 md:h-7.5 lg:w-7.25 lg:h-8.25"/>
                    </div>
                    <p className="font-poppins text-title2 lg:text-[24px] font-bold">{totalbarang}</p>
                    <p className="text-caption lg:text-[14px]! text-[#B9B6B4] font-poppins">Total Barang</p>
                </div>

                <div className="card w-full h-24.5 md:h-36 bg-[#FEFEFE] rounded-[20px] flex flex-col items-center justify-center gap-2">
                    <div className="logo">
                        <Icon icon="gravity-ui:shapes-3" className=" text-[#2848B7] w-full md:w-6.75 md:h-7.5 lg:w-7.25 lg:h-8.25"/>
                    </div>
                    <p className="font-poppins text-title2 lg:text-[24px] font-bold">{totalcategories}</p>
                    <p className="text-caption lg:text-[14px]! text-[#B9B6B4] font-poppins">Kategori</p>
                </div>
                </div>

                <div className="mt-4 flex justify-between items-center gap-4">
                    <div className="lg:flex hidden w-full">
                    <SearchComponent onSearch={setSearch} />
                </div>
                    <button 
                        className="bg-[#2848B7] hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg w-full h-13.25 font-poppins cursor-pointer lg:w-80 active:scale-95  duration-150 transition-colors"
                        onClick={() => setpopup(true)}
                    >
                        Tambah Kategori
                    </button>
                </div>

                <div className="mt-4">
                    <ListCategory data={categories} onEdit={handleEdit} refreshData={fetchData} onDelete={handleDelete}/>
                </div>
            </div>
            </div>

            <ModalAdd isOpen={popup} onClose={() => setpopup(false)} onSuccess={() => handleSuccessAction("Berhasil ditambahkan", "#D1E7DD")}/>

                <ModalEdit 
                isOpen={editOpen} 
                onClose={() => {
                seteditOpen(false);
                setcategoryDipilih(null);
                }} 
                category={categoryDipilih}
                onSuccess={() => handleSuccessAction("Berhasil Diubah", "#D1E7DD")}
            />

            <ModalDelete 
            isOpen={DeleteOpen} 
            onClose={() => setDeleteOpen(false)} 
            category={categoryDipilih} 
            onSuccess={() => handleSuccessAction("Berhasil Dihapus", "#D1E7DD")}
            />
        </div>
    );
}